import React, { useState, useEffect, useRef } from 'react';
import { Badge, Popover, Tabs } from 'antd';
import { Link, useSelector, useDispatch } from 'umi';
import Cookies from 'js-cookie';
import ReconnectingWebSocket from 'reconnecting-websocket';
import NotificationsList from './List';
import styles from './index.less';
import {
    BellFilled,
    BarsOutlined,
    HeartFilled,
    UserSwitchOutlined,
    SettingFilled,
} from '@ant-design/icons';
import Follower from './Follower';

const { TabPane } = Tabs;

export default ({ overflowCount }) => {
    overflowCount = overflowCount || 99;

    const { groupCount } = useSelector((state) => state.notifications);
    const { ws } = useSelector((state) => state.settings) || {};
    const [visible, setVisible] = useState(false);
    const [force, setForce] = useState(false);
    const [activeKey, setActiveKey] = useState('default');
    const dispatch = useDispatch();
    const socket = useRef();
    const heartbeat = useRef();

    useEffect(() => {
        const connection = () => {
            if (!ws) return;
            const token = Cookies.get('token');
            if (!token) return;
            const webSocket = new ReconnectingWebSocket(
                ws + '?token=' + encodeURIComponent(token),
                [],
                {
                    maxReconnectionDelay: 30000,
                    minReconnectionDelay: 10000,
                    reconnectionDelayGrowFactor: 10000,
                    maxRetries: 60,
                },
            );
            webSocket.onopen = () => {
                const message = {
                    action: 'ready',
                };
                webSocket.send(JSON.stringify(message));
            };
            webSocket.onerror = (event) => {
                //console.log('websocket error:', event);
            };
            webSocket.onmessage = (event) => {
                const {
                    notifications: { count, group },
                } = JSON.parse(event.data);
                if (count > 0) {
                    setForce(!force);
                }
                dispatch({
                    type: 'notifications/setGroupCount',
                    payload: {
                        count,
                        group,
                    },
                });
            };
            socket.current = webSocket;
        };
        if (!socket.current) {
            connection();
            heartbeat.current = setInterval(() => {
                socket.current.send(
                    JSON.stringify({
                        action: 'heartbeat',
                    }),
                );
            }, 30000);
        }

        return () => {
            if (socket.current) {
                if (heartbeat.current) clearInterval(heartbeat.current);
                socket.current.close();
            }
        };
    }, [dispatch, force]);

    useEffect(() => {
        if (visible === true && groupCount.count > 0) {
            dispatch({
                type: 'notifications/readed',
            });
        }
    }, [visible, groupCount, dispatch]);

    const content = (
        <div className={styles['notifications']}>
            <Tabs
                className={styles['tabs']}
                activeKey={activeKey}
                onChange={(activeKey) => setActiveKey(activeKey)}
            >
                <TabPane key="default" tab={<BarsOutlined />}>
                    <NotificationsList action="default" force={force} />
                </TabPane>
                <TabPane key="follow" tab={<UserSwitchOutlined />}>
                    <Follower force={force} />
                </TabPane>
                <TabPane key="like" tab={<HeartFilled />}>
                    <NotificationsList action="like" force={force} />
                </TabPane>
            </Tabs>
            <div className={styles['footer']}>
                <Link onClick={() => setVisible(false)} to="/settings/notifications">
                    {<SettingFilled />} 设置
                </Link>
                <Link onClick={() => setVisible(false)} to="/notifications">
                    查看全部通知
                </Link>
            </div>
        </div>
    );

    return (
        <Popover
            overlayClassName={styles['popover']}
            trigger="click"
            content={content}
            visible={visible}
            destroyTooltipOnHide={true}
            arrowPointAtCenter
            placement="bottomRight"
            onVisibleChange={(visible) => setVisible(visible)}
        >
            <Badge
                count={groupCount.count}
                overflowCount={overflowCount}
                className={styles['badge']}
            >
                <BellFilled />
            </Badge>
        </Popover>
    );
};
