import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = ()=>{
  const [token, setToken] = useState(false);
  const [tokenExpirationDate,setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [role,setRole] = useState("");
  const [user_name,setUsername] = useState("")

  const login = useCallback((uid, token,role,username,expirationDate) => {
    setToken(token);
    setUserId(uid);
    setRole(role);
    setUsername(username);
    
    
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData',
      JSON.stringify({userId:uid, 
        token:token,
        role:role,
        expiration:tokenExpirationDate.toISOString(),
        user_name:username
      }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole("");
    localStorage.removeItem('userData');
  }, []);


  useEffect(()=>{
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout,remainingTime)
    }else{
      clearTimeout(logoutTimer);
    }
  },[token,logout,tokenExpirationDate]);


  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if(storedData && 
      storedData.token && 
      new Date(storedData.expiration) > new Date()){
      login(storedData.userId,
        storedData.token,
        storedData.role,
        storedData.user_name,
        new Date(storedData.expiration))
    }
  },[login]);

  return {token,login,logout,userId,role,user_name};
}