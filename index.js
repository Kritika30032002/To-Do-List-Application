// Elements reference
const taskList = document.getElementById("taskList");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");

const submitBtn = document.getElementById("submitBtn");
const editTaskBtn = document.getElementById("editTask");
const tasksHeading = document.getElementById("heading-tasks");
const modeToggleBtn = document.getElementById("modeToggle");
const checkboxes = document.querySelectorAll(".form-check-input");
let editItem = null;

const tasksWithPriority = [];

const priorityColors = {
  High: "task-priority-High",
  Medium: "task-priority-Medium",
  Low: "task-priority-Low",
};

const priorityValues = {
  High: 3,
  Medium: 2,
  Low: 1,
};

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
    document.querySelector(".dropdown").style.display = "none";
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

  const itemInput = document.getElementById("item");
  const dueDateInput = document.getElementById("dueDate");

  const editedItemText = itemInput.value;
  const editedDueDate = new Date(dueDateInput.value);
  const currentDate = new Date().toISOString().split("T")[0];

  if (editedDueDate < new Date(currentDate)) {
    displayErrorMessage("Due date has already passed");
    return false;
  }

  const listItem = editItem.parentElement;
  listItem.childNodes[1].textContent = editedItemText;

  if (editedDueDate >= new Date(currentDate)) {
    listItem.childNodes[5].textContent = `Due Date:${dueDateInput.value}
      `;
  }

  displaySuccessMessage("Task edited successfully");
  editItem = null;
  itemInput.value = "";
  dueDateInput.value = "";

  editTaskBtn.style.display = "none";
  submitBtn.style.display = "inline";
  saveTasksToLocalStorage();
}

document.addEventListener("DOMContentLoaded", function () {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  let isListening = false;
  const voiceCommandButton = document.getElementById("voice-command-button");
  voiceCommandButton.addEventListener("click", function () {
    if (isListening) {
      recognition.stop();
      isListening = false;
      voiceCommandButton.textContent = "start voice command";
    } else {
      recognition.start();
      isListening = true;
      voiceCommandButton.textContent = "stop voice command";
    }
  });

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    handleVoiceCommand(transcript);
  };

  recognition.onend = function () {
    isListening = false;
    voiceCommandButton.textContent = "Start Voice Command";
  };

  function handleEditClick(e) {
    e.preventDefault();

    const itemInput = document.getElementById("item");
    const dueDateInput = document.getElementById("dueDate");

    const editedItemText = itemInput.value;
    const editedDueDate = new Date(dueDateInput.value);
    const currentDate = new Date().toISOString().split("T")[0];

    if (editedDueDate < new Date(currentDate)) {
      displayErrorMessage("Due date has already passed");
      return false;
    }

    const listItem = editItem.parentElement;
    listItem.childNodes[1].textContent = editedItemText;

    if (editedDueDate >= new Date(currentDate)) {
      listItem.childNodes[5].textContent = `Due Date:${dueDateInput.value}`;
    }

    displaySuccessMessage("Task edited successfully");
    editItem = null;
    itemInput.value = "";
    dueDateInput.value = "";

    editTaskBtn.style.display = "none";
    submitBtn.style.display = "inline";

    // Call displayTaskDetails with the appropriate argument
    displayTaskDetails(listItem);

    saveTasksToLocalStorage();
  }

  function handleVoiceCommand(command) {
    console.log("Recognized Command:", command);
    const commandParts = command.split(" ");

    if (command.length >= 4) {
      if (command.toLowerCase().includes("add")) {
        const titleIndex = commandParts.indexOf("add") + 1;
        const dueIndex = commandParts.indexOf("due");
        const dateIndex = commandParts.indexOf("date");
        const priorityIndex = commandParts.indexOf("priority");
        if (
          titleIndex < dueIndex &&
          dueIndex < dateIndex &&
          dateIndex < priorityIndex
        ) {
          const taskTitle = commandParts.slice(titleIndex, dueIndex).join(" ");
          const dueDate = commandParts
            .slice(dateIndex + 1, priorityIndex)
            .join(" ");
          const priority = commandParts[priorityIndex + 1];
          addTask(taskTitle, dueDate, priority);
          return;
        }
      } else if (
        command.toLowerCase().includes("edit") &&
        command.toLowerCase().includes("task")
      ) {
        // const editIndex = commandParts.indexOf('edit');
        const editIndex = commandParts.indexOf("edit");
        const taskIndex = commandParts.indexOf("task");
        const toIndex = commandParts.indexOf("to");
        const dueDateIndex = commandParts.indexOf("due");
        const priorityIndex = commandParts.indexOf("priority");
        if (
          editIndex !== -1 &&
          taskIndex !== -1 &&
          toIndex !== -1 &&
          dueDateIndex !== -1 &&
          priorityIndex !== -1 &&
          toIndex > taskIndex &&
          dueDateIndex > toIndex &&
          priorityIndex > dueDateIndex &&
          priorityIndex < commandParts.length - 1
        ) {
          const oldTitle = commandParts.slice(taskIndex + 1, toIndex).join(" ");
          const newTitle = commandParts
            .slice(toIndex + 1, dueDateIndex)
            .join(" ");
          const newdueDate = commandParts.slice(
            dueDateIndex + 2,
            dueDateIndex + 4
          );
          const newpriority = capitalizeFirstLetter(
            commandParts[priorityIndex + 1]
          );

          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

          console.log("Old Title:", oldTitle);
          console.log("New Title:", newTitle);
          console.log("Due Date:", newdueDate);
          console.log("Priority:", newpriority);

          editTask(oldTitle, newTitle, newdueDate, newpriority);
          return;
        }
      } else if (command.toLowerCase().includes("delete")) {
        const titleIndex = commandParts.indexOf("task") + 1;
        const taskTitle = commandParts.slice(titleIndex).join(" ");
        deleteTask(taskTitle);
      } else {
        displayErrorMessage("Invalid voice command format.");
      }
    }
  }

  function deleteTask(taskTitle) {
    const taskElement = findTaskElement(taskTitle);

    if (taskElement) {
      taskElement.remove();
      saveTasksToLocalStorage();
      displaySuccessMessage(`Task "${taskTitle}" deleted successfully.`);
    } else {
      displayErrorMessage(`Task "${taskTitle}" not found.`);
    }
  }

  function editTask(oldTitle, newTitle, newdueDate, newpriority) {
    const taskElement = findTaskElement(oldTitle);

    if (taskElement) {
      const dueDateElement = taskElement.querySelector("#task-dueDate");
      const priorityElement = taskElement.querySelector("#task-priority");

      const titleTextNode = taskElement.childNodes[1];
      titleTextNode.textContent = titleTextNode.textContent.replace(
        oldTitle,
        newTitle
      );
      console.log("New Due Date:", newdueDate);
      if (dueDateElement) {
        dueDateElement.textContent = `Due Date: ${newdueDate}`;
        dueDateElement.id = "task-dueDate";
      }
      if (priorityElement) {
        priorityElement.textContent = newpriority;
        priorityElement.id = "task-priority";
      }

      // Call displayTaskDaetails with the appropriate argument
      displayTaskDetails(taskElement);

      saveTasksToLocalStorage();
      displaySuccessMessage(`Task "${oldTitle}" edited successfully.`);
    } else {
      displayErrorMessage(`Task "${oldTitle}" not found.`);
    }
  }

  function findTaskElement(taskTitle) {
    const tasks = document.querySelectorAll(".list-group-item");

    for (const task of tasks) {
      const title = task.childNodes[1].textContent.trim().toLowerCase();
      if (title === taskTitle.toLowerCase()) {
        return task;
      }
    }

    return null;
  }

  function addTask(taskTitle, dueDate, priority) {
    const todoList = document.getElementById("taskList");
    const existingTasks = todoList.querySelectorAll("li");

    // Use taskTitle instead of task in the comparison
    console.log("Existing tasks: ");
    existingTasks.forEach((item) =>
      console.log(item.textContent.trim().toLowerCase())
    );
    const taskExists = Array.from(existingTasks).some(
      (item) =>
        item.textContent.trim().toLowerCase() === taskTitle.trim().toLowerCase()
    );

    if (taskExists) {
      displayErrorMessage("Task already exists");
      return;
    }

    const li = document.createElement("li");
    const capitalizedPriority =
      priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    console.log("Priority:", priority);
    console.log("Priority Class:", priorityColors[capitalizedPriority]);

    li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[capitalizedPriority]}`;

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "form-check-input task-completed";
    completeCheckbox.addEventListener("change", markAsComplete);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger float-right delete";
    deleteButton.innerHTML =
      '<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';

    const editButton = document.createElement("button");
    editButton.className = "btn btn-success btn-sm float-right edit";
    editButton.innerHTML =
      '<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
    editButton.style.marginRight = "8px";
    editButton.addEventListener("click", handleEditItem);

    // const titleParagraph = document.createElement("p");
    // titleParagraph.style.fontSize = "18px";
    // titleParagraph.style.margin = "0 19px";
    // titleParagraph.appendChild(document.createTextNode(taskTitle));

    const dateTimeParagraph = document.createElement("p");
    dateTimeParagraph.className = "text-muted";
    dateTimeParagraph.id = "created-at";
    dateTimeParagraph.style.fontSize = "15px";
    dateTimeParagraph.style.margin = "0 19px";
    dateTimeParagraph.appendChild(
      document.createTextNode("Created:" + new Date().toLocaleString())
    );

    const dueDateParagraph = document.createElement("p");
    dueDateParagraph.className = "text-muted";
    dueDateParagraph.id = "task-dueDate";
    dueDateParagraph.style.fontSize = "15px";
    dueDateParagraph.style.margin = "0 19px";
    dueDateParagraph.appendChild(
      document.createTextNode("Due Date:" + dueDate)
    );

    const priorityParagraph = document.createElement("p");
    priorityParagraph.className = "text-muted";
    priorityParagraph.id = "task-priority";
    priorityParagraph.style.fontSize = "15px";
    priorityParagraph.style.margin = "0 19px";
    priorityParagraph.appendChild(document.createTextNode(capitalizedPriority));

    li.appendChild(completeCheckbox);
    li.appendChild(document.createTextNode(taskTitle));
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    li.appendChild(dateTimeParagraph);
    li.appendChild(dueDateParagraph);
    li.appendChild(priorityParagraph);
    todoList.appendChild(li);
    saveTasksToLocalStorage();

    // Display task details after adding
    displayTaskDetails(li);
  }

  // recognition.start();
});

function displayTaskDetails(taskElement) {
  if (taskElement) {
    const dueDateElement = taskElement.querySelector("#task-dueDate");
    const priorityElement = taskElement.querySelector("#task-priority");

    const dueDate = dueDateElement
      ? dueDateElement.textContent.split(":")[1].trim()
      : null;
    const priority = priorityElement
      ? priorityElement.textContent.trim()
      : null;

    console.log(`Task Details - Due Date: ${dueDate}, Priority: ${priority}`);
  }
}

function addItem(e) {
  e.preventDefault();
  tasksCheck();

  const newTaskTitle = document.getElementById("item").value;
  let dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  // Check if the due date has already passed
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);

  const tasks = taskList.children;
  console.log(newTaskTitle);

  // if (dueDateObj < currentDate && tasks.length === 0) {
  //   displayErrorMessage("Due date has already passed");
  //   tasksHeading.classList.add("hidden");
  //   return false;
  // } else if (dueDateObj < currentDate && tasks.length > 0) {
  //   displayErrorMessage("Due date has already passed");
  //   return false;
  // } else {
  //   tasksHeading.classList.remove("hidden");
  // }

  // Added new logic to check conditions whether Task and Date are entered

  if (!newTaskTitle) {
    displayErrorMessage("Task not entered");
    tasksHeading.classList.add("hidden");
    return false;
  } else if (!dueDate) {
    displayErrorMessage("Please specify a due date!!!"); // Check if the due date is specified or not
    return false;
  } else if (dueDateObj < currentDate) {
    displayErrorMessage("Due date has already passed");
    return false;
  } else {
    tasksHeading.classList.remove("hidden");
  }

  if (newTaskTitle.trim() === "") return false;
  else {
    document.getElementById("item").value = "";
    document.querySelector(".clear_btn").style.display = "inline";
    document.querySelector(".dropdown").style.display = "inline";
  }

  const creationDateTime = new Date().toLocaleString();

  createNewTask(newTaskTitle, creationDateTime, dueDate, priority);

  saveTasksToLocalStorage();
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "";
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

    const handleYesClick = () => {
      confirmationBox.style.display = "none";
      li.parentElement.removeChild(li);
      tasksCheck();
      displaySuccessMessage("Task deleted successfully");
      saveTasksToLocalStorage();
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleNoClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleCancelClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    confirmYesButton.addEventListener("click", handleYesClick);
    confirmNoButton.addEventListener("click", handleNoClick);
    confirmCancelButton.addEventListener("click", handleCancelClick);

    confirmationBox.style.display = "flex";
  }
  saveTasksToLocalStorage();
}

// function DefaultDate() {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1;
//   const day = today.getDate();
//   return `${year}-${month}-${day}`;
// }

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
    const priority = task.querySelector("#task-priority").textContent;
    const taskObj = {
      text: taskText,
      completed: isCompleted,
      createdAt: createdAt,
      dueDate: dueDate,
      priority: priority,
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
    document.querySelector(".dropdown").style.display = "inline";
    tasks.forEach((task) => {
      console.log(task.text, "taskText");
      console.log(task.createdAt.slice(8), "taskCreateAt");
      console.log(task.dueDate.split(":")[1], "testDuedate");

      createNewTask(
        task.text,
        task.createdAt.slice(8),
        task.dueDate.split(":")[1],
        task.priority
      );
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
  const confirmationBoxAll = document.getElementById("custom-confirm-all");
  document.getElementById("confirm-msg-all").style.backgroundColor = "Red";
  document.getElementById("confirm-msg-all").style.color = "White";
  document.getElementById("confirm-msg-all").innerText =
    "Are you sure you want to delete all tasks?";

  const confirmYesButtonAll = document.getElementById("confirm-yes-all");
  const confirmNoButtonAll = document.getElementById("confirm-no-all");
  const confirmCancelButtonAll = document.getElementById("confirm-cancel-all");

  confirmYesButtonAll.addEventListener("click", () => {
    confirmationBoxAll.style.display = "none";
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
    // Hide the button after the task list is cleared
    document.querySelector(".clear_btn").style.display = "none";
    document.querySelector(".dropdown").style.display = "none";

    // Hide the tasks heading since there are no tasks left
    tasksHeading.classList.add("hidden");
    saveTasksToLocalStorage();
  });

  confirmNoButtonAll.addEventListener("click", () => {
    confirmationBoxAll.style.display = "none";
  });
  confirmCancelButtonAll.addEventListener("click", () => {
    confirmationBoxAll.style.display = "none";
  });
  confirmationBoxAll.style.display = "flex";
}
//Function to sort task list by due date
function sortByDueDate(order) {
  const sortTaskList = JSON.parse(localStorage.getItem("tasks"));
  if (order === "early") {
    sortTaskList.sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (order === "late") {
    sortTaskList.sort((a, b) => {
      return new Date(b.dueDate) - new Date(a.dueDate);
    });
  }

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasksHeading.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

function sortByPriority(order) {
  const sortTaskList = JSON.parse(localStorage.getItem("tasks"));

  sortTaskList.sort((a, b) => {
    if (order === "highToLow") {
      // Sort tasks from high priority to low priority
      return priorityValues[b.priority] - priorityValues[a.priority];
    } else if (order === "lowToHigh") {
      // Sort tasks from low priority to high priority
      return priorityValues[a.priority] - priorityValues[b.priority];
    } else {
      // Default sorting (e.g., no sorting)
      return 0;
    }
  });

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasksHeading.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  console.log("func called");
  document.getElementById("myDropdown").classList.toggle("show");
}

// function sortTasks(order){
//   if (order === 'highToLow'){
//     sortByPriority('highToLow');

//   }
//   else if (order === 'lowToHigh'){
//     sortByPriority('lowToHigh');
//   }
//   document.getElementById("myDropdown").classList.remove("show");
// }

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function createNewTask(taskTitle, createdDate, dueDate, priority) {
  const li = document.createElement("li");
  li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[priority]}`;

  console.log(priority);
  const completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.className = "form-check-input task-completed";
  completeCheckbox.addEventListener("change", markAsComplete);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-danger float-right delete";
  // deleteButton.appendChild(document.createTextNode("Delete"));
  deleteButton.innerHTML =
    '<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';

  const editButton = document.createElement("button");
  editButton.className = "btn btn-success btn-sm float-right edit";
  //   editButton.appendChild(document.createTextNode("Edit"));
  editButton.innerHTML =
    '<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
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

  const priorityParagraph = document.createElement("p");
  priorityParagraph.className = "text-muted";
  priorityParagraph.id = "task-priority";
  priorityParagraph.style.fontSize = "15px";
  priorityParagraph.style.margin = "0 19px";
  priorityParagraph.appendChild(document.createTextNode(priority));

  li.appendChild(completeCheckbox);
  li.appendChild(document.createTextNode(taskTitle));
  li.appendChild(deleteButton);
  li.appendChild(editButton);
  li.appendChild(dateTimeParagraph);
  li.appendChild(dueDateParagraph);
  li.appendChild(priorityParagraph);

  taskList.appendChild(li);
  displayTaskDetails(li);
}

init();

// Preloader function
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.querySelector(".preloader").style.display = "none";
  }, 2000);
});
