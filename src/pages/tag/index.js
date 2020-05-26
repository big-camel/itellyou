import React, { useEffect, useContext } from 'react';
import { List, Card, Empty, message } from 'antd';
import Tag from '@/components/Tag';
import Loading from '@/components/Loading';
import styles from './index.less';
import Container from '@/components/Container';
import { Link, useDispatch, useSelector, useIntl, Helmet } from 'umi';
import { RouteContext } from '@/context';

const TagIndex = () => {
    const dispatch = useDispatch();
    const tag = useSelector(state => state.tag);

    const user = useSelector(state => state.user);
    const tagStar = useSelector(state => state.tagStar.list);
    const loadingEffect = useSelector(state => state.loading);
    const settings = useSelector(state => state.settings);

    useEffect(() => {
        if (user.me) {
            dispatch({
                type: 'tagStar/list',
                payload: {
                    append: false,
                    limit: 10000,
                },
            });
        }
    }, [dispatch, user.me]);

    const { isMobile } = useContext(RouteContext);

    const renderGroupList = () => {
        const groupLoading = loadingEffect.effects['tag/group'];
        const { group } = tag || {};
        if (!group || groupLoading) {
            return <Loading />;
        }

        return (
            <List
                grid={{ gutter: 16, column: isMobile ? 1 : 4 }}
                dataSource={group.data}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <Card
                            type="inner"
                            title={item.name}
                            className={styles['tag-card']}
                            bordered={false}
                        >
                            {item.tag_list &&
                                item.tag_list.map(({ id, name }) => (
                                    <Tag
                                        className={styles['tag-item']}
                                        key={id}
                                        id={id}
                                        href={`/tag/${id}`}
                                        title={name}
                                    />
                                ))}
                        </Card>
                    </List.Item>
                )}
            />
        );
    };

    const onTagChange = ({ id, name }) => {
        const messageClose = message.loading('关注中...');
        dispatch({
            type: 'tagStar/follow',
            payload: {
                id,
                name,
            },
        }).then(() => {
            messageClose();
        });
    };

    const renderUserTag = () => {
        if (!user.me) return;
        const tagStarLoading = loadingEffect.effects['tagStar/list'];
        if (!tagStar || tagStarLoading) return <Loading />;

        return (
            <Card title="我的关注" className={styles['tag-header']}>
                <div>
                    <Tag.Select onChange={onTagChange} placeholder="添加关注标签" />
                    <div className={styles['tag-me-list']}>
                        {tagStar.data &&
                            tagStar.data
                                .filter(item => item.tag.use_star !== false)
                                .map(({ tag: { id, name } }) => (
                                    <Tag
                                        className={styles['tag-item']}
                                        key={`u_${id}`}
                                        id={id}
                                        href={`/tag/${id}`}
                                        title={name}
                                    />
                                ))}
                        {!tagStar.total ||
                            (tagStar.total === 0 && (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="您还未关注任何标签哦~"
                                />
                            ))}
                    </div>
                </div>
            </Card>
        );
    };
    const intl = useIntl();
    return (
        <>
            <Helmet>
                <title>{`${intl.formatMessage({ id: 'tag.page.index' })} - ${
                    settings.title
                }`}</title>
                <meta
                    name="keywords"
                    content={`${intl.formatMessage({ id: 'keywords' })},标签,标签列表`}
                />
                <meta
                    name="description"
                    content={`itellyou的常用标签列表页${intl.formatMessage({
                        id: 'description',
                    })}`}
                />
            </Helmet>
            <Container>
                <div className={styles['tag-layout']}>
                    {renderUserTag()}
                    <Card className={styles['tag-group-list']}>
                        <Card.Meta
                            title="常用标签"
                            description={
                                <React.Fragment>
                                    标签不仅能组织和归类你的内容，还能关联相似的内容。
                                    <Link to="/tag/list">查看全部</Link>
                                </React.Fragment>
                            }
                        />
                        {renderGroupList()}
                    </Card>
                </div>
            </Container>
        </>
    );
};

TagIndex.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'tag/group',
        payload: {
            offset: 0,
            limit: 1000,
            ...params,
        },
    });

    if (isServer) return getState();
};

export default TagIndex;
