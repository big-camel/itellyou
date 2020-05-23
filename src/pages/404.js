import React from 'react';
import Exception from '@/components/Exception';

const NotFound = () => {
    return <Exception />;
};

NotFound.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default NotFound;
