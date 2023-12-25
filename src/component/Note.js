import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/note/NoteContext'
import NoteItem from './NoteItem';
import { useNavigate } from 'react-router-dom';

let fetched;
const Note = () => {
  let navigate = useNavigate();
  const context = useContext(noteContext)
  let { notes, getnote, setNotes, editnote } = context;
  let newn = []
  
  


  const fetchData = async () => {
    if (localStorage.getItem('token')) {
      try {

        const fetchedNotes = await getnote();
        newn = fetchedNotes
        
        setNotes(fetchedNotes)
        fetched=notes
       
        if (!Array.isArray(fetchedNotes)) {
          console.error('Invalid data format received from getnote');
          return;
        }
        newn = fetchedNotes
        
      } catch (error) {
        console.error('Error during getnote:', error.message);
      }
    }
    else {
      navigate("/login")
    }
  };


  useEffect(() => {
    fetchData();

  }, []);
  const [query, setquery] = useState("")
 
  const ref = useRef(null)
  const refClose = useRef(null)
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "" })

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description })
  }

  const handleClick = (e) => {
    editnote(note.id, note.etitle, note.edescription)
    refClose.current.click();
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  
     try {
      fetched = notes.filter(note => {
    
        return (note.title.toLowerCase().includes(query.toLowerCase()) || note.description.toLowerCase().includes(query.toLowerCase()) )
      
      })
     } catch (error) {
      console.error(error.message)
     }
    
  const onCha=(e)=>{
    
    setquery(e.target.value);

     

  }
  
  // console.log({newn})
  return (
    <>

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                </div>


              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        {/* <h1>Tasks</h1> */}
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={query} onChange={onCha} />
          {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
        </form>
        <div className="container">
          {notes.length === 0 && "no recent tasks"}
        </div>

        {fetched.map((note) => (
          <NoteItem key={note._id} updateNote={updateNote} note={note} />
        ))}
        {/* {Array.isArray(notes) && notes.length !== 0 ? (
        notes.map((note) => <NoteItem key={note._id} note={note} />)
      ) : (
        <p>No notes available</p>
      )} */}
      </div>

    </>
  )
}

export default Note
export {fetched}