import React, { useState, useEffect } from 'react';
import './Quiz.css';
import axios from 'axios'; // Import Axios

function Quiz() {
  const [item, setItem] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const userEmail=localStorage.getItem("email");
  console.log(userEmail)

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleButton = (e, buttonId) => {
    document.getElementById(buttonId).disabled = false;
  };

  const markAsComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };


//   if(localstorage.getItem('email')){}
  const addItem = async (e) => {
    e.preventDefault();

    if (editItem !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editItem].text = item;
      setTasks(updatedTasks);
      setItem('');
      setEditItem(null);

      // Make an Axios request to update the task
      try {
        await axios.put(`http://localhost:5000/api/tasks/update/${tasks[editItem]._id}`, {
          text: item,
          dueDate,
         
        //   email : localStorage.getItem('email')
        },{
          params: {
            email: userEmail, // Send the email as a parameter
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      const newItem = {
        text: item,
        completed: false,
        dueDate: dueDate || DefaultDate(),
      };
      setTasks([...tasks, newItem]);
      setItem('');
      setDueDate('');

      // Make an Axios request to create a new task
      try {
        await axios.post('http://localhost:5000/api/tasks/create', {
          text: item,
          dueDate,
        }, {
          params: {
            email: userEmail, // Send the email as a parameter
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleItemClick = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    // Make an Axios request to delete the task
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${tasks[index]._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const DefaultDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month}-${day}`;
  };

  const tasksCheck = () => {
    const tasksHeading = document.getElementById('heading-tasks');
    if (tasks.length === 0) {
      tasksHeading.classList.toggle('hidden');
    }
  };

  useEffect(() => {
    // Make an Axios request to get all tasks
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/alltasks', 
         {
          params: {
            email: userEmail, // Send the email as a parameter
          },
        }
         // Use params to include userEmail as a query parameter
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className={`container-xl ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="text-white p-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 text-center">
              <img
                src="images/to-do-list.png"
                alt=""
                style={{ height: '70px', marginBottom: '20px' }}
              />
              <font size="11" color="white">
                <strong style={{ marginLeft: '0px' }}>ToDo List</strong>
              </font>
              {/* <input
                type="checkbox"
                id="modeToggle"
                style={{ marginLeft: '300px' }}
                onClick={toggleMode}
              /> */}
            </div>
          </div>
        </div>
      </header>

      <div className="container main mt-3">
        <h2 className="text-center mb-4">Add Items</h2>

        <label id="lblsuccess" className="text-success" style={{ display: 'none' }}></label>

        <form id="addForm" className="main_form" onSubmit={addItem}>
          <input
            type="text"
            id="item"
            placeholder="Write your task here"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            onKeyUp={(e) => toggleButton(e, 'submit')}
          />
          <input
            type="text"
            id="dueDate"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <input
            type="submit"
            className="btn btn-primary"
            id="submit"
            value={editItem !== null ? 'Edit' : 'Submit'}
            disabled={!item}
          />
        </form>

        <div className="text-center">
          <h3 className="mt-4 text-center" id="heading-tasks">
            Tasks
          </h3>

          <div id="items">
            {tasks.map((task, index) => (
              <div key={index} className={`card mb-2 ${task.completed ? 'completed' : ''}`}>
                <div className="card-body">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => markAsComplete(index)}
                    checked={task.completed}
                  />
                  <span className="card-text">{task.text}</span>
                  <button
                    className="btn btn-danger btn-sm float-right delete"
                    onClick={() => handleItemClick(index)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-success btn-sm float-right edit"
                    onClick={() => {
                      setItem(task.text);
                      setDueDate(task.dueDate);
                      setEditItem(index);
                    }}
                    style={{ marginRight: '8px' }}
                  >
                    Edit
                  </button>
                  <p className="text-muted" style={{ fontSize: '15px', margin: '0 19px' }}>
                    Created: {new Date().toLocaleString()}
                  </p>
                  <p className="text-muted" style={{ fontSize: '15px', margin: '0 19px' }}>
                    Due Date: <span id="dueDateSpan">{task.dueDate}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
