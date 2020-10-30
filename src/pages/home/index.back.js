import React from 'react';
import { Card, Space, Carousel } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useSelector, useIntl, Helmet } from 'umi';
import Container, { Layout } from '@/components/Container';
import Recommends from './components/Recommends';
import Writer from './components/Writer';
import Answerer from './components/Answerer';
import Ad from '@/components/Ad';
import styles from './index.less';

const Home = () => {
    const settings = useSelector((state) => state.settings);
    const intl = useIntl();

    return (
        <>
            <Helmet encodeSpecialCharacters={false}>
                <title>{`${
                    settings && settings.site ? settings.site.name : 'ITELLYOU , 我告诉你'
                }`}</title>
                <meta name="keywords" content={intl.formatMessage({ id: 'keywords' })} />
                <meta name="description" content={intl.formatMessage({ id: 'description' })} />
            </Helmet>
            <Container>
                <Layout>
                    <Space direction="vertical" size="small">
                        <Card className={styles['home-carousel']}>
                            <Carousel autoplay>
                                <div>
                                    <img
                                        src="https://image-static.segmentfault.com/393/054/3930546268-5f61c0a926086"
                                        width="100%"
                                    />
                                </div>
                                <div>
                                    <img
                                        src="https://image-static.segmentfault.com/146/815/1468153747-5f5c2157ce9a0"
                                        width="100%"
                                    />
                                </div>
                                <div>
                                    <img
                                        src="https://image-static.segmentfault.com/399/635/3996357443-5f48a9552a200"
                                        width="100%"
                                    />
                                </div>
                            </Carousel>
                        </Card>
                        <div className={styles['recommends']}>
                            <Card>
                                <Recommends />
                            </Card>
                        </div>
                    </Space>
                    <Space direction="vertical" size="small">
                        <Card
                            size="small"
                            className={styles['recruit-card']}
                            title="ITELLYOU 帮助创作者轻松获得收入🎉"
                        >
                            <p>📘 文章创作获得打赏</p>
                            <p>🎨 出售知识获得收益</p>
                            <p>💊 解决问题获得悬赏</p>
                            <p>🎪 平台广告收益分成</p>
                        </Card>
                        <Ad type="square" />
                        <Writer />
                        <Answerer />
                        <Ad type="square" />
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
            limit: 5,
            ...params,
        },
    });

    await dispatch({
        type: 'explore/writer',
        payload: {
            append: false,
            offset: 0,
            limit: 5,
            ...params,
        },
    });
    if (isServer) return getState();
};

export default Home;
