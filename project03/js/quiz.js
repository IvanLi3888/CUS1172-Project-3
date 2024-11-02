document.addEventListener("DOMContentLoaded", () => {

    view = render_login("#landing-pad")

    document.querySelector("#quiz-widget").innerHTML = view;

    // adds event handler to page
    document.querySelector("#quiz-widget").onclick = (e) => {
        handle_event(e);
    }
})

var username;
let quizzes = [];

var model = [


];

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

function handle_event(e) {
    if (e.target.id == "submit-name") {
        login_user(document.querySelector("#name").value);

    }
    
    if (e.target.class == "quiz-enter" && quizzes.includes(e.target.textContent)) {
        console.log(e.target.class);
    }
    return false;

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
    for (let i = 0; i <= model.length; i++) {
        quizzes.push(model[i].title);
        var bt = document.createElement("button");
        bt.class = "quiz-enter";
        bt.textContent = model[i].title;
        bt.value = model[i].id;

        menu.append(bt);
    }



}