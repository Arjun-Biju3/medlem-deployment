import React, { useEffect, useState } from 'react';
import CompanyItems from '../components/CompanyItems';
import axios from 'axios';

function CompanyList() {
  const [companies,setCompanies] = useState([])
  useEffect(()=>{
    const fetchCompanies =async ()=>{
        try{
          const response = await axios.get('/api/member/getOrganizations');
          setCompanies(response.data.organization)
        
        }
        catch(error){
          console.log(error);
        }
        }
    fetchCompanies()
  },[])
  return (
    <div> 
     <div style={{marginTop:"100px"}}>
     <h2 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', marginTop: '50px' }}>
        Organizations
      </h2>
      <div style={{ marginTop: '20px' }}>
        {companies.map((company) => (
          <CompanyItems  key={company._id} company={company} />
        ))}
      </div>
     </div>
    </div>
  );
}

export default CompanyList;
