import React from 'react';
import Layout from '../components/Layout';
import Access from './components/Access';
import Log from './components/Log';

export default () => {
    return (
        <Layout defaultKey="wallet">
            <Access />
            <Log />
        </Layout>
    );
};
