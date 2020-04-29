import React from 'react';
import { Card, Space } from 'antd';
import { useSelector, useIntl } from 'umi';
import Container, { Layout } from '@/components/Container';
import Recommends from './components/Recommends';
import Writer from './components/Writer';
import Answerer from './components/Answerer';
import { GoogleSquare } from '@/components/AdSense';
import styles from './index.less';
import DocumentMeta from 'react-document-meta';

export default () => {
    const settings = useSelector(state => state.settings);
    const intl = useIntl();
    return (
        <DocumentMeta
            title={`${settings.title} - 知识创造价值`}
            meta={{
                name: {
                    keywords: intl.formatMessage({ id: 'keywords' }),
                    description: intl.formatMessage({ id: 'description' }),
                },
            }}
        >
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
        </DocumentMeta>
    );
};
