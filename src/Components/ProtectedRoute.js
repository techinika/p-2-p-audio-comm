import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
    // Setting variables
    const navigate = useNavigate();
    let { user } = useUserAuth();

    // if there is no user object redirect to join, else return component
    if (!user) {
        navigate("/join");
    }
    return children;
}
export default ProtectedRoute;