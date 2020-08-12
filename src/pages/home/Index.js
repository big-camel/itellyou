import React from 'react';
import { Card, Space } from 'antd';
import { useSelector, useIntl, Helmet } from 'umi';
import Container, { Layout } from '@/components/Container';
import Recommends from './components/Recommends';
import Writer from './components/Writer';
import Answerer from './components/Answerer';
import { GoogleSquare } from '@/components/AdSense';
import styles from './index.less';

const Home = () => {
    const settings = useSelector(state => state.settings);
    const intl = useIntl();

    return (
        <>
            <Helmet encodeSpecialCharacters={false}>
                <title>{`${settings.title} , 我告诉你`}</title>
                <meta name="keywords" content={intl.formatMessage({ id: 'keywords' })} />
                <meta name="description" content={intl.formatMessage({ id: 'description' })} />
            </Helmet>
            <Container>
                <Layout>
                    <div className={styles['recommends']}>
                        <Card>
                            <Recommends />
                        </Card>
                    </div>
                    <Space direction="vertical" size="large">
                        <GoogleSquare />
                        <Writer />
                        <Answerer />
                    </Space>
                </Layout>
            </Container>
        </>
    );
};

Home.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'explore/recommends',
        payload: {
            offset: 0,
            limit: 20,
            ...params,
        },
    });
    await dispatch({
        type: 'explore/answerer',
        payload: {
            append: false,
            offset: 0,
            limit: 20,
            ...params,
        },
    });

    await dispatch({
        type: 'explore/writer',
        payload: {
            append: false,
            offset: 0,
            limit: 20,
            ...params,
        },
    });
    if (isServer) return getState();
};

export default Home;
