import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children } : {children: ReactNode}) {
    const { token, loading } = useAuth();

    if(loading){
        return(
            <div style={{display: "flex",justifyContent:"center",alignItems: "center",height: "100vh"}}>
                <p style={{color: "#888"}}>Loading...</p>
            </div>
        );
    }

    if(!token) return <Navigate to="/signin" replace />;

    return <>{children}</>
}