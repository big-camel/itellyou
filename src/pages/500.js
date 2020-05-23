import React from 'react';
import Exception from '@/components/Exception';

const PageException = () => {
    return <Exception status={500} />;
};

PageException.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default PageException;
