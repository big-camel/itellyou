import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { Card, Menu, Space, Button } from 'antd';
import { history, Link, useSelector, useAccess, Helmet } from 'umi';
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

    const detail = useSelector(state => state.tag.detail[id]);
    const me = useSelector(state => state.user.me);
    const settings = useSelector(state => state.settings);
    const access = useAccess();
    const { isMobile } = useContext(RouteContext);

    if (!detail) return <Loading />;
    const { name, description, use_star, content, html, author } = detail;
    const menu = menus.find(item => item.key === path);

    let title = `${detail.name} - ${settings.title}`;
    if (path !== 'intro') title = `${menu.title} - ${title}`;
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="keywords" content={`${name},itellyou,${name}的${menu.title}`} />
                <meta name="description" content={description} />
            </Helmet>
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
                                    <menu.component content={content} html={html} />
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
                    <Space direction="vertical" size="large">
                        <RelatedArticle id={id} />
                        <RelatedColumn id={id} />
                    </Space>
                </Layout>
            </Container>
        </>
    );
}

Detail.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;
    const id = parseInt(match.params.id || 0);

    const path = match.params.path || 'intro';

    await dispatch({
        type: 'tag/find',
        payload: {
            id,
            ...params,
        },
    });

    await RelatedArticle.getInitialProps({ isServer, store, params: { ...params, id } });

    await RelatedColumn.getInitialProps({ isServer, store, params: { ...params, id } });

    const menu = menus.find(menu => menu.key === path);
    if (menu && menu.component.getInitialProps) {
        await menu.component.getInitialProps({ isServer, store, params: { ...params, id } });
    }

    if (isServer) return getState();
};
export default Detail;
