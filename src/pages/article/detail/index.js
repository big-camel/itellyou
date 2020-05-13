import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import Container, { Layout } from '@/components/Container';
import Loading from '@/components/Loading';
import { Article } from '@/components/Content';
import Related from './Related';
import styles from './index.less';
import { Card, Space } from 'antd';
import Outline from '@/components/Editor/Outline';
import { GoogleHorizontal } from '@/components/AdSense';
import DocumentMeta from 'react-document-meta';

function Detail({ match: { params } }) {
    const id = parseInt(params.id || 0);

    const [contentData, setContentData] = useState({});

    const dispatch = useDispatch();
    const { detail } = useSelector(state => state.article);
    const settings = useSelector(state => state.settings);

    useEffect(() => {
        dispatch({
            type: 'article/view',
            payload: {
                id,
            },
        });
        dispatch({
            type: 'article/find',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    if (!detail) return <Loading />;

    const onContentReady = (view, config) => {
        setContentData({
            view,
            config,
        });
    };
    const { title, tags, author, description } = detail;
    const keywords = tags.map(tag => tag.name) || [];
    keywords.push('itellyou');

    return (
        <DocumentMeta
            title={`${title} - ${settings.title}`}
            meta={{
                name: {
                    author: author.name,
                    keywords: keywords.join(','),
                    description,
                },
            }}
        >
            <Container>
                <Layout>
                    <Space direction="vertical" size="large">
                        <div className={styles['article-view']}>
                            <Card>
                                <Article
                                    className={styles['article']}
                                    data={{ ...detail, cover: null }}
                                    tag={true}
                                    view={true}
                                    defaultComment={true}
                                    headerClass={styles['header']}
                                    titleClass={styles['title']}
                                    onContentReady={onContentReady}
                                />
                            </Card>
                        </div>
                        <GoogleHorizontal />
                        <Related id={id} />
                    </Space>
                    <React.Fragment>
                        <Outline
                            {...contentData}
                            style={{ width: (1056 * 29.16666667) / 100 - 22 }}
                        />
                    </React.Fragment>
                </Layout>
            </Container>
        </DocumentMeta>
    );
}
export default Detail;
