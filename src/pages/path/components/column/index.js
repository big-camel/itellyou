import React, { useEffect } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { Card, Button, Avatar, Space } from 'antd';
import Loading from '@/components/Loading';
import Setting from './components/setting';
import List from './components/list';
import Member from './components/member';
import styles from './index.less';
import { ReportButton } from '@/components/Button';
import DocumentTitle from 'react-document-title';
import { Helmet } from 'react-helmet';

export default ({ id, paths, location: { query } }) => {
    const setting = paths && paths.length > 1 ? paths[1] : null;

    const dispatch = useDispatch();
    const detail = useSelector(state => state.column.detail);
    const me = useSelector(state => state.user.me);
    const settings = useSelector(state => state.settings);
    const loadingEffect = useSelector(state => state.loading);

    const followLoading =
        loadingEffect.effects['columnStar/follow'] || loadingEffect.effects['columnStar/unfollow'];

    useEffect(() => {
        dispatch({
            type: 'column/detail',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    if (!detail) return <Loading />;

    const { name, avatar, author, description, use_star, star_count, article_count } = detail;

    const isAuthor = me && me.id === author.id;

    const onStar = () => {
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
        <DocumentTitle title={`${name} - ${settings.title}`}>
            <div className={styles['column-layout']}>
                <Helmet>
                    <meta name="author" content={author.name} />
                    <meta name="keywords" content={`专栏,${name},itellyou`} />
                    <meta name="description" content={description} />
                </Helmet>
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
                            <Avatar size={124} src={avatar} />
                        </div>
                    </div>
                </div>
                <div className={styles['body']}>{child}</div>
            </div>
        </DocumentTitle>
    );
};
