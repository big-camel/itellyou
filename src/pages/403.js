import React from 'react';
import Exception from '@/components/Exception';

const NotAccess = () => {
    return <Exception status={403} />;
};

NotAccess.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default NotAccess;
