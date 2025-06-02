import React, { useEffect, useState } from "react";
import Button from "../../Shared/FormElements/Button";
import "./CompanyDetails.css";
import ReactLogo from '../../assets/react.svg';
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Shared/hooks/auth-hook";

function CompanyDetails() {

  const { userId } = useAuth();
  const { id } = useParams();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAccessPopup, setShowAccessPopup] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [noOfMembers, setNumberOfMembers] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [membership_id,setMembershipId] = useState("");
  const [subscribedids,setSubscribedids] = useState([]);
  const [image,setImage] = useState("")

  const [subscriptions, setSubscriptions] = useState([]);
  const [billings, setBillings] = useState([]);
  const [benefits, setBenefits] = useState([]);

  const [access, setAccess] = useState({
    fullName: false,
    age: false,
    gender: false,
  });

  const allSelected = Object.values(access).every(Boolean);

  const cancelMembership = () => {
    setShowCancelPopup(true);
  };

  const confirmCancel = async () => {
    setShowCancelPopup(false);
    try {
      const response = await axios.delete('/api/member/deletemembership', {
        data: {
          member_id: userId,
          org_id: id
        }
      });
      console.log(response);
      setIsMember(false);
      setNumberOfMembers(noOfMembers-1)
      window.alert("Membership cancelled successfully!");
    } catch (error) {
      console.log("Error caught:", error);
      if (error.response && error.response.data && error.response.data.message) {
        window.alert(error.response.data.message);
      } else if (error.message) {
        window.alert("Error: " + error.message);
      } else {
        window.alert("Cancelling membership failed. Please try again.");
      }
    }
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
  };

  const becomeMember = () => {
    setShowAccessPopup(true);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAccess((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAccessSubmit = async () => {
    if (allSelected) {
      try {
        const response = await axios.post('/api/member/addmembership', {
          orgId: id,
          member_id: userId
        });
        console.log(response);
        setIsMember(true);
        setNumberOfMembers(noOfMembers+1)
        window.alert("Membership created successfully!");
      } catch (error) {
        console.log("Error caught:", error);
        if (error.response && error.response.data && error.response.data.message) {
          window.alert(error.response.data.message);
        } else if (error.message) {
          window.alert("Error: " + error.message);
        } else {
          window.alert("Creating membership failed. Please try again.");
        }
      }
      setShowAccessPopup(false);
    } else {
      alert("Please select all options.");
    }
  };

  const closeAccessPopup = () => {
    setShowAccessPopup(false);
  };

  const handleSubscribe =async (subId) => {
    console.log("Subscribed to:", subId);  
    try {
      const response = await axios.post('/api/member/addSubscriptions', {
        member_id:userId,
        membership_id:membership_id,
        subscription_id:subId
      });
      console.log(response);
      setSubscribedids([...subscribedids,subId])
      window.alert("subscribed successfully!");
    } catch (error) {
      console.log("Error caught:", error);
      if (error.response && error.response.data && error.response.data.message) {
        window.alert(error.response.data.message);
      } else if (error.message) {
        window.alert("Error: " + error.message);
      } else {
        window.alert("Adding subscription  failed. Please try again.");
      }
    }
  };

  const handleUnsubscribe =async (subId) => {
    console.log("Unsubscribed from:", subId);
    try {
      const response = await axios.post('/api/member/unsubscribe', {
        member_id:userId,
        membership_id:membership_id,
        subscription_id:subId
      });
      console.log(response);
      setSubscribedids(subscribedids.filter(id=>id !== subId))
      window.alert("Removed subscription successfully!");
    } catch (error) {
      console.log("Error caught:", error);
      if (error.response && error.response.data && error.response.data.message) {
        window.alert(error.response.data.message);
      } else if (error.message) {
        window.alert("Error: " + error.message);
      } else {
        window.alert("Removing subscription  failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/organization/getOrganization/${id}`);
        const org = response.data.org[0];
        setName(org.name);
        setAddress(org.address);
        setNumberOfMembers(org.no_of_members);
        setSubscriptions(response.data.subscriptions);
        setBillings(response.data.bill);
        setBenefits(response.data.benefits);
        setImage(org.profile_image)
      
      } catch (err) {
        console.error("Error fetching organization details:", err);
      }

      try {
        const response = await axios.post('/api/member/getmemStatus', {
          member_id: userId,
          org_id: id
        });
        console.log(response.data);
        setIsMember(response.data.status);
        setMembershipId(response.data.membership_id);
      } catch (error) {
        console.log("Error caught:", error);
      }

      try{
        const response = await axios.get(`/api/member/getSubscribedIds/${userId}`);
        console.log(response.data.subscriptionIds[0]);
        setSubscribedids(response.data.subscriptionIds)
      }
      catch(error){
        console.log(error);
      }
    };
    fetchDetails();
  }, [id, userId]);

  return (
    <div className="org-profile-container">
      <div className="org-profile-header">
        <div className="org-logo">
          <img src={`/${image}`} alt="Organization Logo" />
        </div>
      </div>

      <div className="org-details">
        <p><strong>Organization Name:</strong> {name}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>No. of Members:</strong> {noOfMembers}</p>
      </div>

      {isMember && <Button disabled={true} name={"You are a member"} className={"you-mem btn-mem"} />}
      {!isMember && <Button onClick={becomeMember} name={"Become a member"} className={"you-mem btn-mem"} />}
      {isMember && <Button onClick={cancelMembership} name={"Cancel Membership"} className={"btn-mem cancel-mem"} />}

      <div className="org-sections">
        <h2>Subscriptions</h2>
        <hr />
{subscriptions.map((sub, i) => (  
  <p key={i}>
    🔴 {sub.name}{" "}
    {isMember && (
      <>
        {subscribedids.includes(sub._id) ? (
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => handleUnsubscribe(sub._id)}
          >
            ❌
          </span>
        ) : (
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() => handleSubscribe(sub._id)}
          >
            ✅ 
          </span>
        )}
      </>
    )}
  </p>
))}


        <h2>Billings</h2>
        <hr />
        {billings.map((bill, i) => (
          <p key={i}>🔴 {bill.name}: ₹{bill.amount} </p>
        ))}

        <h2>Benefits</h2>
        <hr />
        {benefits.map((ben, i) => (
          <p key={i}><img style={{width:50,height:50}} src={`/${ben.image}`} alt="image" /> {ben.name} </p>
        ))}
      </div>

      {showCancelPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Do you want to cancel membership with {name}?</h3>
            <div className="popup-buttons">
              <button className="yes-btn" onClick={confirmCancel}>Yes</button>
              <button className="no-btn" onClick={closeCancelPopup}>No</button>
            </div>
          </div>
        </div>
      )}

      {showAccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Give Access:</h3>
            <label><input type="checkbox" name="fullName" onChange={handleCheckboxChange} /> Full Name</label><br />
            <label><input type="checkbox" name="age" onChange={handleCheckboxChange} /> Age</label><br />
            <label><input type="checkbox" name="gender" onChange={handleCheckboxChange} /> Gender</label><br />
            <div className="popup-buttons">
              <button className="yes-btn" onClick={handleAccessSubmit}>Submit</button>
              <button className="no-btn" onClick={closeAccessPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDetails;
