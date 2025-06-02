import React, { useEffect, useState } from 'react'
import './Benefits.css'
import Input from '../../Shared/FormElements/Input'
import Button from '../../Shared/FormElements/Button'
import axios from 'axios'
import { useAuth } from '../../Shared/hooks/auth-hook'
import { useParams } from 'react-router-dom'


function EditBenefits() {
    const {id} = useParams()
 const [name,setName] = useState("")
     const [limit,setLimit] = useState("weekly")
     const [description,setDescription] = useState("")
     const [image,setImage] = useState("")
     const {userId} = useAuth()
 
     const handleNewsletterChange =(e)=>{
      setName(e.target.value)
     }
  
     const handleLimit=(e)=>{
      setLimit(e.target.value)
     }
     const handlemoney=(e)=>{
         setDescription(e.target.value)
     }
     
     useEffect(()=>{
        const getDetails = async()=>{
            console.log("get benefits");
            try{
                const response =await axios.get(`/api/organization/getbenefitsByid/${id}`)
                let data = response.data.benefit
                 setName(data.name)
                 setLimit(data.limit)
                setDescription(data.description)
             }
             catch(error){
                 console.log(error);
                 
             }
        }
        getDetails()
     },[])

     const submitHandler =async (e)=>{
      e.preventDefault()
      const formData = new FormData();
      formData.append('name',name);
      formData.append('description',description);
      formData.append('time_interval',limit);
      if(image){
          formData.append('image',image);
      }
      try{
         const response = await axios.patch(`/api/organization/updatebenefitsByid/${id}`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
         })
         console.log(response);
         window.alert("Benefit updated successfully!");
      }catch(error){
         console.log("Error caught:", error);
     
         if (error.response && error.response.data && error.response.data.message) {
             window.alert(error.response.data.message); 
         } else if (error.message) {
             window.alert("Error: " + error.message); 
         } else {
             window.alert("updating benefit failed. Please try again.");
         }
     }
     }
      const subscriptionForm = (
          <form onSubmit={submitHandler}>
              <Input  onChange={handleNewsletterChange} value={name} placeholder={"Name"} id={"ns"} name={"newsletter"} type={"input"} />
              <Input onChange={handlemoney} value={description} placeholder={"Description"} id={"money"} name={"Description"} type={"input"} />
             
              <select onChange={handleLimit} name="limit" value={limit} id="limit">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
              </select>
              <input className='height' onChange={(e) => setImage(e.target.files[0])} type="file" name="Image" id="image" accept="image/*" />
              <Button className={"create-btn"} name={"UPDATE"} type={"submit"} />
          </form>
      );
    return (
      <div className="ben-container">
      <div className="form-box-login">
          <h2 className="form-title">Medlem</h2>
          <p>Upadte  benefit</p>
          {subscriptionForm}
      </div>
  </div>
    )
}

export default EditBenefits
