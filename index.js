function markAsComplete(e) {
    const li = e.target.parentElement;
    li.classList.toggle("completed");
}



window.onload = () => {
    const form1 = document.querySelector("#addForm");
    const items = document.getElementById("items");
    const submit = document.getElementById("submit");
    let editItem = null;

    form1.addEventListener("submit", addItem);
    items.addEventListener("click", handleItemClick);

    // Add event listener for checkboxes
    const checkboxes = document.querySelectorAll(".form-check-input");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", markAsComplete);
    });
};

let editItem = null;
function addItem(e) {
    e.preventDefault();

    if (submit.value !== "Submit") {
        editItem.target.parentElement.childNodes[2].textContent = document.getElementById("item").value;
        submit.value = "Submit";
        document.getElementById("item").value = "";

        displaySuccessMessage("Text edited successfully");
        editItem = null;  // Reset editItem after editing
        return false;
    }

    const newItem = document.getElementById("item").value;
    if (newItem.trim() === "") return false;
    else document.getElementById("item").value = "";

    const li = document.createElement("li");
    li.className = "list-group-item";

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "form-check-input";
    completeCheckbox.addEventListener("change", markAsComplete);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm float-right delete";
    deleteButton.appendChild(document.createTextNode("Delete"));

    const editButton = document.createElement("button");
    editButton.className = "btn btn-success btn-sm float-right edit";
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.style.marginRight = "8px";
    editButton.addEventListener("click", function (e) {
        handleItemClick(e);
    });

    li.appendChild(completeCheckbox);
    li.appendChild(document.createTextNode(newItem));
    li.appendChild(deleteButton);
    li.appendChild(editButton);

    items.appendChild(li);

    
}

function handleItemClick(e) {
    if (e.target.classList.contains("delete")) {
        const li = e.target.parentElement;
        li.parentElement.removeChild(li);
        displaySuccessMessage("Text deleted successfully");
    }
    if (e.target.classList.contains("edit")) {
        document.getElementById("item").value = e.target.parentElement.childNodes[1].textContent.trim();
        submit.value = "EDIT";
        editItem = e;
    }
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

