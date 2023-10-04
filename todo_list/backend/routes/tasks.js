// // routes/tasks.js
// const express = require('express');
// const mongoose = require('mongoose');
// const router = express.Router();
// const Task = require('../model/taskModel'); // Import the Task model

// // Create a new task
// router.post('/create', async (req, res) => {
//   try {
//     const { text, dueDate } = req.body;
//     // const email = localStorage.getItem("email"); // Get the user's email from local storage

//     if(localStorage.getItem('email')){
//         const email = localStorage.getItem("email"); 
//     }
//     // Create a new task
//     const newTask = new Task({
//       text,
//       dueDate,
//       email, // Save the user's email with the task
//     });

//     // Save the task to the database
//     const savedTask = await newTask.save();

//     res.status(201).json(savedTask);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get all tasks for a user
// router.get('/alltasks', async (req, res) => {

//     if(localStorage.getItem('email')){
//         const email = localStorage.getItem("email"); 
//     }
//   // Get the user's email from local storage
//   try {
//     const tasks = await Task.find({ email });

//     if (!tasks || tasks.length === 0) {
//       res.status(404).json({
//         message: "No tasks found for this user"
//       });
//     } else {
//       res.status(200).json({
//         message: "Tasks found",
//         tasks
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Update a task
// router.put('/update/:taskId', async (req, res) => {
//   const { text, dueDate } = req.body;
//   const taskId = req.params.taskId;

//   try {
//     const updatedTask = await Task.findByIdAndUpdate(taskId, { text, dueDate }, { new: true });

//     if (!updatedTask) {
//       res.status(404).json({
//         message: "Task not found"
//       });
//     } else {
//       res.status(200).json(updatedTask);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Delete a task
// router.delete('/delete/:taskId', async (req, res) => {
//   const taskId = req.params.taskId;

//   try {
//     const deletedTask = await Task.findByIdAndDelete(taskId);

//     if (!deletedTask) {
//       res.status(404).json({
//         message: "Task not found"
//       });
//     } else {
//       res.status(200).json({
//         message: "Task deleted successfully"
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;





























const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Task = require('../model/taskModel');


router.post('/create', async (req, res) => {
    try {
      const { text, dueDate } = req.body;
      const email = req.query.email; 
  console.log(email);
      const newTask = new Task({
        text,
        dueDate,
        email,
      });
  
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


router.get('/alltasks', async (req, res) => {
    const email = req.query.email;

  try {
    const tasks = await Task.find({ email });

    if (!tasks || tasks.length === 0) {
      res.status(404).json({
        message: 'No tasks found for this user',
      });
    } else {
      res.status(200).json({
        message: 'Tasks found',
        tasks,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/update/:taskId', async (req, res) => {
  const { text, dueDate} = req.body;
  const email = req.query.email;
  const taskId = req.params.taskId;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { text, dueDate,email },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({
        message: 'Task not found',
      });
    } else {
      res.status(200).json(updatedTask);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
router.delete('/delete/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      res.status(404).json({
        message: 'Task not found',
      });
    } else {
      res.status(200).json({
        message: 'Task deleted successfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;