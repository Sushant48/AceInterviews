import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/home" replace={true} />
};

export default PrivateRoute;
