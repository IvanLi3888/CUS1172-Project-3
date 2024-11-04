document.addEventListener("DOMContentLoaded", () => {

    view = render_login("#landing-pad")

    document.querySelector("#quiz-widget").innerHTML = view;

    // adds event handler to page
    document.querySelector("#quiz-widget").onclick = (e) => {
        handle_event(e);
    }
})
// keep track of variables
var username;
let quizzes = [];

// storing the score
var correct_answer;
var questions_answered;
var questions_correct;
var total_questions;
var time_elapsed;
var quiz;

var render_login = (view_id) => {
    console.log("Rendering startup");
    var source = document.querySelector(view_id).innerHTML;
    var template = Handlebars.compile(source);

    var html = template();
    return html;
    // document.querySelector("#quiz-widget").innerHTML = template;

}

var render_quiz_select = (view_id, username) => {
    console.log("Rendering view");
    var source = document.querySelector(view_id).innerHTML;
    var template = Handlebars.compile(source);
    var html = template({ name: username });

    return html;
}


var render_quiz_question = async (quiz_id, question_id) => {

    quiz = quiz_id;
    questions_answered++;

    const data = await fetch("https://my-json-server.typicode.com/IvanLi3888/CUS1172-Project-3/quiz-bank/" + quiz_id);
    const model = await data.json();

    console.log("Fetched model:", model);
    console.log("Selected question data:", model.questions[question_id - 1].type);

    // if start of quiz, set total amount of questions and set up scoreboard 
    if (question_id - 1 == 0) {
        total_questions = model.questions.length;
        console.log(total_questions);

        // set up scoreboard
    }

    console.log("Rendering view");

    if (model.questions[question_id - 1].type == "multiple-choice") {
        // if question is multiple choice
        var source = document.querySelector("#quiz-multiple-choice").innerHTML;

    } else if (model.questions[question_id - 1].type == "open-ended") {
        // if question is open-ended
        var source = document.querySelector("#quiz-open-ended").innerHTML;
    } else if (model.questions[question_id - 1].type == "image"){
        var source = document.querySelector("#quiz-image").innerHTML;
    }

    var template = Handlebars.compile(source);
    var html = template(model.questions[question_id - 1]);
    correct_answer = model.questions[question_id - 1].correct;
    console.log(correct_answer);
    return html;

}
var render_welldone = (view_id) => {
    console.log("Rendering Well done");
    var source = document.querySelector(view_id).innerHTML;
    var template = Handlebars.compile(source);

    var html = template();
    return html;


}
async function handle_event(e) {
    if (e.target.id == "submit-name") {
        login_user(document.querySelector("#name").value);

    }
    // handles event when user clicks on a quiz in order to take the quiz
    if (e.target.className == "quiz-enter" && quizzes.includes(e.target.textContent)) {
        console.log(e.target.textContent);
        questions_answered = 0;
        const view = await render_quiz_question(e.target.value, 1);

        document.querySelector("#quiz-widget").innerHTML = view;
        // add code here to render the quiz chosen and start the quiz
    }
    // handles event when user chooses an answer
    if (e.target.classList.contains("answer-option") || e.target.id == "submit-answer") {
        // handling if answer is right or not
        if (document.getElementById("submit-answer") !== null){
            var answer = document.querySelector("#answer").value;
        } else{
            var answer = e.target.value;
        }
        console.log(answer);
        if (answer == correct_answer) {
            // if right, say the well done display and move on
            quiz_correct();
        } else {
            // if wrong, say right answer and explanation
            quiz_incorrect();
        }
        // check if end of quiz, if so then show score and further details and go back to main
    }

    return false;

}

// handle quizzing
var quiz_correct = () => {

    console.log("Right");
    questions_correct++;
    const view = render_welldone("#well-done");

    document.querySelector("#quiz-widget").innerHTML = view;

    setTimeout(async () => {
        const view = await render_quiz_question(quiz, questions_answered + 1);

        document.querySelector("#quiz-widget").innerHTML = view;
    }, 1000);
}
// TODO
var quiz_incorrect = () => {
    console.log("Wrong");

}



// handle login

var login_user = async (input) => {
    username = input;
    view = render_quiz_select("#quiz-select", username);

    document.querySelector("#quiz-widget").innerHTML = view;

    var menu = document.getElementById("menu");

    // gets each quiz name and makes a button for each
    const data = await fetch("https://my-json-server.typicode.com/IvanLi3888/CUS1172-Project-3/quiz-bank");
    const model = await data.json();
    for (let i = 0; i < model.length; i++) {
        console.log(model[i]);
        quizzes.push(model[i].title);
        var bt = document.createElement("button");
        bt.className = "quiz-enter";
        bt.textContent = model[i].title;
        bt.value = model[i].id;
        menu.append(bt);


    }
    console.log(quizzes);



}