import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stateManagement/useAuthStore';

const RoleRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading, setShowLogin } = useAuthStore();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            setShowLogin(true);
        }
    }, [loading, isAuthenticated, setShowLogin]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
};

export default RoleRoute;
