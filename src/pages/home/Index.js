import React from 'react';
import { Card } from 'antd';
import Container, { Layout } from '@/components/Container';
import Recommends from './components/Recommends';
import Writer from './components/Writer';
import Answerer from './components/Answerer';
import styles from './index.less';

export default () => {
    return (
        <Container>
            <Layout>
                <div className={styles['recommends']}>
                    <Card>
                        <Recommends />
                    </Card>
                </div>
                <React.Fragment>
                    <Writer />
                    <Answerer className={styles['sider-answerer']} />
                </React.Fragment>
            </Layout>
        </Container>
    );
};
