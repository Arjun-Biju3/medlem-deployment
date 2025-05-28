import React, { useContext, useState } from 'react'
import Input from '../../Shared/FormElements/Input';
import Button from '../../Shared/FormElements/Button';
import "./Login.css"
import { Link,Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Shared/context/auth-context';


function Login(props) {
const auth = useContext(AuthContext)
 const organization = [{"username":"arjun","password":123}]
 const members = [{"username":"Appu","password":123}]
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [role,setLoginRole] = useState("member")
    let user
    const handleusernameChange=(event)=>{
        setUsername(event.target.value)
    }

    const handlepasswordchange=(event)=>{
        setPassword(event.target.value)
    }

    const loginhandler= async (event)=>{
        event.preventDefault();
    if(role == "organization"){
        console.log(role);
        try{
        const response = await axios.post('http://localhost:5000/api/organization/login',{
            username:username,
            password:password
        })
        console.log(response.data);
        
        auth.login(response.data.userId,response.data.token,response.data.role,response.data.username)
        }
         catch(error){
            console.log("Error caught:", error);
        
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message); 
            } else if (error.message) {
                window.alert("Error: " + error.message); 
            } else {
                window.alert("Login failed. Please try again.");
            }
        }}
    else{
        console.log(role);
        try{
        const response = await axios.post('http://localhost:5000/api/member/login',{
            username:username,
            password:password
        })
        console.log(response);
        auth.login(response.data.userId,response.data.token,response.data.role,response.data.username)
        }
         catch(error){
            console.log("Error caught:", error);
        
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message); 
            } else if (error.message) {
                window.alert("Error: " + error.message); 
            } else {
                window.alert("Login failed. Please try again.");
            }
        }
    }
    }

    const handleRole=(event)=>{
        setLoginRole(event.target.value)
    }

    const loginForm = (
        <form onSubmit={loginhandler}>
            <Input onChange={handleusernameChange} value={username} placeholder={"Username"} id={"username"} name={"username"} type={"input"} />
            <Input onChange={handlepasswordchange} value={password} password={true} placeholder={"Password"} id={"password"} name={"password"} type={"input"} />
            <select onChange={handleRole} name="role"  id="role">
                <option value="member">Member</option>
                <option value="organization">Organization</option>
            </select>
            <Button className={"btn"} name={"Login"} type={"submit"} />
        </form>
    );
  return (
    <div className="login-container">
    <div className="form-box-login">
        <h2 className="form-title">LOGIN</h2>
        {loginForm}
        <p>New User?? <Link style={{textDecoration:"none"}} to={"/register"} >signup here...</Link></p>
    </div>
</div>
  )
}

export default Login
