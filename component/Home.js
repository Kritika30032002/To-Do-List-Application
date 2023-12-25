import React from 'react'
import Note from './Note'
import {Link} from "react-router-dom"
function Home() {
  
  return (
    <div>
    <div className='d-flex align-item-center mx-9'>
      
      <h1>TO Do Tasks</h1>
      <Link to="/addnote"><i className="fa-solid fa-circle-plus" style={{marginLeft:"55rem",marginTop:"1rem",fontSize:"xx-large"}}></i></Link>
     </div>

     <div>
      <Note/>
    </div>
    </div>
  )
}

export default Home
