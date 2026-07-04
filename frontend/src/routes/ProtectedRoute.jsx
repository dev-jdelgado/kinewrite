import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {

    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <Loader
                text="Checking your session..."
            />
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;