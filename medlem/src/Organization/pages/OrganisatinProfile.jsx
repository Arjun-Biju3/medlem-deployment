import React, { useEffect, useState } from "react";
import Button from "../../Shared/FormElements/Button";
import "./OrganisationProfile.css"; 
import ReactLogo from '../../assets/react.svg';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Shared/hooks/auth-hook";
import axios from "axios";

function OrganisationProfile() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [organizationName, setOrganizationName] = useState("");
  const [address, setAddress] = useState("");
  const [orgId, setOrgId] = useState("");
  const [noOfMembers, setNoOfMembers] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [billings, setBillings] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [orgImage,setOrgImage] = useState("")

  const subscriptionHandler = () => {
    navigate("/addSubscription");
  };

  const billingHandler = () => {
    navigate("/addBilling");
  };

  const benefitsHandler = () => {
    navigate("/addBenefits");
  };


  const handleDeleteSubscription =async (id)=>{
    console.log("delete subscription",id);
    try{
      const response = await axios.delete(`/api/organization/deletesubscription/${id}`)
      setSubscriptions(subscriptions.filter(sub=>sub._id !== id))
      window.alert(response.data.message);
   }catch(error){
      console.log("Error caught:", error);
  
      if (error.response && error.response.data && error.response.data.message) {
          window.alert(error.response.data.message); 
      } else if (error.message) {
          window.alert("Error: " + error.message); 
      } else {
          window.alert("deleting subscription failed. Please try again.");
      }
  }
    
  }
  const handleDeleteBillings =async (id)=>{
    console.log("delete billing",id);
    try{
      const response = await axios.delete(`/api/organization/deletebilling/${id}`)
      setBillings(billings.filter(bill=>bill._id !== id))
      window.alert(response.data.message);
   }catch(error){
      console.log("Error caught:", error);
  
      if (error.response && error.response.data && error.response.data.message) {
          window.alert(error.response.data.message); 
      } else if (error.message) {
          window.alert("Error: " + error.message); 
      } else {
          window.alert("deleting billing failed. Please try again.");
      }
  }
  }
  const handleDeleteBenefits =async (id)=>{
    console.log("delete benefits",id);
    try{
      const response = await axios.delete(`/api/organization/deletebenefit/${id}`)
      setBenefits(benefits.filter(benefits=>benefits._id !== id))
      window.alert(response.data.message);
   }catch(error){
      console.log("Error caught:", error);
  
      if (error.response && error.response.data && error.response.data.message) {
          window.alert(error.response.data.message); 
      } else if (error.message) {
          window.alert("Error: " + error.message); 
      } else {
          window.alert("deleting benefit failed. Please try again.");
      }
  }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`/api/organization/getOrganization/${userId}`);
        const org = response.data.org?.[0];
        console.log(response.data);
        if (org) {
          setOrganizationName(org.name || "");
          setAddress(org.address || "");
          setOrgId(org._id || "");
          setNoOfMembers(org.no_of_members || 0);
          setBillings(org.billings || []);
          setOrgImage(org.profile_image);
        }

        setSubscriptions(response.data.subscriptions || []);
        setBenefits(response.data.benefits || []);
        setBillings(response.data.bill || [])
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [userId]); 

  return (
    <div className="org-profile-container">
      <div className="org-profile-header">
        <Link to={`/profile/${userId}`}>
          <Button name={"Edit Profile"} className="edit-button" />
        </Link>

        <div className="org-logo">
          <img src={`/${orgImage}`} alt="Organization Logo" />
        </div>

        <div className="org-actions">
          <Button onClick={subscriptionHandler} name={"Create Subscription"} />
          <Button onClick={billingHandler} name={"Create Billing"} />
          <Button onClick={benefitsHandler} name={"Create Benefit"} />
        </div>
      </div>

      <div className="org-details">
        <p><strong>Name Organization</strong> {organizationName}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>No. of Members:</strong> {noOfMembers}</p>
      </div>
      <div className="org-sections">
        <h2>Subscriptions</h2>
        <hr />
        {subscriptions.length > 0 ? (
          subscriptions.map((item, index) => (
            <p key={index}>
              🔴 <strong>{item.name}</strong> ({item.time_interval})
              <>
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          >
           <Link style={{textDecoration:"none"}} to={`/editsubscription/${item._id}`} >📝</Link>
          </span>
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => handleDeleteSubscription(item._id)}
          >
            ❌
          </span>
        
      </>
            </p>
          ))
        ) : (
          <p>No subscriptions found</p>
        )}
  <br />
        <h2>Billings</h2>
        <hr />
        {billings.length > 0 ? (
          billings.map((item, index) => (
            <p key={index}>
              🔴 <strong>{item.name}</strong> - ₹{item.amount} ({item.time_interval}) 
              {
      <>
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          >
           <Link style={{textDecoration:"none"}} to={`/editbilling/${item._id}`} >📝</Link>
          </span>
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => handleDeleteBillings(item._id)}
          >
            ❌
          </span>
        
      </>
    }

            </p>
          ))
        ) : (
          <p>No billings found</p>
        )}

        <br />
        <h2>Benefits</h2>
        <hr />
        {benefits.length > 0 ? (
          benefits.map((item, index) => (
            <p key={index}>
            <img style={{width:50,height:50}} src={`/${item.image}`} alt="image" /> <strong>{item.name}</strong>
              <>
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          >
            <Link style={{textDecoration:"none"}} to={`/editbenefit/${item._id}`} >📝</Link>
          </span>
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => handleDeleteBenefits(item._id)}
          >
            ❌
          </span>
        
      </>
            </p>
          ))
        ) : (
          <p>No benefits found</p>
        )}
      </div>
    </div>
  );
}

export default OrganisationProfile;
