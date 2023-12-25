import React , { useContext }  from 'react'
import noteContext from '../context/note/NoteContext'
const NoteItem=(props)=> {
    const context=useContext(noteContext)
    const {deletenote}=context
    const { note,updateNote } = props

   
    return (
        <div className='col-md-3'>
            <div className="card my-3" style={{ width: "18rem" }}>

                <div className="card-body">
                    <div className="d-flex align-item-center">
                        
                    <h5 className="card-title m-0">{note.title}</h5>
                    <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
                   <i className="fa-solid fa-trash mx-2" onClick={()=>{deletenote(note._id)}}></i>
                    </div>
                   
                  <p className="card-text">{note.description}  </p>
                   
                </div>
            </div>
        </div>
    )
}

export default NoteItem
