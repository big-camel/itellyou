import React from 'react';
import styles from './index.less';
import { useSelector, Link } from 'umi';
import UserMenu from './UserMenu';
import ActionMenu from './ActionMenu';
import Notifications from './Notifications';
import { Button, Space } from 'antd';

const User = ({ isMobile }) => {
    const me = useSelector((state) => state.user.me);

    const renderUnLogin = () => {
        if (isMobile) {
            return (
                <Space className={styles['m-right-action']}>
                    <Link to="/login">登录</Link>
                    <Link to="/register">注册</Link>
                </Space>
            );
        }
        return (
            <Space>
                <Button type="ghost" href="/login">
                    立即登录
                </Button>
                <Button type="primary" href="/register">
                    免费注册
                </Button>
            </Space>
        );
    };
    return (
        <div className={styles['user']}>
            {me ? (
                <Space size="large">
                    <ActionMenu />
                    <Notifications />
                    <UserMenu isMobile={isMobile} />
                </Space>
            ) : (
                renderUnLogin()
            )}
        </div>
    );
};

User.Menu = UserMenu;

export default User;
