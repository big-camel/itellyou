import React, { useState } from 'react';
import { Popover, Avatar, Menu, Space } from 'antd';
import { Link, useDispatch, useSelector } from 'umi';
import {
    UserOutlined,
    SettingOutlined,
    LoginOutlined,
    PropertySafetyOutlined,
    ProfileOutlined,
    SnippetsOutlined,
} from '@ant-design/icons';
import Burger from '../Burger';
import styles from './index.less';

export default ({ isMobile }) => {
    const [visible, setVisible] = useState(false);
    const me = useSelector(state => state.user.me);

    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch({
            type: 'user/logout',
        });
    };

    if (!me) return;

    const { avatar, name, path, rank, bank } = me;

    const avatarLink = (
        <Link to="/dashboard">
            <Avatar src={avatar} size={24} />
        </Link>
    );

    const menu = (
        <div className={isMobile ? styles['m-user-menu'] : styles['user-menu']}>
            <div className={styles['info']}>
                <Space>
                    {isMobile && avatarLink}
                    <span className={styles['name']}>{name}</span>
                    <span className={styles['rank']}>{(rank || {}).name}</span>
                </Space>
            </div>
            <Menu onClick={() => setVisible(false)}>
                <Menu.Divider />
                {isMobile && (
                    <Menu.Item key="dashboard">
                        <Link to="/dashboard">
                            <SnippetsOutlined />
                            最近编辑
                        </Link>
                    </Menu.Item>
                )}
                <Menu.Item key="userCenter">
                    <Link to={`/${path}`}>
                        <UserOutlined />
                        个人主页
                    </Link>
                </Menu.Item>
                <Menu.Item key="userSetting">
                    <Link to="/settings/profile">
                        <ProfileOutlined />
                        我的资料
                    </Link>
                </Menu.Item>
                {isMobile && (
                    <Menu.Item key="accountSetting">
                        <Link to="/settings/account">
                            <SettingOutlined />
                            账户管理
                        </Link>
                    </Menu.Item>
                )}
                <Menu.Item key="userWallet">
                    <Link to="/dashboard/wallet">
                        <PropertySafetyOutlined />
                        我的钱包
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" onClick={onLogout}>
                    <LoginOutlined />
                    退出
                </Menu.Item>
            </Menu>
        </div>
    );
    if (isMobile) {
        return (
            <Burger
                visible={visible}
                onChange={setVisible}
                className={styles['nav-burger']}
                menu={menu}
            >
                <Avatar src={avatar} size={20} />
            </Burger>
        );
    }
    return (
        <Popover
            overlayClassName={'popover-menu'}
            content={menu}
            arrowPointAtCenter
            placement="bottomRight"
        >
            {avatarLink}
        </Popover>
    );
};
