import React from 'react';
import './CompanyItems.css'; 
import { Link } from 'react-router-dom';

function CompanyItems({ company }) {
  return (
    <div className="company-card">
      <div className="logo-container">
       <Link to={`/companydetails/${company.org_id }`}>
       <img
          src={`http://localhost:5000/${company.profile_image}`}
          alt={`${company.name} logo`}
          className="company-logo"
        />
       </Link>
      </div>
      <div className="company-name">
        {company.name.toLowerCase()}
      </div>
    </div>
  );
}

export default CompanyItems;
