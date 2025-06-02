import React, { useEffect, useState } from 'react'
import './Subscription.css'
import Input from '../../Shared/FormElements/Input'
import Button from '../../Shared/FormElements/Button'
import { useAuth } from '../../Shared/hooks/auth-hook'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function EditSubscription() {
 const {id} = useParams() 
 const [name,setName] = useState("")
    const [limit,setLimit] = useState("")
    const [image,setImage] = useState("")
    const {userId} = useAuth()
 
    const handleNewsletterChange =(e)=>{
     setName(e.target.value)
    }
 
    const handleLimit=(e)=>{
     setLimit(e.target.value)
    }
    
    useEffect(()=>{
        const getDetails =async ()=>{
            console.log("getDetails");
            try{
                const response =await axios.get(`/api/organization/getsubscriptionByid/${id}`)
                let data = response.data.subscription
                setName(data.name)
                setLimit(data.limit)
                
            }
            catch(error){
                console.log(error);
            }
        }
        getDetails()
    },[]);
    const subHandler = async(e)=>{
     e.preventDefault()
     const formData = new FormData();
     formData.append('name',name);
     formData.append('limit',limit)
     if(image){
        formData.append('image',image)
     } 
     
     try{
         const response = await axios.patch(`/api/organization/updatesubscriptionByid/${id}`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
         })
         console.log(response);
         window.alert("Subscription updated successfully!");
      }catch(error){
         console.log("Error caught:", error);
     
         if (error.response && error.response.data && error.response.data.message) {
             window.alert(error.response.data.message); 
         } else if (error.message) {
             window.alert("Error: " + error.message); 
         } else {
             window.alert("updating subscription failed. Please try again.");
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
             <Button className={"create-btn"} name={"UPDATE"} type={"submit"} />
         </form>
     );
   return (
     <div className="sub-container">
     <div className="form-box-login">
         <h2 className="form-title">Medlem</h2>
         <p>Upadate subscription</p>
         {subscriptionForm}
     </div>
 </div>
   )
}

export default EditSubscription
