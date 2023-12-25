import { useState } from "react";
import NoteContext from "./NoteContext";
const NoteState = (props) => {
  const host = "http://localhost:3001"
  const [notes, setNotes] = useState([])
// get all note
  const getnote=async()=>{
    
    try {
      const response = await fetch(`http://localhost:3001/api/note/fetchallnotes`, {
 
      method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
  
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch notes. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during getnote:', error.message);
      throw error; // Re-throw the error to propagate it further
    }
  }

  // add notess
  const addnote = async(title, description) => {
    const response = await fetch(`http://localhost:3001/api/note/addnote`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      },
      body: JSON.stringify({title,description}),
    });
    const note= response.json();
    if(Array.isArray(notes)){
      setNotes(notes.concat(note));
  }else{
      console.log("Given data is not an array")
  }
    
  }
  // delete notes

  const deletenote = async(id) => {
    const response = await fetch(`http://localhost:3001/api/note/delete/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      
    });
    const json=response.json();
    console.log(json)
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote)
  }

  // edit notes
  const editnote = async (id, title, description) => {

    const response = await fetch(`${host}/api/note/update/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      },
      body: JSON.stringify({title,description}),
    });
    const json= response.json();
    console.log(json)
    let newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        break; 
      }
    }  
    setNotes(newNotes);
  }
  return (
    <NoteContext.Provider value={{ notes, setNotes,addnote, deletenote, editnote,getnote }}>
      {props.children}
    </NoteContext.Provider>
  )

}

export default NoteState;