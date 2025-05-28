import React, { useState } from 'react'
import './Subscription.css'
import Input from '../../Shared/FormElements/Input'
import Button from '../../Shared/FormElements/Button'
import { useAuth } from '../../Shared/hooks/auth-hook'
import axios from 'axios'


function Subscription() {
   const [name,setName] = useState("")
   const [limit,setLimit] = useState("weekly")
   const [image,setImage] = useState("")
   const {userId} = useAuth()

   const handleNewsletterChange =(e)=>{
    setName(e.target.value)
   }

   const handleLimit=(e)=>{
    setLimit(e.target.value)
   }
   

   const subHandler = async(e)=>{
    e.preventDefault()
    const fromData = new FormData();
    fromData.append('name',name);
    fromData.append('time_interval',limit);
    fromData.append('orgId',userId)
    if(image){
        fromData.append('image',image)
    }
    try{
        const response = await axios.post('http://localhost:5000/api/organization/createSubscription',fromData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log(response);
        window.alert("Subscription created successfully!");
        setName("");
        setLimit("weekly");
     }catch(error){
        console.log("Error caught:", error);
    
        if (error.response && error.response.data && error.response.data.message) {
            window.alert(error.response.data.message); 
        } else if (error.message) {
            window.alert("Error: " + error.message); 
        } else {
            window.alert("creating subscription failed. Please try again.");
        }
    }
    
   }
    const subscriptionForm = (
        <form onSubmit={subHandler}>
            <Input onChange={handleNewsletterChange} value={name} placeholder={"Name"} id={"ns"} name={"newsletter"} type={"input"} />
            <input className='height' onChange={(e) => setImage(e.target.files[0])} type="file" name="Image" id="image" accept="image/*" />
            <select onChange={handleLimit} name="limit" value={limit} id="limit">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
            </select>
            <Button className={"create-btn"} name={"Create"} type={"submit"} />
        </form>
    );
  return (
    <div className="sub-container">
    <div className="form-box-login">
        <h2 className="form-title">Medlem</h2>
        <p>Create a subscription</p>
        {subscriptionForm}
    </div>
</div>
  )
}

export default Subscription
