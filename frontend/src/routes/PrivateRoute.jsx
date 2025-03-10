import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
    const accessToken = Cookies.get('accessToken');

    return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
