import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../stateManagement/useAuthStore';
import { toast } from 'sonner';

const RoleRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading, } = useAuthStore();

    const navigate = useNavigate();
    const isAllowed = allowedRoles.includes(user?.role)
    const location = useLocation();

    // 1. If not authenticated, show login modal
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            toast.warning('You must be logged in to access this page.', {
                icon: '🔐',
                duration: 5000,
            });
            navigate('/login', { state: { from: location } });
        }
    }, [loading, isAuthenticated, location, navigate]);

    // 2. Redirect if role is not allowed
    useEffect(() => {

        if (!loading && isAuthenticated && !isAllowed) {
            toast.warning('Unauthorized access. Redirecting to home.');
            navigate('/', { replace: true });
        }
    }, [loading, isAuthenticated, user, isAllowed, navigate]);

    useEffect(() => {
        if (!loading && isAuthenticated && !user?.isVerified && isAllowed) {
            toast.warning("Please verify your account to access this page.", {
                icon: '📧',
                duration: 4000
            });

            navigate('/otp-verification-email', { state: { from: location } });

        }
    }, [loading, isAuthenticated, user, navigate, isAllowed, location]);


    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated || !isAllowed || !user?.isVerified) return null;

    return <Outlet />;
};

export default RoleRoute;
