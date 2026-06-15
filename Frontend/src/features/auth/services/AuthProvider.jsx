import { useEffect, useState } from "react";
import { getMe } from "./auth.api";
import { AuthContext } from "./auth.context";

const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const getAndSetUser = async()=>{
            try {
                const data = await getMe();
                console.log("Auth Debug - Data:", data);
                if(data && data.user){   
                    setUser(data.user);
                }
            } catch (error) {
                console.log("Auth Debug - Error:", error);
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser();
    },[])


    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;