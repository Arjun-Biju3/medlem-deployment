import React, { useEffect, useState } from 'react'
import './Billing.css'
import Input from '../../Shared/FormElements/Input'
import Button from '../../Shared/FormElements/Button'
import axios from 'axios'
import { useAuth } from '../../Shared/hooks/auth-hook'
import { useParams } from 'react-router-dom'


function EditBilling() {
    const {id} = useParams()
 const [name,setName] = useState("")
     const [limit,setLimit] = useState("")
     const [amount,setAmount] = useState("")
     const {userId} = useAuth()
 
     useEffect(()=>{
         const fetchDetails = async()=>{
             try{
                const response =await axios.get(`http://localhost:5000/api/organization/getbillingByid/${id}`)
                let data = response.data.billing
                 setName(data.name)
                 setLimit(data.limit)
                 setAmount(data.amount)
             }
             catch(error){
                 console.log(error);
                 
             }
             console.log("get billings");
             
         }
         fetchDetails()
     },[])
  
     const handleNewsletterChange =(e)=>{
      setName(e.target.value)
     }
  
     const handleLimit=(e)=>{
      setLimit(e.target.value)
     }
     const handlemoney=(e)=>{
         setAmount(e.target.value)
     }
  
     const submitHandler =async (e)=>{
      e.preventDefault()
     console.log(name,limit,amount);
     try{
         const response = await axios.patch(`http://localhost:5000/api/organization/updatebillingByid/${id}`,{
             name:name,
             time_interval:limit,
             amount:amount,
         })
         console.log(response);
         window.alert("Bill updated successfully!");
      }catch(error){
         console.log("Error caught:", error);
     
         if (error.response && error.response.data && error.response.data.message) {
             window.alert(error.response.data.message); 
         } else if (error.message) {
             window.alert("Error: " + error.message); 
         } else {
             window.alert("updating bill failed. Please try again.");
         }
     }
      
     }
      const subscriptionForm = (
          <form onSubmit={submitHandler}>
              <Input readOnly={true} onChange={handleNewsletterChange} value={name} placeholder={"Name"} id={"ns"} name={"Name"} type={"input"} />
              <Input onChange={handlemoney} value={amount} placeholder={"Amount"} id={"money"} name={"money"} type={"input"} />
              <select onChange={handleLimit} name="limit" value={limit} id="limit">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
              </select>
              <Button className={"create-btn"} name={"UPDATE"} type={"submit"} />
          </form>
      );
    return (
      <div className="bill-container">
      <div className="form-box-login">
          <h2 className="form-title">Medlem</h2>
          <p>Create a billing</p>
          {subscriptionForm}
      </div>
  </div>
    )
}

export default EditBilling
