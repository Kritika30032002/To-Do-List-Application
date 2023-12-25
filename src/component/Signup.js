import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import Navbar from './Navbar'

export default function SignUp() {
  const navigate = useNavigate();
  const [credentials, setcredentials] = useState({ name: "", password: "" })
  const handleClick = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/auth/createuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    })

    const json = await response.json();
    // console.log(json)
    if (json.success) {
      alert("User is created")
      navigate("/")
    }
    if (!json.success)
      alert("Enter correct credentials")

  }
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div>
      {/* <Navbar/>s */}
      <div style={{
        background: "#f3e0e2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "'Montserrat', sans-serif",
        height: "100vh",
        margin: "-20px 0 50px",
      }}>
        <div className="container " style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
          position: "relative",
          overflow: "hidden",
          width: "768px",
          maxWidth: "100%",
          minHeight: "480px",
        }} id="container">
          <div className="form-container log-in-container" style={{
            position: "inherit",
            top: "0",
            height: "100%",
            left: "0",
            // width: "50%",
            marginLeft: "1rem",
            zIndex: "2"
          }}>
            <form onSubmit={handleClick} style={{
              backgroundColor: " #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 50px", height: "100%", textAlign: "center"
            }}>
              <h1 h1 style={{
                fontweight: "bold", margin: "0"
              }}>Signup</h1>
              <div className="mb-5">
                {/* <a href="/" className="social"><i className="fa fa-facebook fa-2x"></i></a>
					<a href="/" className="social"><i className="fab fa fa-twitter fa-2x"></i></a> */}
              </div>


              <input style={{ backgroundColor: "#eee", border: "none", padding: "12px 15px", margin: "8px 0", width: "100%", }} type="text" className="form-control" value={credentials.name} placeholder="Name" onChange={onChange} name='name' />

              <input style={{ backgroundColor: "#eee", border: "none", padding: "12px 15px", margin: "8px 0", width: "100%", }} type="password" className="form-control" value={credentials.password} placeholder="password" onChange={onChange} name='password' />
             
              {/* <a style={{color: "#333",fontSize: "14px",textDecoration: "none",margin: "15px 0"}} href="/sigup">Forgot your password?</a> */}
              <button style={{
                borderRadius: "20px", border: "1px solid #FF4B2B", backgroundColor: "#FF4B2B", color: "#FFFFFF", fontSize: "12px", fontWeight: "bold", padding: "12px 45px", letterSpacing: "1px", textTransform: "uppercase", transition: "transform 80ms ease-in", fontFamily: "cursive !important"
              }}>Signup</button>
            </form>
          </div>

        </div>
      </div>
    </div>

  )
}
