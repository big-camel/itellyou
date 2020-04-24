import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import Container, { Layout } from '@/components/Container';
import Loading from '@/components/Loading';
import { Article } from '@/components/Content';
import Related from './Related';
import styles from './index.less';
import { Card } from 'antd';
import Outline from '@/components/Editor/Outline';
import { GoogleSquare } from '@/components/AdSense';

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
        <Container
            title={`${title} - ${settings.title}`}
            metas={{
                author: author.name,
                keywords: keywords.join(','),
                description,
            }}
        >
            <Layout>
                <React.Fragment>
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
                    <GoogleSquare style={{ marginTop: 24 }} />
                    <div className={styles['related']}>
                        <Related id={id} />
                    </div>
                </React.Fragment>
                <React.Fragment>
                    <Outline {...contentData} style={{ width: (1056 * 29.16666667) / 100 - 22 }} />
                </React.Fragment>
            </Layout>
        </Container>
    );
}
export default Detail;
