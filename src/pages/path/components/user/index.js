import React, { useContext } from 'react';
import classNames from 'classnames';
import { Link, history, useSelector, Helmet, Redirect } from 'umi';
import { Card, Avatar, Menu, Button } from 'antd';
import Loading from '@/components/Loading';
import styles from './index.less';
import menus from './menu';
import { UserStar } from '@/components/User';
import Container, { Layout } from '@/components/Container';
import { RouteContext } from '@/context';

const User = ({ id, paths }) => {
    const menuKey = paths && paths.length > 1 ? paths[1] : 'activity';

    const menu = menus.find(item => item.key === menuKey);

    const settings = useSelector(state => state.settings) || {};

    const detail = useSelector(state => state.user.detail[id]);
    const me = useSelector(state => state.user.me);
    const { isMobile } = useContext(RouteContext);

    if (!detail) return <Loading />;

    if (!menu) return <Redirect to="/404" />;
    const { avatar, name, description, star_count, follower_count, profession, address } = detail;

    const renderInfo = () => {
        return (
            <Card bordered className={styles['info-card']}>
                <div className={styles['info-head']}>
                    <Avatar src={avatar || settings.defaultAvatar} size={96} />
                    <h2>{name}</h2>
                    <p className={styles['description']}>{description}</p>
                </div>
                <div className={styles['info-follow']}>
                    <div>
                        {me && me.id === detail.id ? (
                            <Button className={styles['btn']} href="/settings/profile">
                                编辑资料
                            </Button>
                        ) : (
                            <UserStar
                                className={styles['btn']}
                                id={id}
                                use_star={detail.use_star}
                            />
                        )}
                    </div>
                    <div className={styles['info']}>
                        <Link to={`/${paths[0]}/follows`}>
                            <p>关注了</p>
                            <p className={styles['count']}>{star_count}</p>
                        </Link>
                        <div className={styles['split']}></div>
                        <Link to={`/${paths[0]}/follower`}>
                            <p>关注者</p>
                            <p className={styles['count']}>{follower_count}</p>
                        </Link>
                    </div>
                </div>
                <div className={styles['info-detail']}>
                    <p>地址:{address || '未填写'}</p>
                    <p>行业:{profession || '未填写'}</p>
                </div>
            </Card>
        );
    };

    const renderContent = () => {
        return (
            <Card
                className={styles['content-card']}
                title={
                    <Menu mode="horizontal" selectedKeys={menuKey}>
                        {menus.map(({ key, title }) => (
                            <Menu.Item
                                key={key}
                                className={classNames({ active: key === menuKey })}
                            >
                                <Link to={`/${paths[0]}/${key}`}>{title}</Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                }
            >
                <menu.component id={id} />
            </Card>
        );
    };

    const render = () => {
        if (isMobile) {
            return (
                <Layout>
                    <div>
                        {renderInfo()}
                        {renderContent()}
                    </div>
                </Layout>
            );
        }
        return (
            <Layout spans={8}>
                {renderInfo()}
                {renderContent()}
            </Layout>
        );
    };

    return (
        <>
            <Helmet>
                <title>{`${name} - ${settings.title}`}</title>
                <meta name="keywords" content={`个人主页,${name},${menu.title},itellyou`} />
                <meta
                    name="description"
                    content={`${name}的个人主页-${menu.title}：${description}`}
                />
            </Helmet>
            <Container>{render()}</Container>
        </>
    );
};

User.getInitialProps = async ({ isServer, store, params, paths }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'user/find',
        payload: {
            ...params,
        },
    });

    const menuKey = paths && paths.length > 1 ? paths[1] : 'activity';
    const menu = menus.find(item => item.key === menuKey);
    if (menu) {
        await menu.component.getInitialProps({ isServer, store, params });
    }

    if (isServer) return getState();
};

export default User;
