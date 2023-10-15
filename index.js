// Elements reference
const taskList = document.getElementById("taskList");
const dueDateInput = document.getElementById("dueDate");
const submitBtn = document.getElementById("submitBtn");
const editTaskBtn = document.getElementById("editTask");
const tasksHeading = document.getElementById("heading-tasks");
const modeToggleBtn = document.getElementById("modeToggle");
const checkboxes = document.querySelectorAll(".form-check-input");
let editItem = null;

// Adding Event Listeners
editTaskBtn.addEventListener("click", (e) => {
  handleEditClick(e);
});
submitBtn.addEventListener("click", (e) => {
  addItem(e);
});
taskList.addEventListener("click", handleItemClick);
modeToggleBtn.addEventListener("click", toggleMode);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", markAsComplete);
});

flatpickr(dueDateInput, {
  enableTime: false, // If you want to enable time selection as well
  dateFormat: "Y-m-d", // Adjust the date format as needed
});

function init() {
  const body = document.getElementsByTagName("body")[0];
  body.classList.add("light-mode");

  loadTasksFromLocalStorage();
  tasksCheck();
}

function tasksCheck() {
  const tasks = taskList.children;

  if (tasks.length === 0) {
    tasksHeading.classList.toggle("hidden");
    document.querySelector(".clear_btn").style.display = "none";
  }
}

function handleEditItem(e) {
  e.preventDefault();
  editTaskBtn.style.display = "inline";
  submitBtn.style.display = "none";

  const taskTitle = e.target.parentElement.childNodes[1].textContent.trim();
  document.getElementById("item").value = taskTitle;
  editItem = e.target;
}

function handleEditClick(e) {
  e.preventDefault();
  editItem.parentElement.childNodes[1].textContent =
    document.getElementById("item").value;
  displaySuccessMessage("Task edited successfully");
  editItem = null;
  document.getElementById("item").value = "";

  editTaskBtn.style.display = "none";
  submitBtn.style.display = "inline";
  saveTasksToLocalStorage();
}

function addItem(e) {
  e.preventDefault();
  tasksCheck();

  const newTaskTitle = document.getElementById("item").value;
  let dueDate = document.getElementById("dueDate").value;
  if (!dueDate) {
    dueDate = DefaultDate();
  }

  // Check if the due date has already passed
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);

  const tasks = taskList.children;

  if (dueDateObj < currentDate && tasks.length === 0) {
    displayErrorMessage("Due date has already passed");
    tasksHeading.classList.add("hidden");
    return false;
  } else if (dueDateObj < currentDate && tasks.length > 0) {
    displayErrorMessage("Due date has already passed");
    return false;
  } else {
    tasksHeading.classList.remove("hidden");
  }

  if (newTaskTitle.trim() === "") return false;
  else {
    document.getElementById("item").value = "";
    document.querySelector(".clear_btn").style.display = "inline";
  }

  const creationDateTime = new Date().toLocaleString();

  createNewTask(newTaskTitle, creationDateTime, dueDate);

  saveTasksToLocalStorage();
  document.getElementById("dueDate").value = "";
}

function handleItemClick(e) {
  if (e.target.classList.contains("delete")) {
    e.preventDefault();
    const li = e.target.parentElement;
    const confirmationBox = document.getElementById("custom-confirm");
    document.getElementById("confirm-msg").style.backgroundColor = "White";
    document.getElementById("confirm-msg").style.color = "Black";
    document.getElementById("confirm-msg").innerText =
      "Are you sure you want to delete this task?";
    const confirmYesButton = document.getElementById("confirm-yes");
    const confirmNoButton = document.getElementById("confirm-no");
    const confirmCancelButton = document.getElementById("confirm-cancel");

    confirmYesButton.addEventListener("click", () => {
      confirmationBox.style.display = "none";
      li.parentElement.removeChild(li);
      tasksCheck();
      displaySuccessMessage("Task deleted successfully");
      saveTasksToLocalStorage();
    });

    confirmNoButton.addEventListener("click", () => {
      confirmationBox.style.display = "none";
    });
    confirmCancelButton.addEventListener("click", () => {
      confirmationBox.style.display = "none";
    });

    confirmationBox.style.display = "flex";
  }
  saveTasksToLocalStorage();
}

function DefaultDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${year}-${month}-${day}`;
}

function markAsComplete(e) {
  const li = e.target.parentElement;
  li.classList.toggle("completed");
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
// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  const tasks = document.querySelectorAll(".list-group-item");
  const tasksArray = [];

  tasks.forEach((task) => {
    const taskText = task.childNodes[1].textContent;
    const isCompleted = task.classList.contains("completed");
    const createdAt = task.querySelector("#created-at").textContent;
    const dueDate = task.querySelector("#task-dueDate").textContent;

    const taskObj = {
      text: taskText,
      completed: isCompleted,
      createdAt: createdAt,
      dueDate: dueDate,
    };
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
      createNewTask(task.text, task.createdAt, task.dueDate);
    });
  }
}
function enableSubmit(ref, btnID) {
  document.getElementById(btnID).disabled = false;
}

function toggleMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
}

function clearAllTasks() {
  // Removes all tasks from the task list
  //changing confirmation message
  const confirmationBox = document.getElementById("custom-confirm");
  document.getElementById("confirm-msg").style.backgroundColor = "Red";
  document.getElementById("confirm-msg").style.color = "White";
  document.getElementById("confirm-msg").innerText =
    "Are you sure you want to delete all tasks?";

  const confirmYesButton = document.getElementById("confirm-yes");
  const confirmNoButton = document.getElementById("confirm-no");
  const confirmCancelButton = document.getElementById("confirm-cancel");

  confirmYesButton.addEventListener("click", () => {
    confirmationBox.style.display = "none";
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
    // Hide the button after the task list is cleared
    document.querySelector(".clear_btn").style.display = "none";
    console.log("task cleared");

    // Hide the tasks heading since there are no tasks left
    tasksHeading.classList.add("hidden");
    saveTasksToLocalStorage();
  });

  confirmNoButton.addEventListener("click", () => {
    confirmationBox.style.display = "none";
  });
  confirmCancelButton.addEventListener("click", () => {
    confirmationBox.style.display = "none";
  });

  confirmationBox.style.display = "flex";
}

function createNewTask(taskTitle, createdDate, dueDate) {
  const li = document.createElement("li");
  li.className = "list-group-item";

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
    handleEditItem(e);
  });

  const dateTimeParagraph = document.createElement("p");
  dateTimeParagraph.className = "text-muted";
  dateTimeParagraph.id = "created-at";
  dateTimeParagraph.style.fontSize = "15px";
  dateTimeParagraph.style.margin = "0 19px";
  dateTimeParagraph.appendChild(
    document.createTextNode("Created:" + createdDate)
  );

  // Create a paragraph element for the due date
  const dueDateParagraph = document.createElement("p");
  dueDateParagraph.className = "text-muted";
  dueDateParagraph.id = "task-dueDate";
  dueDateParagraph.style.fontSize = "15px";
  dueDateParagraph.style.margin = "0 19px";
  dueDateParagraph.appendChild(document.createTextNode("Due Date:" + dueDate));

  li.appendChild(completeCheckbox);
  li.appendChild(document.createTextNode(taskTitle));
  li.appendChild(deleteButton);
  li.appendChild(editButton);
  li.appendChild(dateTimeParagraph);
  li.appendChild(dueDateParagraph);

  taskList.appendChild(li);
}

init();
