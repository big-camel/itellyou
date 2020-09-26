import React from 'react';
import Exception from '@/components/Exception';

const PageException = ({ location: { query } }) => {
    const msg = query.m;
    const title = query.t;
    return <Exception status={500} title={title} subTitle={msg} />;
};

PageException.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default PageException;
