let todos = [];

window.onload = () => {
    const form1 = document.querySelector("#addForm");
    let items = document.getElementById("items");
    let submit = document.getElementById("submit");
    let editItem = null;
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        save(todo, false);
    });
    form1.addEventListener("submit", addItem);
    items.addEventListener("click", removeItem);
};

function addItem(e) {
    e.preventDefault();

    if (submit.value != "Submit") {
        let prevValue = editItem.target.parentNode.childNodes[0].data;
        editItem.target.parentNode.childNodes[0].data = document.getElementById("item").value;

        const index = todos.indexOf(prevValue);
        if (index !== -1) {
            todos[index] = document.getElementById("item").value;
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        submit.value = "Submit";
        document.getElementById("item").value = "";
        document.getElementById("lblsuccess").innerHTML = "Text edited successfully";
        document.getElementById("lblsuccess").style.display = "block";

        setTimeout(function() {
            document.getElementById("lblsuccess").style.display = "none";
        }, 3000);

        return false;
    }
    let newItem = document.getElementById("item").value;
    save(newItem, true);
}

function save(newItem, toAdd) {
    if (newItem.trim() == "" || newItem.trim() == null)
        return false;
    else
        document.getElementById("item").value = "";

    let li = document.createElement("li");
    li.className = "list-group-item";

    let deleteButton = document.createElement("button");

    deleteButton.className = "btn-danger btn btn-sm float-right delete opacity";
    deleteButton.appendChild(document.createTextNode("Delete"));

    let editButton = document.createElement("button");

    editButton.className = "btn-success btn btn-sm float-right edit opacity";
    editButton.appendChild(document.createTextNode("Edit"));

    li.appendChild(document.createTextNode(newItem));
    li.appendChild(deleteButton);
    li.appendChild(editButton);

    items.appendChild(li);
    if (toAdd)
        todos.push(newItem);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeItem(e) {
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
        let li = e.target.parentNode;
        items.removeChild(li);

        const deletedItem = li.childNodes[0].data;
        const index = todos.indexOf(deletedItem);
        if (index !== -1) {
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos)); // Update localStorage
        }

        document.getElementById("lblsuccess").innerHTML = "Text deleted successfully";
        document.getElementById("lblsuccess").style.display = "block";

        setTimeout(function() {
            document.getElementById("lblsuccess").style.display = "none";
        }, 3000);
    }
    if (e.target.classList.contains("edit")) {
        document.getElementById("item").value = e.target.parentNode.childNodes[0].data;
        submit.value = "EDIT";
        editItem = e;
    }
}

function toggleButton(ref, btnID) {
    document.getElementById(btnID).disabled = false;
}
