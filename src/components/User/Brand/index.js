import React, { useEffect, useState } from 'react';
import { Popover, Avatar } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Loading from '@/components/Loading';

import styles from './index.less';
import { Link } from 'umi';

export default ({ id, placement, children }) => {
    placement = placement || 'bottomLeft';
    const dispatch = useDispatch();
    const detail = useSelector(state => state.user.detail[id]);
    const loadingState = useSelector(state => state.loading);
    const loading = loadingState.effects['user/find'];
    const settings = useSelector(state => state.settings) || {};
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible && !detail && id) {
            dispatch({
                type: 'user/find',
                payload: {
                    id,
                },
            });
        }
    }, [id, visible, detail, dispatch]);

    const renderContent = () => {
        if (!detail || loading) {
            return <Loading />;
        }
        const {
            name,
            description,
            avatar,
            star_count,
            follower_count,
            profession,
            address,
            path,
        } = detail;

        const infoComponents = [];
        if (profession && profession.trim() !== '')
            infoComponents.push(<p key="address">地址:{address}</p>);
        if (address && address.trim() !== '')
            infoComponents.push(<p key="profession">行业:{profession}</p>);

        return (
            <div className={styles['user-card']}>
                <div className={styles['body']}>
                    <Avatar shape="circle" src={avatar || settings.defaultAvatar} size={48} />
                    <div className={styles['info']}>
                        <h2>{name}</h2>
                        {description && description !== '' && (
                            <div className={styles['desc']}>{description}</div>
                        )}
                        {infoComponents.length > 0 && (
                            <div className={styles['list']}>{infoComponents}</div>
                        )}
                    </div>
                </div>
                <div className={styles['footer']}>
                    <div className={styles['follow']}>
                        <div className={styles['item']}>
                            关注了<span className={styles['count']}>{star_count}</span>
                        </div>
                        <div className={styles['item']}>
                            关注者<span className={styles['count']}>{follower_count}</span>
                        </div>
                    </div>
                    <Link to={`/${path}`}>查看个人主页</Link>
                </div>
            </div>
        );
    };

    return (
        <Popover
            target="hover"
            arrowPointAtCenter
            mouseEnterDelay={1}
            onVisibleChange={visible => setVisible(visible)}
            content={renderContent()}
            placement={placement}
        >
            {children}
        </Popover>
    );
};
