import React, { useContext, useState } from 'react';
import Input from '../../Shared/FormElements/Input';
import Button from '../../Shared/FormElements/Button';
import './Registration.css'; 
import axios from 'axios'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Shared/context/auth-context';


function Registration() {
    const auth = useContext(AuthContext)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge_] = useState("");
    const [contact, setContact] = useState("");
    const [gender, setGender] = useState("Select Gender");
    const [memberImage,setMemberImage] = useState(null);

    const [organizationName, setOrganizationName] = useState("");
    const [address, setAddress] = useState("");
    const [orgUsername, setOrgUsername] = useState("");
    const [orgPassword, setOrgPassword] = useState("");
    const [currentForm, setCurrentForm] = useState("member");
    const [orgImage,setOrgImage] = useState(null);

    const setFName = (event) => setFirstName(event.target.value);
    const setLname = (event) => setLastName(event.target.value);
    const setUserName = (event) => setUsername(event.target.value);
    const setMail = (event) => setEmail(event.target.value);
    const setPass = (event) => setPassword(event.target.value);
    const setAge = (event) => setAge_(event.target.value);
    const setPhone = (event) => setContact(event.target.value);
    const handleGender = (event) => setGender(event.target.value);
    const handleOrgName = (event) => setOrganizationName(event.target.value);
    const handleAddress = (event) => setAddress(event.target.value);
    const handleOrgUsername = (event) => setOrgUsername(event.target.value);
    const handleOrgPassword = (event) => setOrgPassword(event.target.value);

    

    const handleSubmitMember = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('fname', firstName);
        formData.append('lname', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('gender', gender);
        formData.append('phone', contact);
        formData.append('password', password);
        formData.append('age', age);
        if (memberImage) {
            formData.append('image', memberImage);
        }
        try{
            const response = await axios.post('/api/member/signup',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log("ffffffff",response.data);
            auth.login(response.data.userId,response.data.token,response.data.role,response.data.username)
            console.log('Success:', response.data);
        }
        catch(error){
            console.log("Error caught:", error);
        
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message); 
            } else if (error.message) {
                window.alert("Error: " + error.message); 
            } else {
                window.alert("Registration failed. Please try again.");
            }
        }
    };

    const handleSubmitOrg = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', organizationName);
        formData.append('address', address);
        formData.append('username', orgUsername);
        formData.append('password', orgPassword);
        if (orgImage) {
            formData.append('image', orgImage);
        }
        try{
            const response = await axios.post('/api/organization/signup',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            auth.login(response.data.orgId,response.data.token,response.data.role,response.data.username)
            console.log('Success:', response.data);
        }
        catch(error){
            console.log("Error caught:", error);
        
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message); 
            } else if (error.message) {
                window.alert("Error: " + error.message); 
            } else {
                window.alert("Registration failed. Please try again.");
            }
        }
        
    };

    const changeMemberSignup = () => setCurrentForm("member");
    const changeOrgSignup = () => setCurrentForm("org");

    const memberForm = (
        <form onSubmit={handleSubmitMember}>
            <Input onChange={setFName} value={firstName} placeholder={"Firstname"} id={"fname"} name={"firstname"} type={"input"} />
            <Input onChange={setLname} value={lastName} placeholder={"Lastname"} id={"lname"} name={"lastname"} type={"input"} />
            <Input onChange={setUserName} value={username} placeholder={"Username"} id={"uname"} name={"username"} type={"input"} />
            <Input onChange={setMail} value={email} placeholder={"Email"} id={"mail"} name={"email"} type={"input"} />
            <Input onChange={setPass} value={password} placeholder={"Password"} id={"password"} name={"password"} password={true} type={"input"} />
            <select onChange={handleGender} name="gender" id="gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <Input onChange={setAge} value={age} placeholder={"Age"} id={"age"} name={"age"} type={"input"} />
            <Input onChange={setPhone} value={contact} placeholder={"Contact Number"} id={"phone"} name={"contact"} type={"input"} />
            <label  htmlFor="image">Upload Image</label>
            <input className='height' onChange={(e) => setMemberImage(e.target.files[0])} type="file" name="Image" id="image" accept="image/*" />
            <Button className={"btn"} name={"Sign up Now!"} type={"submit"} />
        </form>
    );

    const orgForm = (
        <form onSubmit={handleSubmitOrg}>
            <Input onChange={handleOrgName} value={organizationName} placeholder={"Organization Name"} id={"orgname"} name={"orgname"} type={"input"} />
            <Input onChange={handleAddress} value={address} placeholder={"Address"} id={"address"} name={"address"} type={"textarea"} />
            <Input onChange={handleOrgUsername} value={orgUsername} placeholder={"Username"} id={"username"} name={"username"} type={"input"} />
            <Input onChange={handleOrgPassword} value={orgPassword} password={true} placeholder={"Password"} id={"pass"} name={"orgPass"} type={"input"} />
            <label  htmlFor="image">Upload Image</label>
            <input className='height' onChange={(e) => setOrgImage(e.target.files[0])} type="file" name="Image" id="image" accept="image/*" />
            <Button className={"btn"} type={"submit"} name={"Sign up Now!"} />
        </form>
    );

    return (
        <div className="registration-container">
            <div className="form-box">
                <h2 className="form-title">Medlem</h2>
                <p className="subtext">Sign up as</p>
                <div className="button-group">
                    <button className={`toggle-btn ${currentForm === "member" ? "active" : ""}`} onClick={changeMemberSignup}>Member</button>
                    <button className={`toggle-btn ${currentForm === "org" ? "active" : ""}`} onClick={changeOrgSignup}>Organization</button>
                </div>
                {currentForm === "org" ? orgForm : memberForm}
                <p>Already Logged in ?? <Link style={{textDecoration:"none"}} to={"/"} >Login here...</Link> </p>
            </div>
        </div>
    );
}

export default Registration;
