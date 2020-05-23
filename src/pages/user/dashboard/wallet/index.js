import React from 'react';
import Layout from '../components/Layout';
import Access from './components/Access';
import Log from './components/Log';

const Wallet = () => {
    return (
        <Layout defaultKey="wallet">
            <Access />
            <Log />
        </Layout>
    );
};

Wallet.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default Wallet;
