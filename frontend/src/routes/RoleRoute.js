import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../stateManagement/useAuthStore';
import { toast } from 'sonner';

const RoleRoute = ({ allowedRoles }) => {
    const {
        user,
        isAuthenticated,
        loading,
        setShowLogin,
        setLoginOverlayClosed,
        loginOverlayClosed
    } = useAuthStore();

    const navigate = useNavigate();

    const loginModalWasOpened = useRef(false);

    // 1. If not authenticated, show login modal once
    useEffect(() => {
        if (!loading && !isAuthenticated && !loginModalWasOpened.current) {
            toast.warning('You must be logged in to access this page.', {
                icon: '🔐',
                duration: 5000,
            });
            setShowLogin(true);
            setLoginOverlayClosed(false); // reset every time modal is shown
            loginModalWasOpened.current = true;
        }

        // 2. If authenticated but role is not allowed → redirect
        if (!loading && isAuthenticated && !allowedRoles.includes(user?.role)) {
            toast.warning('Unauthorized access. Redirecting to home.');
            navigate('/', { replace: true })
        }
    }, [loading, isAuthenticated, user, allowedRoles, setShowLogin, setLoginOverlayClosed, navigate]);


    // 4. Actually perform redirect
    useEffect(() => {
        console.log(loginOverlayClosed)
        if (loginOverlayClosed) {
            navigate('/', { replace: true });
        }
    }, [navigate, loginOverlayClosed]);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return null; // wait while login modal is up
    if (!allowedRoles.includes(user?.role)) return null;

    return <Outlet />;
};

export default RoleRoute;
