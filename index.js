// Creating instances of document objects
const taskList = document.getElementById("taskList");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const submitBtn = document.getElementById("submitBtn");
const editTaskBtn = document.getElementById("editTask");
const tasksHeading = document.getElementById("heading-tasks");
const searchBar = document.getElementById("searchBar");
const modeToggleBtn = document.getElementById("modeToggle");
const checkboxes = document.querySelectorAll(".form-check-input");
let editItem = null;
const tasksWithPriority = [];
var storedValue = sessionStorage.getItem("modeToggleValue")
modeToggleBtn.checked=(storedValue==="true");
toggleMode();
const priorityColors = {
  High: "task-priority-High",
  Medium: "task-priority-Medium",
  Low: "task-priority-Low",
  Completed: "task-completed"
};

const priorityValues = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// Adding Event Listeners to Document Objects [buttons, text fields, dropdown lists]
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
  enableTime: false, 
  dateFormat: "Y-m-d", 
});

//settibng up default theme
function init() {
  const body = document.getElementsByTagName("body")[0];
  body.classList.add("light-mode");

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", handleSearch);
  loadTasksFromLocalStorage();
  tasksCheck();
}

//search logic
function handleSearch() {
  const searchTerm = searchBar.value.toLowerCase();
  const tasks = document.querySelectorAll(".list-group-item");
  tasks.forEach((task) => {
    const taskTitle = task.childNodes[1].textContent.trim().toLowerCase();
    if (taskTitle.includes(searchTerm)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

//logic to check whether no task is present and hide some buttons
function tasksCheck() {
  const tasks = taskList.children;
  if (tasks.length === 0) {
    tasksHeading.classList.toggle("hidden");
    searchBar.classList.toggle("hidden");
    document.querySelector(".clear_btn").style.display = "none";
    document.querySelector(".dropdown").style.display = "none";
  }
}

//this gets called after 'edit' button, fills text fields with data to be edited
function handleEditItem(e) {
  e.preventDefault();
  editTaskBtn.style.display = "inline";
  submitBtn.style.display = "none";
  const taskTitle = e.target.parentElement.childNodes[1].textContent.trim();
  console.log(e.target.parentElement.childNodes)
  const taskDescription = e.target.parentElement.childNodes[4].textContent.trim().replace("Description:","");
  document.getElementById("item").value = taskTitle;
  document.getElementById("description").value = taskDescription;
  document.getElementById("maintitle").innerText = "Edit your tasks below :";
  editItem = e.target;
}

//actual logic after editing a task and for adding a task   (gets called after edit button click, onChnage text fileds, date, priority)
function handleEditClick(e) {
  e.preventDefault();
  const itemInput = document.getElementById("item");
  const dueDateInput = document.getElementById("dueDate");
  const descriptionInput = document.getElementById("description");
  const editedItemText = itemInput.value;
  const editedDescriptionText = descriptionInput.value;
  const editedDueDate = new Date(dueDateInput.value);
  const currentDate = new Date().toISOString().split("T")[0];
  const editedPriority=document.getElementById("priority").value;

  //check if all fields are filled [basic validation]
  if (!editedItemText.trim()) {
    displayErrorMessage("Task not entered");
    return false;
  }

  if(!editedItemText ||!editedDescriptionText){
    displayErrorMessage("Title or description must not be empty!!!.");
    return false;
  }

  if (editedDueDate < new Date(currentDate)) {
    displayErrorMessage("Due date has already passed !!!");
    return false;
  }

  if(!editedPriority){
    displayErrorMessage("Please select priority")
    return false
  }
  //[basic validation ends]


  //actual manuplation of data
  const listItem = editItem.parentElement;
  listItem.childNodes[1].textContent = editedItemText;
  listItem.childNodes[4].textContent = "Description:"+editedDescriptionText;
  listItem.childNodes[7].textContent = editedPriority;
  if (editedDueDate >= new Date(currentDate)) {
    listItem.childNodes[6].textContent = `Due Date:${dueDateInput.value}`;
  }
  const capitalizedPriority =editedPriority.charAt(0).toUpperCase() + editedPriority.slice(1).toLowerCase();
  listItem.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[capitalizedPriority]}`;
  displaySuccessMessage("Task edited successfully !!!");
  editItem = null;
  itemInput.value = "";
  descriptionInput.value="";
  dueDateInput.value = "";
  document.getElementById("maintitle").innerText = "Add your tasks below :";
  editTaskBtn.style.display = "none";
  submitBtn.style.display = "inline";
  saveTasksToLocalStorage();
}

//Voice handled adding task logic   [start]
document.addEventListener("DOMContentLoaded", function () {
  const recognition = new (window.SpeechRecognition ||window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  let isListening = false;
  const voiceCommandButton = document.getElementById("voice-command-button");
  voiceCommandButton.addEventListener("click", function () {
    if (isListening) {
      recognition.stop();
      isListening = false;
      voiceCommandButton.innerHTML = '<i class="fas fa-microphone"></i>';
    } else {
      recognition.start();
      isListening = true;
      voiceCommandButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    }
  });

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    handleVoiceCommand(transcript);
  };

  recognition.onend = function () {
    isListening = false;
    voiceCommandButton.innerHTML = '<i class="fas fa-microphone"></i>';
  };

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
        const editIndex = commandParts.indexOf("edit");
        const taskIndex = commandParts.indexOf("task");
        const toIndex = commandParts.indexOf("to");
        const dueDateIndex = commandParts.indexOf("due");
        const priorityIndex = commandParts.indexOf("priority");
        if (editIndex !== -1 &&taskIndex !== -1 && toIndex !== -1 && dueDateIndex !== -1 && priorityIndex !== -1 && 
          toIndex > taskIndex &&dueDateIndex > toIndex && priorityIndex > dueDateIndex && 
          priorityIndex < commandParts.length - 1) {
          const oldTitle = commandParts.slice(taskIndex + 1, toIndex).join(" ");
          const newTitle = commandParts.slice(toIndex + 1, dueDateIndex).join(" ");
          const newdueDate = commandParts.slice(dueDateIndex + 2,dueDateIndex + 4);
          const newpriority = capitalizeFirstLetter(commandParts[priorityIndex + 1]);

          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          editTask(oldTitle, newTitle, newdueDate, newpriority,);
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
//Voice handled adding task logic   [end]

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


  //Setting edited data to below cards components
  function editTask(oldTitle, newTitle, newdueDate, newpriority,newDescription) {
    const taskElement = findTaskElement(oldTitle);
    if (taskElement) {
      const dueDateElement = taskElement.querySelector("#task-dueDate");
      const priorityElement = taskElement.querySelector("#task-priority");
      const descElement = taskElement.querySelector("#description-at");
      const titleTextNode = taskElement.childNodes[1];
      titleTextNode.textContent = titleTextNode.textContent.replace(oldTitle,newTitle);
      //updating fields data
      if (dueDateElement) {
        dueDateElement.textContent = `Due Date: ${newdueDate}`;
        dueDateElement.id = "task-dueDate";
      }
      if (priorityElement) {
        priorityElement.textContent = newpriority;
        priorityElement.id = "task-priority";
      }if (descElement) {
        descElement.textContent = newDescription;
        descElement.id = "task-description";
      }

      //redesplaying task data in cards
      displayTaskDetails(taskElement);
      saveTasksToLocalStorage();
      displaySuccessMessage(`Task "${oldTitle}" edited successfully.`);
    } else {
      displayErrorMessage(`Task "${oldTitle}" not found.`);
    }
  }

  //returns the instance of task to be deleted or edited
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


    //logic to add task, can be used for voice commands only, (need to be update this function!)
  function addTask(taskTitle, dueDate, priority) {
    const todoList = document.getElementById("taskList");
    const existingTasks = todoList.querySelectorAll("li");
    existingTasks.forEach((item) =>
      console.log(item.textContent.trim().toLowerCase())
    );
    const taskExists = Array.from(existingTasks).some((item) =>
    item.textContent.trim().toLowerCase() === taskTitle.trim().toLowerCase()
    );

    if (taskExists) {
      displayErrorMessage("Task already exists !!!");
      return;
    }

    const li = document.createElement("li");
    const capitalizedPriority =priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    console.log("Priority:", priority);
    console.log("Priority Class:", priorityColors[capitalizedPriority]);

    li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[capitalizedPriority]}`;

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "form-check-input task-completed";
    completeCheckbox.addEventListener("change", markAsComplete);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-outline-danger float-right delete";
    deleteButton.innerHTML ='<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';

    const editButton = document.createElement("button");
    editButton.className = "btn btn-outline-success btn-sm float-right edit";
    editButton.innerHTML ='<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
    editButton.style.marginRight = "8px";
    editButton.addEventListener("click", handleEditItem);

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

    displayTaskDetails(li);
  }
});
//adding tasks through voice command ends here


//logging task details for debugging purpose, does nothing change in UI.
function displayTaskDetails(taskElement) {
  if (taskElement) {
    const dueDateElement = taskElement.querySelector("#task-dueDate");
    const priorityElement = taskElement.querySelector("#task-priority");
    const dueDate = dueDateElement? dueDateElement.textContent.split(":")[1].trim() : null;
    const priority = priorityElement? priorityElement.textContent.trim()  : null;
    console.log(`Task Details - Due Date: ${dueDate}, Priority: ${priority}`);
  }
}


//adding tasks through form manually-logic
function addItem(e) {
  e.preventDefault();
  tasksCheck();
  const newTaskTitle = document.getElementById("item").value;
  const description = document.getElementById("description").value;
  let dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  // Check if the due date has already passed
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);


  //form validation code
  if (!newTaskTitle||!description) {
    displayErrorMessage("Task and Description should be filled!!!");
    tasksHeading.classList.add("hidden");
    searchBar.classList.add("hidden");
    return false;
  } else if (!dueDate) {
    displayErrorMessage("Please specify a due date !!!"); 
    return false;
  } else if (dueDateObj < currentDate) {
    displayErrorMessage("Due date has already passed !!!");
    return false;
  } else {
    tasksHeading.classList.remove("hidden");
    searchBar.classList.remove("hidden");
  }

  if (newTaskTitle.trim() === "") return false;
  else {
    document.getElementById("item").value = "";
    document.querySelector(".clear_btn").style.display = "inline";
    document.querySelector(".dropdown").style.display = "inline";
  }
  const creationDateTime = new Date().toLocaleString();
  createNewTask(newTaskTitle, creationDateTime, dueDate, priority,description);
  saveTasksToLocalStorage();

  //clearing form fields after 'add' button
  document.getElementById("dueDate").value = "";
  document.getElementById("description").value = "";
  document.getElementById("priority").value = "";
}


//logic for various item click events
function handleItemClick(e) {
  if (e.target.classList.contains("delete")) {
    e.preventDefault();
    const li = e.target.parentElement;
    const confirmationBox = document.getElementById("custom-confirm");
 
    //display confirmination message
    delalert_title=document.getElementById("confirm-msg");
    delalert_title.innerHTML ="&#9888; Are you sure you want to delete this task?";
    delalert_title.className="alert alert-danger";
    delalert_title.role="alert";
    
    const confirmYesButton = document.getElementById("confirm-yes");
    const confirmNoButton = document.getElementById("confirm-no");
    const confirmCancelButton = document.getElementById("confirm-cancel");

    //conform message controls click logic
    const handleYesClick = () => {
      confirmationBox.style.display = "none";
      li.parentElement.removeChild(li);
      tasksCheck();
      displaySuccessMessage("Task deleted successfully !!!");
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


function markAsComplete(e) {
  const li = e.target.parentElement;
  const originalClassList = li.dataset.originalClassList;
  const editButton = li.querySelector('.edit');
   // Toggle the visibility of the button
   if (editButton) editButton.style.display = (editButton.style.display === 'none') ? 'block' : 'none';
  // If the original class list is stored, toggle it back
  if (originalClassList) {
    li.className = originalClassList;
    li.removeAttribute("data-original-class-list"); 
  } else {
    // If the original class list is not stored, store it and toggle "task-completed"
    li.dataset.originalClassList = li.className;
    li.classList.toggle("task-completed");
  }
}

// message box for success
function displaySuccessMessage(message) {
  document.getElementById("lblsuccess").innerHTML = message;
  document.getElementById("lblsuccess").style.display = "block";
  setTimeout(function () {
    document.getElementById("lblsuccess").style.display = "none";
  }, 3000);
}

// message box for error
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
  const tasksArray = extractTasksData(tasks);
  storeTasksInLocalStorage(tasksArray);
}

// Function to extract task data from DOM elements
function extractTasksData(tasks) {
  const tasksArray = [];

  tasks.forEach((task) => {
    const taskText = task.childNodes[1].textContent;
    const isCompleted = task.classList.contains("completed");
    const createdAt = task.querySelector("#created-at").textContent;
    const description = task.querySelector("#description-at").textContent;
    const dueDate = task.querySelector("#task-dueDate").textContent;
    const priority = task.querySelector("#task-priority").textContent;

    const taskObj = createTaskObject(
      taskText,
      isCompleted,
      createdAt,
      dueDate,
      priority,
      description
    );

    tasksArray.push(taskObj);
  });

  return tasksArray;
}

// Function to create a task object
function createTaskObject(text, completed, createdAt, dueDate, priority, description) {
  return {
    text: text,
    completed: completed,
    createdAt: createdAt,
    dueDate: dueDate,
    priority: priority,
    description: description,
  };
}

// Function to store tasks in local storage
function storeTasksInLocalStorage(tasksArray) {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}



// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Function to display tasks
function loadTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage();

  if (tasks.length > 0) {
    const tasksHeading = document.getElementById("heading-tasks");
    tasksHeading.classList.remove("hidden");
    searchBar.classList.remove("hidden");
    document.querySelector(".clear_btn").style.display = "inline";
    document.querySelector(".dropdown").style.display = "inline";

    tasks.forEach((task) => {
      displayTask(task);
    });
  }
}

// Function to create and display a single task
function displayTask(task) {
  createNewTask(
    task.text,
    task.createdAt.slice(8),
    task.dueDate.split(":")[1],
    task.priority,
    task.description.slice(12)
  );
}


function enableSubmit(ref, btnID) {
  document.getElementById(btnID).disabled = false;
}

//function to chhnage the icon of light/dark mode
function toggleMode() {
  const body = document.body;
  sessionStorage.setItem("modeToggleValue", modeToggleBtn.checked);
  if (modeToggleBtn.checked) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  }
  
}

function clearAllTasks() {
  // Removes all tasks from the task list and changing confirmation message
  const confirmationBoxAll = document.getElementById("custom-confirm-all");

  //setting up confirm message
  const alert_title=document.getElementById("confirm-msg-all");
  alert_title.innerHTML ='&#9888; Are you sure you want to delete all tasks?';
  alert_title.className="alert alert-danger";
  alert_title.role="alert";
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
    searchBar.classList.add("hidden");
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


//logic to sort task list by due date
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
  searchBar.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

//logic to sort task list by priority
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
      return 0;
    }
  });
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  tasksHeading.classList.add("hidden");
  searchBar.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

//this is used somewhere in index.html
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

//if anywhere user clicks on window, the dropdown closes by this code
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

//function that entirely creates new task
function createNewTask(taskTitle, createdDate, dueDate, priority,description) {

  //dynamically creating new card for newly added task
  const li = document.createElement("li");
  li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[priority]}`;
  const completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.className = "form-check-input task-completed";
  completeCheckbox.addEventListener("change", markAsComplete);
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-outline-danger float-right delete";
  deleteButton.innerHTML ='<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';
  deleteButton.style.paddingTop = "10px";
  deleteButton.style.PaddingRight = "10px";


  const editButton = document.createElement("button");
  editButton.className = "btn btn-outline-secondary btn-sm float-right edit";
  editButton.innerHTML ='<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
  editButton.style.marginRight = "8px";
  editButton.style.paddingTop = "10px";
  editButton.style.PaddingRight = "10px";  
  // Create a click event listener for the edit button
  editButton.addEventListener("click", function (e) {
    handleEditItem(e);
  });

  //setting up the fields of card for newly added taks
  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.className = "text-muted";
  descriptionParagraph.id = "description-at";
  descriptionParagraph.style.fontSize = "15px";
  descriptionParagraph.style.margin = "0 19px";
  descriptionParagraph.appendChild(
    document.createTextNode("Description:" + description)
  );

  const dateTimeParagraph = document.createElement("p");
  dateTimeParagraph.className = "text-muted";
  dateTimeParagraph.id = "created-at";
  dateTimeParagraph.style.fontSize = "15px";
  dateTimeParagraph.style.margin = "0 19px";
  dateTimeParagraph.appendChild(
    document.createTextNode("Created: " + createdDate)
  );

  // Create a paragraph element for the due date
  const dueDateParagraph = document.createElement("p");
  dueDateParagraph.className = "text-muted";
  dueDateParagraph.id = "task-dueDate";
  dueDateParagraph.style.fontSize = "15px";
  dueDateParagraph.style.margin = "0 19px";
  dueDateParagraph.appendChild(document.createTextNode("Due Date: " + dueDate));

  const priorityParagraph = document.createElement("p");
  priorityParagraph.className = "text-muted";
  priorityParagraph.id = "task-priority";
  priorityParagraph.style.fontSize = "15px";
  priorityParagraph.style.margin = "0 19px";
  priorityParagraph.appendChild(document.createTextNode(priority));


  //appending all elements to <li> tag
  li.appendChild(completeCheckbox);
  li.appendChild(document.createTextNode(taskTitle));
  li.appendChild(deleteButton);
  li.appendChild(editButton);
  li.appendChild(descriptionParagraph);
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



//Preloader text
document.addEventListener("DOMContentLoaded", function () {
  const headerText = "To-Do List Application";
  const headerElement = document.getElementById("todo-header");

  // Function to simulate typing effect
  function typeText(text, index) {
    headerElement.textContent = text.slice(0, index);

    if (index < text.length) {
      setTimeout(function () {
        typeText(text, index + 1);
      }, 50); // Adjust the delay for the typing speed
    }
  }

  // Start the typing effect
  typeText(headerText, 0);
});
