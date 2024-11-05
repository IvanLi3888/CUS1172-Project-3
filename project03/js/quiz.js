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
var time_elapsed;
var total_questions;
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

    const data = await fetch("https://my-json-server.typicode.com/IvanLi3888/CUS1172-Project-3/quiz-bank/" + quiz_id);
    const model = await data.json();

    console.log("Fetched model:", model);
    console.log("Question id:" + question_id);
    console.log("Selected question data:", model.questions[question_id - 1].type);

    // if start of quiz, set total amount of questions and set up scoreboard 
    if (question_id - 1 == 0) {
        total_questions = model.questions.length;
        console.log(total_questions);
        console.log("Staring Quiz");

        // set/reset starting values
        questions_answered = 1;
        questions_correct = 0;
        time_elapsed = 0;


        // set up scoreboard
        view = render_scoreboard();
        document.querySelector("#scoreboard-widget").innerHTML = view;


    }
    // update the numbers on the scoreboard
    update_scoreboard();


    console.log("Rendering view");

    if (model.questions[question_id - 1].type == "multiple-choice") {
        // if question is multiple choice
        var source = document.querySelector("#quiz-multiple-choice").innerHTML;

    } else if (model.questions[question_id - 1].type == "open-ended") {
        // if question is open-ended
        var source = document.querySelector("#quiz-open-ended").innerHTML;
    } else if (model.questions[question_id - 1].type == "image") {
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

var render_incorrect = (view_id) => {
    console.log("Rendering explanation view");
    var source = document.querySelector(view_id).innerHTML;
    var template = Handlebars.compile(source);
    // TODO put explanations in json
    var html = template();
    return html;
}

var render_scoreboard = () => {
    console.log("Rendering scoreboard");
    var source = document.querySelector("#scoreboard-view").innerHTML;
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
        // gets the button value or form value depending on type of question
        if (document.getElementById("submit-answer") !== null) {
            var answer = document.querySelector("#answer").value;
        } else {
            var answer = e.target.value;
        }
        console.log(answer);

        // handling if answer is right or not
        if (answer == correct_answer) {
            // if right, say the well done display and move on
            quiz_correct();
        } else {
            // if wrong, say right answer and explanation view
            quiz_incorrect(answer, correct_answer);
        }

    }

    return false;

}

// handle quizzing
var quiz_correct = () => {

    console.log("Right");

    questions_correct++;
    update_scoreboard();
    const view = render_welldone("#well-done");

    document.querySelector("#quiz-widget").innerHTML = view;

    setTimeout(async () => {
        // TODO put a if statement to check if end of quiz and if so put function to go elsewhere
        questions_answered++;
        const view = await render_quiz_question(quiz, questions_answered);
        

        document.querySelector("#quiz-widget").innerHTML = view;
    }, 1000);
}
// TODO
var quiz_incorrect = (answer, correct_answer) => {
    console.log("Wrong");
    console.log("Your Answer: " + answer);
    console.log("Correct Answer: " + correct_answer);
    // TODO put a function to show correct answer view
    
    const view = render_incorrect("#wrong-answer");

    document.querySelector("#quiz-widget").innerHTML = view;
    // TODO put a if statement to check if end of quiz and if so put function to go elsewhere

}

var end_of_quiz = () => {
    // TODO handle if end of quiz
    if (questions_answered == total_questions) {
        // display view of the end screen and stuff
    }
}

var update_scoreboard = () => {
    document.getElementById("number-correct").innerHTML = "Number of correct answers: " + questions_correct;
    document.getElementById("number-answered").innerHTML = "Question #" + questions_answered;
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