import React from 'react'
import { Link } from 'react-router-dom'
const Navbar=() =>{

    
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand disable" href="/">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link disable" aria-current="page" href="/">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disable" href="/">About</a>
        </li>
        
        
        
      </ul>
     
      <div className="d-flex" role="search">
        <Link className="" style={{ color:"black",textDecoration:"none",marginRight:"1.5rem " ,marginTop:"1.5rem" ,cursor:"pointer"}} to='/login'>Login</Link>
        <Link className="Signup" style={{color:"black",border:"2px solid green",borderRadius:"5px",padding:".3rem .3rem .3rem .5rem",textDecoration:"none" ,marginRight:"1.5rem " ,marginTop:"1.2rem" ,cursor:"pointer"}} to="/signup">SignUp</Link>
      </div>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
