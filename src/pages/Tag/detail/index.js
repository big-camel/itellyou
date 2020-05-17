import React, { useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { Card, Menu, Space, Button } from 'antd';
import { history, Link, useDispatch, useSelector, useAccess } from 'umi';
import DocumentMeta from 'react-document-meta';
import { RouteContext } from '@/context';
import Loading from '@/components/Loading';
import Container, { Layout } from '@/components/Container';
import Tag from '@/components/Tag';
import Editor from '@/components/Editor';
import { ReportButton, EditButton, HistoryButton } from '@/components/Button';
import RelatedColumn from './components/RelatedColumn';
import RelatedArticle from './components/RelatedArticle';
import menus from './menu';
import styles from './index.less';

function Detail({ match: { params } }) {
    const id = parseInt(params.id || 0);

    const path = params.path || 'intro';

    if (!menus.find(menu => menu.key === path)) history.push('/404');

    const [historyViewer, setHistoryViewer] = useState(false);
    const dispatch = useDispatch();
    const detail = useSelector(state => state.tag.detail[id]);
    const me = useSelector(state => state.user.me);
    const settings = useSelector(state => state.settings);
    const access = useAccess();
    const { isMobile } = useContext(RouteContext);

    useEffect(() => {
        dispatch({
            type: 'tag/find',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    if (!detail) return <Loading />;
    const { name, description, use_star, content, author } = detail;
    const menu = menus.find(item => item.key === path);

    let title = `${detail.name} - ${settings.title}`;
    if (path !== 'intro') title = `${menu.title} - ${title}`;
    return (
        <DocumentMeta
            title={title}
            meta={{
                name: {
                    keywords: `${name},itellyou,${name}的${menu.title}`,
                    description,
                },
            }}
        >
            <Container>
                <Layout>
                    <div className={styles['layout']}>
                        <div className={styles['header']}>
                            <Card>
                                <Card.Meta title={<h2>{name}</h2>} />
                                <div className={styles['description']}>
                                    {description}
                                    <Button type="link" href={`/tag/${id}`}>
                                        查看简介
                                    </Button>
                                </div>
                                <Space size="middle">
                                    <Tag.Star id={id} name={name} use_star={use_star} />
                                    <ReportButton type="tag" />
                                    {((me && me.id === author.id) || access.webTagPublicEdit) && (
                                        <EditButton type="link" href={`/tag/${id}/edit`} />
                                    )}
                                    {!isMobile && (
                                        <HistoryButton onClick={() => setHistoryViewer(true)} />
                                    )}
                                </Space>
                            </Card>
                        </div>
                        <div className={styles['body']}>
                            <Card
                                title={
                                    <Menu mode="horizontal" defaultSelectedKeys={path}>
                                        {menus.map(({ key, title }) => (
                                            <Menu.Item
                                                key={key}
                                                className={classNames({ active: key === path })}
                                            >
                                                <Link
                                                    to={
                                                        `/tag/${id}` +
                                                        (key !== 'intro' ? `/${key}` : '')
                                                    }
                                                >
                                                    {title}
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                            >
                                {path === 'intro' ? (
                                    <menu.component content={content} />
                                ) : (
                                    <menu.component id={id} />
                                )}
                            </Card>
                        </div>
                        {historyViewer && (
                            <Editor.History
                                id={id}
                                type="tag"
                                onCancel={() => setHistoryViewer(false)}
                            />
                        )}
                    </div>
                    <React.Fragment>
                        <RelatedArticle id={id} />
                        <div className={styles['related-column']}>
                            <RelatedColumn id={id} />
                        </div>
                    </React.Fragment>
                </Layout>
            </Container>
        </DocumentMeta>
    );
}
export default Detail;
