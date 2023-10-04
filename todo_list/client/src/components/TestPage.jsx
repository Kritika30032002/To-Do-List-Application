import React, { useState, useEffect } from 'react';
import './Quiz.css';
import axios from 'axios'; // Import Axios


const options = ["Personal", "Job", "Wishlist", "Shopping"];

function Quiz() {
  const [item, setItem] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const userEmail = localStorage.getItem("email");
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

  const markAsComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const addItem = async (e) => {
    e.preventDefault();

    if (editItem !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editItem].text = item;
      updatedTasks[editItem].dueDate = dueDate;
      updatedTasks[editItem].category = category;
      setTasks(updatedTasks);
      setItem('');
      setDueDate('');
      setCategory('');

      // Make an Axios request to update the task
      try {
        await axios.put(`http://localhost:5000/api/tasks/update/${tasks[editItem]._id}`, {
          text: item,
          dueDate,
          category,
        }, {
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
        category,
      };
      setTasks([...tasks, newItem]);
      setItem('');
      setDueDate('');
      setCategory('');

      // Make an Axios request to create a new task
      try {
        await axios.post('http://localhost:5000/api/tasks/create', {
          text: item,
          dueDate,
          category,
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
          />
          <input
            type="text"
            id="dueDate"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            id="category" // Give the select element an id
            onChange={(e) => setCategory(e.target.value)} // Handle the category change
            value={category}
          >
            <option value="">Select Category</option> {/* Add a default option */}
            {options.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
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
                  <span className='card-text'>{task.category}</span>
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
                      setCategory(task.category);
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
