import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Input from '../../Shared/FormElements/Input';
import Button from '../../Shared/FormElements/Button';
import axios from 'axios';


function EditProfile() {
    const {id}= useParams()
    const [organizationName, setOrganizationName] = useState("");
    const [address, setAddress] = useState("");
    const [orgUsername, setOrgUsername] = useState("");
    const [orgId,setOrgId] = useState("")
    const [orgImage,setOrgImage] = useState("")

    useEffect(()=>{
      const findData = async ()=>{
        try{
          const response = await axios.get(`http://localhost:5000/api/organization/getOrganization/${id}`)
          const org = response.data.org[0];
          console.log(response.data.org);
          
          if (org) {
            setOrganizationName(org.name || "");
            setAddress(org.address || "");
            setOrgUsername(org.username || ""); 
            setOrgId(org._id || "")
            
          }
        }
        catch(error){
          console.log(error);
          
        }
      }
      findData()
    },[])

     
    const handleSubmit =async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', organizationName);
        formData.append('address', address);
        formData.append('username', orgUsername);
        if (orgImage) {
          formData.append('image', orgImage);
        }
        console.log(organizationName,address,orgUsername,orgImage);
        
        try{
        const response = await axios.patch(`http://localhost:5000/api/organization/update/${orgId}`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
        }
        })
        console.log(response);
        window.alert(response.data.message)
        }
        catch(error){
          console.log("Error caught:", error);
    
          if (error.response && error.response.data && error.response.data.message) {
              window.alert(error.response.data.message); 
          } else if (error.message) {
              window.alert("Error: " + error.message); 
          } else {
              window.alert("updating details failed. Please try again.");
          }
        }
    };

    const handleOrgName = (event) => setOrganizationName(event.target.value);
    const handleAddress = (event) => setAddress(event.target.value);
    const handleOrgUsername = (event) => setOrgUsername(event.target.value);

    const orgForm = (
        <form onSubmit={handleSubmit}>
            <Input onChange={handleOrgName} value={organizationName} placeholder={"Organization Name"} id={"orgname"} name={"orgname"} type={"input"} />
            <Input onChange={handleAddress} value={address} placeholder={"Address"} id={"address"} name={"address"} type={"textarea"} />
            <Input onChange={handleOrgUsername} value={orgUsername} placeholder={"Username"} id={"username"} name={"username"} type={"input"} />
            <label  htmlFor="image">Upload Image</label>
            <input className='height' onChange={(e) => setOrgImage(e.target.files[0])} type="file" name="Image" id="image" accept="image/*" />
            <Button className={"btn"} type={"submit"} name={"UPADTE"} />
        </form>
    );
  return (
    <div className="registration-container">
    <div className="form-box">
        <h2 className="form-title">Update</h2>
       { orgForm}
    </div>
</div>
  )
}

export default EditProfile
