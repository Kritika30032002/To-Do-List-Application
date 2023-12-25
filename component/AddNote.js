import React , { useContext ,useState}  from 'react'
import noteContext from '../context/note/NoteContext'
import { useNavigate } from 'react-router-dom';
import {fetched} from "./Note"
function AddNote() {
  const navigate=useNavigate();
  const context=useContext(noteContext)
  const {addnote} =context;


  const [note, setnote] = useState({title:"",description:""})
  const handleClick=async (e)=>{
    e.preventDefault();
 await addnote(note.title,note.description);
  setnote({title: "", description: ""})
fetched.concat(note)

 navigate("/");

  }
  const onChanges=(e)=>{
    setnote({...note,[e.target.name]:e.target.value})
    // fetched.concat(note)
  }
  return (
    <div>
      <form>
  <div className="mb-3">
    <div style={{marginBottom:"2rem"}}><h1>Add Your New Task</h1></div>
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="title"  name='title' value={note.title} onChange={onChanges}/>
  
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" id="description" name='description' value={note.description}  onChange={onChanges}/>
  </div>
  
  <button type="submit" className="btn btn-primary" onClick={handleClick}>Submit</button>
</form>
    </div>
  )
}

export default AddNote
