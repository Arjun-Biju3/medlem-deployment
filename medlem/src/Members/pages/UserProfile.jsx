import React, { useState, useEffect } from 'react';
import Button from '../../Shared/FormElements/Button';
import { Link } from 'react-router-dom';
import './UserProfile.css';
import { useAuth } from '../../Shared/hooks/auth-hook';
import axios from 'axios';

function UserProfile() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [phone, SetPhone] = useState("");
  const [userImage, setUserImage] = useState("");
  const [log, setLog] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [company, setCompany] = useState([]);
  const [displayItem, setDisplayItem] = useState("companies");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          memberRes,
          logsRes,
          subscriptionsRes,
          membershipRes
        ] = await Promise.all([
          axios.get(`/api/member/getMemberById/${userId}`),
          axios.get(`/api/member/getLogs/${userId}`),
          axios.get(`/api/member/getSubscriptionsById/${userId}`),
          axios.get(`/api/member/getMembershipById/${userId}`)
        ]);

        const member = memberRes.data.member;
        setFname(member.firstName);
        setLname(member.lastName);
        setEmail(member.email);
        setUserName(member.username);
        SetPhone(member.phone);
        setAge(member.age);
        setUserImage(member.image);

        setLog(logsRes.data.log || []);
        setSubscriptions(subscriptionsRes.data.subscriptions || []);
        setCompany(membershipRes.data.memberships || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId]);

  const displayCompanies = () => setDisplayItem("companies");
  const displayDiscount = () => setDisplayItem("discounts");

  const handleUnsubscribe = async (id, orgId, subscription_id) => {
    try {
      const response = await axios.delete('/api/member/unSubscribeById', {
        data: {
          id,
          orgId,
          subscription_id,
          member_id: userId
        }
      });
      window.alert(response.data.message);
      setSubscriptions(subscriptions.filter(item => item._id !== id));
    } catch (error) {
      console.log("Error caught:", error);
      if (error.response?.data?.message) {
        window.alert(error.response.data.message);
      } else if (error.message) {
        window.alert("Error: " + error.message);
      } else {
        window.alert("Failed to unsubscribe. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading profile data...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-logo">
          {/* <img src={`/api/${userImage}`} alt="user logo" /> */}
        </div>
        <div className="profile-actions">
          <Link to={`/userprofile/${userId}`}>
            <Button name="Edit Profile" className="profile-edit-button" />
          </Link>
          <Link to={"/companylist"}>
            <Button name="Browse Company" className="profile-create-button" />
          </Link>
        </div>
      </div>

      <div className="profile-details">
        <p><strong>Name:</strong> {fname} {lname}</p>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Age:</strong> {age}</p>
        <p><strong>Phone:</strong> {phone}</p>
      </div>

      <div className="profile-sections">
        <h2>Log History</h2>
        <hr />
        <div className="log-table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {log.map((item, index) => (
                <tr key={index}>
                  <td>{item.company}</td>
                  <td>{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <br />
        <h2>My Subscriptions</h2>
        <hr />
        {subscriptions?.map((item) => (
          <p key={item._id}>
            {/* <img
              style={{ width: 50, height: 50 }}
              src={`/api/${item.subscription_id?.image}`}
              alt="subscription"
              onError={(e) => { e.target.src = "/default-logo.png"; }}
            />{" "} */}
            {item.subscription_id?.name}
            <span
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              onClick={() => handleUnsubscribe(item._id, item.subscription_id.org_id, item.subscription_id._id)}
            >
              ❌
            </span>
          </p>
        ))}

        <div className='memberships'>
          <div className='view-btn'>
            <Button onClick={displayCompanies} className={"view-color"} name={"Companies"} />
            <Button onClick={displayDiscount} className={"view-color"} name={"Discounts"} />
          </div>
          <div>
            <h2>Membership</h2>
            <hr />
            <div className='mem-items'>
              {displayItem === "companies" ? (
                company.map((item) =>
                  item.organization_info?.profile_image && (
                    // <img
                    //   key={item._id}
                    //   src={`/api/${item.organization_info.profile_image}`}
                    //   alt="org logo"
                    //   onError={(e) => { e.target.src = "/default-org.png"; }}
                    // />
                    <h3>image</h3>
                  )
                )
              ) : (
                company.map((item) =>
                  item.benefits?.map((ben) =>
                    ben.image && (
                      // <img
                      //   key={ben._id}
                      //   src={`/api/${ben.image}`}
                      //   alt="benefit logo"
                      //   onError={(e) => { e.target.src = "/default-benefit.png"; }}
                      // />
                      <h3>company image</h3>
                    )
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
