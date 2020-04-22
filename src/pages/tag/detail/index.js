import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Card, Menu, Space, Button } from 'antd';
import { history, Link, useDispatch, useSelector } from 'umi';
import Loading from '@/components/Loading';
import Container, { Layout } from '@/components/Container';
import Tag from '@/components/Tag';
import menus from './menu';
import styles from './index.less';
import { ReportButton, EditButton } from '@/components/Button';
import RelatedColumn from './components/RelatedColumn';
import RelatedArticle from './components/RelatedArticle';

function Detail({ match: { params } }) {
    const id = parseInt(params.id || 0);

    const path = params.path || 'intro';

    if (!menus.find(menu => menu.key === path)) history.push('/404');

    const dispatch = useDispatch();
    const detail = useSelector(state => state.tag.detail[id]);
    const me = useSelector(state => state.user.me);
    const settings = useSelector(state => state.settings);

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
        <Container
            title={title}
            metas={{
                keywords: `${name},itellyou,${name}的${menu.title}`,
                description,
            }}
        >
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
                                {me && me.id === author.id && (
                                    <EditButton type="link" href={`/tag/${id}/edit`} />
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
                </div>
                <React.Fragment>
                    <RelatedArticle id={id} />
                    <div className={styles['related-column']}>
                        <RelatedColumn id={id} />
                    </div>
                </React.Fragment>
            </Layout>
        </Container>
    );
}
export default Detail;
