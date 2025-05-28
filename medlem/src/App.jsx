import Login from "./Members/pages/Login"
import Registration from "./Members/pages/Registration"
import {Route, Routes} from 'react-router-dom'
import { BrowserRouter as Router  } from "react-router-dom"
import MainNavigation from "./Shared/Navigation/MainNavigation"
import { useState } from "react"
import OrganisatinProfile from "./Organization/pages/OrganisatinProfile"
import Subscription from "./Organization/pages/Subscription"
import Billing from "./Organization/pages/Billing"
import Benefits from "./Organization/pages/Benefits"
import EditProfile from "./Organization/pages/EditProfile"
import UserProfile from "./Members/pages/UserProfile"
import EditUserProfile from "./Members/pages/EditUserProfile"
import CompanyList from "./Members/pages/CompanyList"
import CompanyDetails from "./Members/pages/CompanyDetails"
import { useAuth } from "./Shared/hooks/auth-hook"
import { AuthContext } from "./Shared/context/auth-context"
import { Navigate } from "react-router-dom"
import EditSubscription from "./Organization/pages/EditSubscription"
import EditBilling from "./Organization/pages/EditBilling"
import EditBenefits from "./Organization/pages/EditBenefits"

function App() {
  const {token, login, logout, userId,role,user_name} = useAuth();
  const [username,setUsername] = useState("")

  console.log(user_name);
  let routes

token? routes=(
  <Routes>
  <Route path="/addSubscription" element={<Subscription/>} />
  <Route path="/addBilling" element={<Billing/>} />
  <Route path="/addBenefits" element={<Benefits/>} />
  <Route path="/profile/:id" element={<EditProfile/>} />
  <Route path="/userprofile/:id" element={<EditUserProfile/>} />
  <Route path="/companylist" element={<CompanyList/>} />
  <Route path="/companydetails/:id" element={<CompanyDetails/>} />
  {role=="organization"?<Route path="/" element={<OrganisatinProfile/>} />:
  <Route path="/" element={<UserProfile/>} />
  }
  <Route path="*" element={<Navigate to="/" />} />
  <Route path="/editsubscription/:id" element={<EditSubscription/>} />
  <Route path="/editbilling/:id" element={<EditBilling/>} />
  <Route path="/editbenefit/:id" element={<EditBenefits/>} />
</Routes>
):
routes=(
<Routes>
    <Route path="/" element={<Login setName={setUsername}/>}/>
    <Route path="/register" element={<Registration/>}/>
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
)

  return (
  
  <AuthContext.Provider value={{isLoggedIn:!!token,token:token,userId,login,logout}} >
    <Router>
    {token && <MainNavigation type={role=="organization"?"COMPANY":"PROFILE"} username={user_name} logout={logout} />}
    {routes}
  </Router>
  </AuthContext.Provider>
   
  )
}

export default App
