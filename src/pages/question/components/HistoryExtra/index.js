import React from 'react';
import Tag from '@/components/Tag';
import styles from './index.less';

export default ({ title, tags, reward_type, reward_value }) => {
    let rewardMessage = '无悬赏';
    if (reward_type === 'credit') rewardMessage = `悬赏 ${reward_value} 积分`;
    else if (reward_type === 'cash') rewardMessage = `悬赏 ${reward_value} 元`;

    return (
        <div className={styles['version-extra']}>
            <h2>{title}</h2>
            <div className={styles['tags']}>
                {tags.map(({ id, name }) => (
                    <Tag className={styles['tag']} key={id} id={id} title={name} />
                ))}
            </div>
            <div>{rewardMessage}</div>
        </div>
    );
};
