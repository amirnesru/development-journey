var form = document.querySelector("form");
var input = document.getElementById("task-input");
var ul = document.getElementById("task-list");
var message = document.getElementById("message");
var counter = document.querySelector(".task-stats p");

function updateCount() {
    counter.innerText = ul.children.length + " tasks";
    }

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (input.value.trim() === "") {
        message.innerText = "You have to submit a task";
        message.classList.add("error")
        setTimeout(function () {
            message.innerText = "";
            message.classList.remove("error");
        }, 2500);

        return;
    }
    
    message.innerText = "";

    var li = document.createElement("li");
    li.innerText = input.value;

    var delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    li.addEventListener("click", function () {
        li.classList.toggle("done");
        console.log("LI CLICKED");
    });

    delBtn.addEventListener("click", function (e) {
        e.stopPropagation();    
        li.remove();
        updateCount();
    });
    li.appendChild(delBtn);

    ul.appendChild(li);
    updateCount();

    input.value = "";
});/
