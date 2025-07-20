import React from 'react'
import PhotographerLayout from './PhotographerLayout';
import DefaultLayout from './DefaultLayout';
import useAuthStore from '../stateManagement/useAuthStore';

export const DynamicLayout = () => {
    const { user } = useAuthStore();

    if (user.role === 'photographer') {
        return <PhotographerLayout />;
    }

    if (user.role === 'client') {
        return <DefaultLayout />;
    }

    return null;
};

