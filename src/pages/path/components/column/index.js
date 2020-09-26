import React, { useEffect, useContext } from 'react';
import { Link, useDispatch, useSelector, history, Helmet } from 'umi';
import { Card, Button, Avatar, Space } from 'antd';
import { ReportButton } from '@/components/Button';
import { RouteContext } from '@/context';
import Loading from '@/components/Loading';
import Setting from './components/setting';
import List from './components/list';
import Member from './components/member';
import styles from './index.less';

const Column = ({ id, paths, location: { query } }) => {
    const setting = paths && paths.length > 1 ? paths[1] === 'setting' : null;

    const dispatch = useDispatch();
    const detail = useSelector((state) => state.column.detail[id]);
    const me = useSelector((state) => state.user.me);
    const settings = useSelector((state) => state.settings);
    const loadingEffect = useSelector((state) => state.loading);

    const { isMobile } = useContext(RouteContext);

    const followLoading =
        loadingEffect.effects['columnStar/follow'] || loadingEffect.effects['columnStar/unfollow'];

    if (!detail) return <Loading />;

    const { name, avatar, author, description, use_star, star_count, article_count } = detail;

    const isAuthor = me && me.id === author.id;

    const onStar = () => {
        if (!me) return history.push('/login');
        const type = !use_star ? 'follow' : 'unfollow';
        dispatch({
            type: `columnStar/${type}`,
            payload: {
                id,
            },
        });
    };

    const renderStar = () => {
        return (
            <Button key="star" onClick={onStar} loading={followLoading} type="primary">
                {use_star ? '取消关注' : '关注专栏'}
            </Button>
        );
    };

    const renderList = () => {
        return (
            <Card>
                <List
                    id={id}
                    offset={parseInt(query.offset || 0)}
                    limit={parseInt(query.limit || 20)}
                />
            </Card>
        );
    };

    const renderSetting = () => {
        return <Setting {...detail} />;
    };

    const child = setting ? renderSetting() : renderList();
    return (
        <>
            <Helmet>
                <title>{`${name} - ${settings.title}`}</title>
                <meta name="author" content={author.name} />
                <meta name="keywords" content={`专栏,${name},itellyou`} />
                <meta name="description" content={description} />
            </Helmet>
            <div className={styles['column-layout']}>
                <div className={styles['header']}>
                    <div className={styles['header-inner']}>
                        <div className={styles['info']}>
                            <h2 className={styles['title']}>
                                <Link to={`/${paths[0]}`}>{name}</Link>
                            </h2>
                            <div className={styles['description']}>{description}</div>
                            <div className={styles['count']}>
                                <Space size="middle">
                                    <span key="article">{article_count} 篇文章</span>
                                    <span key="star">{star_count} 人关注</span>
                                </Space>
                            </div>
                            <Space size="middle">
                                {renderStar()}
                                <ReportButton key="report" type="column" />
                                <Member key="member" id={id} />
                            </Space>
                            {isAuthor && <Link to={`/${paths[0]}/setting`}>设置</Link>}
                        </div>
                        <div>
                            <Avatar size={isMobile ? 64 : 124} src={avatar} />
                        </div>
                    </div>
                </div>
                <div className={styles['body']}>{child}</div>
            </div>
        </>
    );
};

Column.getInitialProps = async ({ isServer, store, params, paths }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'column/detail',
        payload: {
            ...params,
        },
    });

    await Member.getInitialProps({ isServer, store, params });

    const setting = paths && paths.length > 1 ? paths[1] === 'setting' : null;

    if (!setting) {
        await List.getInitialProps({ isServer, store, params });
    }

    if (isServer) return getState();
};

export default Column;
