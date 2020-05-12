import React from 'react';
import classNames from 'classnames';
import Operational from '../Operational';
import timeUtils from '@/utils/time';
import { BulbOutlined } from '@ant-design/icons';
import styles from '../../index.less';
import { UserActors } from '@/components/User';
import getVerb from '@/utils/operational/getVerb';
import { Space } from 'antd';

export default ({ actors, merge_count, created_time, ...item }) => {
    const { action, type } = item;
    const verb = getVerb(action, type, '你的');

    return (
        <div className={classNames(styles['body'], styles['adopt-body'])}>
            <div className={styles['icon']}>
                <div className={styles['bg']}>
                    <BulbOutlined />
                </div>
            </div>
            <div className={styles['info']}>
                <Space className={styles['title']}>
                    <UserActors actors={actors} count={merge_count} />
                    <span className={styles['verb']}>{verb}</span>·
                    <time>{timeUtils.format(created_time, { tpl: 'HH:mm' })}</time>
                </Space>
                <div className={styles['content']}>
                    <Operational {...item} />
                </div>
            </div>
        </div>
    );
};
