import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./EditUserProfile.css"
import Input from '../../Shared/FormElements/Input';
import Button from '../../Shared/FormElements/Button';
import axios from 'axios';
import { useAuth } from '../../Shared/hooks/auth-hook';



function EditUserProfile() {
    const {id} = useParams()
    const {userId} = useAuth()
    const [name,setName] = useState("")
    const [fname,setFname] = useState("")
    const [lname,setLname] = useState("")
    const [email,setEmail] = useState("")
    const [username,setUserName] = useState("")
    const [age,setAge] = useState("")
    const [phone,SetPhone] = useState("")
    const [image,setImage] = useState("")

    useEffect(()=>{
        const fetchDeatils = async()=>{
           try{
            const response =await axios.get(`http://localhost:5000/api/member/getMemberById/${id}`)
            const member = response.data.member
            setFname(member.firstName)
            setLname(member.lastName)
            setEmail(member.email)
            setUserName(member.username)
            SetPhone(member.phone)
            setAge(member.age) 
            setName(member.firstName) 
           } 
           catch(error)
           {
            console.log(error);
            
           }
        }
        fetchDeatils()
    },[id])

    const handleUpadte=async()=>{
        const formData = new FormData();
        formData.append('fname',fname)
        formData.append('lname',lname)
        formData.append('email',email)
        formData.append('phone',phone)
        formData.append('username',username)
        formData.append('age',age)
        if(image){
            formData.append('image',image)
        }

        try{

            const response = await axios.patch(`http://localhost:5000/api/member/updatememberdetails/${userId}`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response);
            window.alert("Profile updated   successfully!");
        }
        catch(error){
            console.log("Error caught:", error);
    
        if (error.response && error.response.data && error.response.data.message) {
            window.alert(error.response.data.message); 
        } else if (error.message) {
            window.alert("Error: " + error.message); 
        } else {
            window.alert("upadting profile failed. Please try again.");
        }
        }
    }

  return (
    <div>
        <div className="edit-profile-main" >
                <h2>{name}'s Profile</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>First Name:</td>
                        <td><Input onChange={(e)=>setFname(e.target.value)}  name={"fname"} id={"fname"} type={"input"} value={fname} /></td>
                    </tr>
                    <tr>
                        <td>Last Name:</td>
                        <td><Input onChange={(e)=>setLname(e.target.value)}  name={"lname"} id={"lname"} type={"input"} value={lname} /></td>
                    </tr>
                    <tr>
                        <td>User name</td>
                        <td><Input onChange={(e)=>setUserName(e.target.value)}  name={"uname"} id={"uname"} type={"input"} value={username} /></td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td><Input onChange={(e)=>setEmail(e.target.value)}  name={"email"} id={"email"} type={"input"} value={email} /></td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td><Input onChange={(e)=>setAge(e.target.value)}  name={"age"} id={"age"} type={"input"} value={age} /></td>
                    </tr>
                    <tr>
                        <td>Phone Number:</td>
                        <td><Input onChange={(e)=>SetPhone(e.target.value)}  name={"phone"} id={"phone"} type={"input"} value={phone} /></td>
                    </tr>
                    <tr>
                        <td>Profile Picture:</td>
                        <td><input className='height' onChange={(e) => setImage(e.target.files[0])} type="file" name="Image" id="image" accept="image/*" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><Button onClick={handleUpadte} className={"updtae-btn-profile"} name={"Update"}/></td>
                    </tr>
                    </tbody>
                </table>
        </div>
    </div>
  )
}

export default EditUserProfile
