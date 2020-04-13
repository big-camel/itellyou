import React from 'react';
import { Alert } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import styles from './index.less';

export default () => {
    return (
        <Alert
            className={styles['alert']}
            showIcon={false}
            type="warning"
            message={
                <div className={styles['message']}>
                    <p className={styles['title']}>
                        <QuestionCircleTwoTone /> 让你的提问获得更多解答
                    </p>
                    <p className={styles['item']}>· 问题是什么，你想得到什么帮助，以“？”结束</p>
                    <p className={styles['item']}>· 保持文字简练，表述清晰问题的关键点</p>
                    <p className={styles['item']}>· 添加合适的标签，让问题更好地流通</p>
                </div>
            }
            banner
            closable
        />
    );
};
