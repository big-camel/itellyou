import React from 'react';
import { Card, Space } from 'antd';
import Container, { Layout } from '@/components/Container';
import Recommends from './components/Recommends';
import Writer from './components/Writer';
import Answerer from './components/Answerer';
import { GoogleSquare } from '@/components/AdSense';
import styles from './index.less';

export default () => {
    return (
        <Container
            title="ITELLYOU - 知识创造价值"
            metas={{
                keywords:
                    'itellyou,我告诉你,MSDN我告诉你,软件开发,网站系统,APP小程序,UI设计,web前端,原型产品经理,程序员兼职,程序员招聘,悬赏问题,知识付费,付费问答',
                description:
                    'itellyou是领先的程序员综合自由交流平台，提供悬赏问题，知识付费，远程工作等互联网服务，改善未来企业用人方式。提供优秀程序员为您进行网站建设制作、测试运维服务、人工智能AI、大数据区块链、软件开发等优质服务。',
            }}
        >
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
    );
};
