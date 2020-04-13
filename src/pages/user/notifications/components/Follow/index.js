import React from 'react';
import Operational from '../Operational';
import timeUtils from '@/utils/time';
import { EyeOutlined } from '@ant-design/icons';
import styles from '../../index.less';
import { UserActors } from '@/components/User';
import getVerb from '@/utils/operational/getVerb';
import { Space } from 'antd';

export default ({ actors, text = '新增关注', merge_count, created_time, ...item }) => {
    const { action, type } = item;
    const verb = getVerb(action, type, '你的');

    return (
        <div className={styles['body']}>
            <div className={styles['icon']}>
                <div className={styles['bg']}>
                    <EyeOutlined />
                </div>
            </div>
            <div className={styles['info']}>
                <p className={styles['title']}>
                    {text} · <time>{timeUtils.format(created_time, { tpl: 'HH:mm' })}</time>
                </p>
                <div className={styles['content']}>
                    <Space className={styles['actors']}>
                        <UserActors actors={actors} count={merge_count} />
                        <span className={styles['verb']}>{verb}</span>
                    </Space>
                    <Operational {...item} />
                </div>
            </div>
        </div>
    );
};
