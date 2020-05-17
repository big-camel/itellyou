import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'umi';
import DocumentMeta from 'react-document-meta';
import { RouteContext } from '@/context';
import Container, { Layout } from '@/components/Container';
import Loading from '@/components/Loading';
import { Article } from '@/components/Content';
import { Card, Space } from 'antd';
import Editor from '@/components/Editor';
import { GoogleHorizontal } from '@/components/AdSense';
import { HistoryButton } from '@/components/Button';
import HistoryExtra from '../components/HistoryExtra';
import Related from './Related';
import styles from './index.less';

function Detail({ match: { params } }) {
    const id = parseInt(params.id || 0);

    const [contentData, setContentData] = useState({});
    const [historyViewer, setHistoryViewer] = useState(false);
    const dispatch = useDispatch();
    const { detail } = useSelector(state => state.article);
    const settings = useSelector(state => state.settings);
    const { isMobile } = useContext(RouteContext);

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

    const renderAction = () => {
        if (!isMobile) return <HistoryButton onClick={() => setHistoryViewer(true)} />;
        return null;
    };

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
                                    renderAction={renderAction}
                                />
                            </Card>
                        </div>
                        <GoogleHorizontal />
                        <Related id={id} />
                        {historyViewer && (
                            <Editor.History
                                id={id}
                                type="article"
                                extra={data => <HistoryExtra {...data} />}
                                onCancel={() => setHistoryViewer(false)}
                            />
                        )}
                    </Space>
                    <React.Fragment>
                        <Editor.Outline
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
