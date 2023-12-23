const express = require('express')
const router = express.Router();
const Note = require("../Model/Note");
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');


// get all notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
   
   try {
    const note = await Note.find({ user: req.user.id });
    // console.log("sending data from server",note)
    res.json(note )
   } catch (error) {
    console.error(error.message);
    re.status(500).send("fetch error")
   } 
})
// add notes
router.post('/addnote', fetchuser, [
    body('title', "Min length of title is 3 character").isLength({ min: 3 }),
    body('description', "enter a valid description of length 6 character").isLength({ min: 6 })], async (req, res) => {
        try {
            const { title, description } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const note = new Note({
                title, description, user: req.user.id
            })
            const savednote = await note.save();
            res.json({ savednote });

        } catch (error) {
            console.error(error.message)
            res.status(500).send("internal fetch error has occurred")
        }

    })

// updating an existing node
router.put('/update/:id', fetchuser,async (req, res) => {
    const { title, description } = req.body;
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    var note = await Note.findById(req.params.id)
    if (!note) {
         return res.status(401).send("not found")
    }
    if (note.user.toString() !== req.user.id) {
       return res.status(401).send("not allowed");
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
})

// delete route
router.delete('/delete/:id', fetchuser,async (req, res) => {
    try {
        const { title, description } = req.body;
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    let note = await Note.findById(req.params.id)
    if (!note) {
         return res.status(401).send("not found")
    }
    if (note.user.toString() !== req.user.id) {
       return res.status(401).send("not allowed");
    }
    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"success":"note has been deleted"});
        
    } catch (error) {
        res.status(401).send("some error");
        console.error(error.message)
    }
    
})





module.exports = router