function DefaultDate(){
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month}-${day}`
}

function markAsComplete(e) {
    const li = e.target.parentElement;
    li.classList.toggle("completed");
}

function tasksCheck() {
    // This function checks if ul contains children or not. According to that it add or removes hidden class
    const tasksHeading = document.getElementById("heading-tasks");
    const ulElement = document.getElementById("items");
    const children = ulElement.children;


    if (children.length === 0){
        tasksHeading.classList.toggle("hidden")
        document.querySelector(".clear_btn").style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", tasksCheck);

window.onload = () => {
    const dueDateInput = document.getElementById("dueDate");
    flatpickr(dueDateInput, {
        enableTime: false, // If you want to enable time selection as well
        dateFormat: "Y-m-d", // Adjust the date format as needed
    });

    loadTasksFromLocalStorage();

    const form1 = document.querySelector("#addForm");
    const items = document.getElementById("items");
    const submit = document.getElementById("submit");
    let editItem = null;

    form1.addEventListener("submit", addItem);
    items.addEventListener("click", handleItemClick);
    const modeToggleBtn = document.getElementById('modeToggle');
    modeToggleBtn.addEventListener('click', toggleMode);
    // Add event listener for checkboxes
    const checkboxes = document.querySelectorAll(".form-check-input");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", markAsComplete);
    });

    const body = document.getElementsByTagName('body')[0];
    body.classList.add('light-mode');
};

function toggleMode() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}
let editItem = null;

function addItem(e) {
    e.preventDefault();

    if (submit.value !== "Add Task") {
        editItem.target.parentElement.childNodes[1].textContent = document.getElementById("item").value;
        submit.value = "Add Task";
        document.getElementById("item").value = "";

        displaySuccessMessage("Text edited successfully");
        editItem = null;
        saveTasksToLocalStorage();
        return false;
    }
    tasksCheck()
    const newItem = document.getElementById("item").value;
    if (!document.getElementById("dueDate").value){
        document.getElementById("dueDate").value = DefaultDate();
    }
    const dueDate = document.getElementById("dueDate").value;

    // Check if the due date has already passed
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);

    const tasksHeading = document.getElementById("heading-tasks");
    const ulElement = document.getElementById("items");
    const children = ulElement.children;

    if (dueDateObj < currentDate && children.length === 0) {
        displayErrorMessage("Due date has already passed");
        tasksHeading.classList.add("hidden");
        return false;
    }else if (dueDateObj < currentDate && children.length > 0){
        displayErrorMessage("Due date has already passed");
        return false;
    }else{
        tasksHeading.classList.remove("hidden");
    }

    if (newItem.trim() === "") return false;
    else document.getElementById("item").value = "";

    if(newItem.trim() !== "") {
        document.querySelector(".clear_btn").style.display = "inline";
    }

    const li = document.createElement("li");
    li.className = "list-group-item";

    dispatchEvent.className = "form-check"
    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "form-check-input task-completed";
    completeCheckbox.addEventListener("change", markAsComplete);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm float-right delete";
    deleteButton.appendChild(document.createTextNode("Delete"));

    const editButton = document.createElement("button");
    editButton.className = "btn btn-success btn-sm float-right edit";
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.style.marginRight = "8px";

    // Create a click event listener for the edit button
    editButton.addEventListener("click", function (e) {
        handleEditClick(e);
    });

    // Get the current date and time
    const creationDateTime = new Date().toLocaleString();

    // Create a paragraph element to display the creation date and time
    const dateTimeParagraph = document.createElement("p");
    dateTimeParagraph.className = "text-muted";
    dateTimeParagraph.id = 'created-at';
    dateTimeParagraph.style.fontSize = "15px"; // Set font size
    dateTimeParagraph.style.margin = "0 19px"; // Set margin
    dateTimeParagraph.appendChild(document.createTextNode("Created: " + creationDateTime));

    // Create a paragraph element for the due date
    const dueDateParagraph = document.createElement("p");
    dueDateParagraph.className = "text-muted";
    dueDateParagraph.id = 'task-dueDate';
    dueDateParagraph.style.fontSize = "15px";
    dueDateParagraph.style.margin = "0 19px";
    dueDateParagraph.appendChild(document.createTextNode("Due Date: "));

    const dueDateSpan = document.createElement("span");
    dueDateSpan.id = "dueDateSpan"; // You can add an ID to reference it later
    dueDateSpan.style.fontWeight = "bold"; // Customize the styling as needed
    dueDateParagraph.appendChild(document.createTextNode(dueDate));
    dueDateParagraph.appendChild(dueDateSpan);

    li.appendChild(completeCheckbox);
    li.appendChild(document.createTextNode(newItem));
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    li.appendChild(dateTimeParagraph);
    li.appendChild(dueDateParagraph);

    items.appendChild(li);
    saveTasksToLocalStorage();
    document.getElementById("dueDate").value = "";
}


function handleItemClick(e) {
    if (e.target.classList.contains("delete")) {
        const li = e.target.parentElement;
        li.parentElement.removeChild(li);
        tasksCheck()
        displaySuccessMessage("Text deleted successfully");
    }
    if (e.target.classList.contains("edit")) {
        e.preventDefault();
        document.getElementById("item").value = e.target.parentElement.childNodes[1].textContent.trim();
        const submit = document.getElementById("submit");
        submit.value = "EDIT";
        editItem = e;
    }
    saveTasksToLocalStorage();
}


function toggleButton(ref, btnID) {
    document.getElementById(btnID).disabled = false;
}

function displaySuccessMessage(message) {
    document.getElementById("lblsuccess").innerHTML = message;
    document.getElementById("lblsuccess").style.display = "block";
    setTimeout(function () {
        document.getElementById("lblsuccess").style.display = "none";
    }, 3000);
}

function displayErrorMessage(message) {
    document.getElementById("lblerror").innerHTML = message;
    document.getElementById("lblerror").style.display = "block";
    setTimeout(function () {
        document.getElementById("lblerror").style.display = "none";
    }, 3000);
}




function toggleMode() {
    const body = document.body;
    const svgIcon = document.getElementById('toggleIcon'); // Select the SVG element

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#fff'; // Change the fill color to white for dark mode
        });
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#000'; // Change the fill color to black for light mode
        });
    }
}
//added local storage functionallity

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    const tasks = document.querySelectorAll(".list-group-item");
    const tasksArray = [];

    tasks.forEach((task) => {
        const taskText = task.childNodes[1].textContent;
        const isCompleted = task.classList.contains("completed");
        const createdAt = task.querySelector('#created-at').textContent;
        const dueDate = task.querySelector('#task-dueDate').textContent;

        const taskObj = { text: taskText, completed: isCompleted, createdAt: createdAt, dueDate: dueDate };
        tasksArray.push(taskObj);
    });

    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// Function to retrieve tasks from local storage and display them
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    if (tasks && tasks.length > 0) {
        const tasksHeading = document.getElementById("heading-tasks");
        tasksHeading.classList.remove("hidden");
        document.querySelector(".clear_btn").style.display = "inline";
        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            if (task.completed){
                li.className = "list-group-item completed"
            }
            // dispatchEvent.className = "form-check"
            const completeCheckbox = document.createElement("input");
            completeCheckbox.type = "checkbox";
            completeCheckbox.className = "form-check-input task-completed";
            completeCheckbox.checked = task.completed;
            completeCheckbox.addEventListener("change", markAsComplete);

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm float-right delete";
            deleteButton.appendChild(document.createTextNode("Delete"));

            const editButton = document.createElement("button");
            editButton.className = "btn btn-success btn-sm float-right edit";
            editButton.appendChild(document.createTextNode("Edit"));
            editButton.style.marginRight = "8px";

            // Create a click event listener for the edit button
            editButton.addEventListener("click", function (e) {
                handleItemClick(li);
            });

            const dateTimeParagraph = document.createElement("p");
            dateTimeParagraph.className = "text-muted";
            dateTimeParagraph.id = 'created-at';
            dateTimeParagraph.style.fontSize = "15px";
            dateTimeParagraph.style.margin = "0 19px";
            dateTimeParagraph.appendChild(document.createTextNode(task.createdAt));


            // Create a paragraph element for the due date
            const dueDateParagraph = document.createElement("p");
            dueDateParagraph.className = "text-muted";
            dueDateParagraph.id = 'task-dueDate';
            dueDateParagraph.style.fontSize = "15px";
            dueDateParagraph.style.margin = "0 19px";
            dueDateParagraph.appendChild(document.createTextNode(task.dueDate));

            li.appendChild(completeCheckbox);
            li.appendChild(document.createTextNode(task.text));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
            li.appendChild(dateTimeParagraph);
            li.appendChild(dueDateParagraph);

            items.appendChild(li);
        });
    }
}

// Event listener for saving tasks to local storage on form submit
form1.addEventListener("submit", (e) => {
    addItem(e);
    saveTasksToLocalStorage();
});

// Event listener for loading tasks from local storage on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    tasksCheck();
    loadTasksFromLocalStorage();
});

// Event listener for deleting tasks and saving to local storage
items.addEventListener("click", (e) => {
    handleItemClick(e);
    saveTasksToLocalStorage();
});




function toggleMode() {
    const body = document.body;
    const svgIcon = document.getElementById('toggleIcon'); // Select the SVG element

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#fff'; // Change the fill color to white for dark mode
        });
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#000'; // Change the fill color to black for light mode
        });
    }
}


function clearAllTasks() {

    const ulElement = document.getElementById("items");


    // Removes all tasks from the task list
    while (ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild);
    }

    // Hide the button after the task list is cleared
    document.querySelector(".clear_btn").style.display = "none";
    console.log("task cleared");

    // Hide the tasks heading since there are no tasks left

    const tasksHeading = document.getElementById("heading-tasks");
    tasksHeading.classList.add("hidden");

    saveTasksToLocalStorage();
}
