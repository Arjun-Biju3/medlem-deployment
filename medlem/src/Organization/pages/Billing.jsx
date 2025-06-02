import React, { useEffect, useState } from 'react'
import './Billing.css'
import Input from '../../Shared/FormElements/Input'
import Button from '../../Shared/FormElements/Button'
import axios from 'axios'
import { useAuth } from '../../Shared/hooks/auth-hook'

function Billing() {
    const [name,setName] = useState("")
    const [limit,setLimit] = useState("weekly") 
    const [amount,setAmount] = useState("")
    const [subscriptions,setSubscriptions] = useState([])
    const {userId} = useAuth()

    useEffect(()=>{
        const fetchSubscriptions = async()=>{
            try{
                const response = await axios.get('/api/organization/getSubscriptions')
                console.log(response.data.organizations);
                setSubscriptions(response.data.organizations)  
            }
            catch(error){
                console.log(error);
                
            }
        }
        fetchSubscriptions()
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
        const response = await axios.post('/api/organization/createBilling',{
            name:name,
            time_interval:limit,
            amount:amount,
            orgId:userId
        })
        console.log(response);
        window.alert("Bill created successfully!");
        setName("");
        setAmount("");
        setLimit("weekly");
     }catch(error){
        console.log("Error caught:", error);
    
        if (error.response && error.response.data && error.response.data.message) {
            window.alert(error.response.data.message); 
        } else if (error.message) {
            window.alert("Error: " + error.message); 
        } else {
            window.alert("creating bill failed. Please try again.");
        }
    }
     
    }
     const subscriptionForm = (
         <form onSubmit={submitHandler}>
                <select onChange={handleNewsletterChange} name="name" value={name} id="name">
            <option value="" disabled>Select a subscription</option>
            {subscriptions.map((item) => (
                <option key={item._id} value={item.name}>
                    {item.name}
                </option>
            ))}
        </select>

             {/* <Input onChange={handleNewsletterChange} value={name} placeholder={"Name"} id={"ns"} name={"newsletter"} type={"input"} /> */}
             <Input onChange={handlemoney} value={amount} placeholder={"Amount"} id={"money"} name={"money"} type={"input"} />
             <select onChange={handleLimit} name="limit" value={limit} id="limit">
                 <option value="weekly">Weekly</option>
                 <option value="monthly">Monthly</option>
                 <option value="yearly">Yearly</option>
             </select>
             <Button className={"create-btn"} name={"Create"} type={"submit"} />
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

export default Billing
