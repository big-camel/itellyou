import React from 'react';
import Tag from '@/components/Tag';
import styles from './index.less';

export default ({ title, tags }) => {
    let rewardMessage = '';
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
