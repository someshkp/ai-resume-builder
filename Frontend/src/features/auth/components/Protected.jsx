import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const {user, loading} = useAuth();
    console.log("Protected Debug - user:", user, "loading:", loading);

    if(loading){
        return <h1>Loading...</h1>
    }

    if(!user){
        console.log("Protected Debug - No user found, redirecting to /login");
            return <Navigate to="/login" />
    }
    return children;
}

export default Protected;