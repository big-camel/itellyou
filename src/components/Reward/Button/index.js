import React, { useState } from 'react';
import { message } from 'antd';
import { useDispatch } from 'umi';
import { GiftFilled } from '@ant-design/icons';
import Panel from '../Panel';
import styles from './index.less';
import { UserAuthor } from '@/components/User';

export default ({ author, dataType, dataKey, dataSource }) => {
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    const doReward = (data_type, data_key, bank_type, amount) => {
        return dispatch({
            type: 'reward/do',
            payload: {
                data_type,
                data_key,
                amount,
                type: bank_type,
            },
        }).then(res => {
            setVisible(false);
            if (res.result) {
                dispatch({
                    type: 'user/setBank',
                    payload: {
                        append: true,
                        [bank_type]: -amount,
                    },
                });
                message.success('打赏成功');
            } else {
                message.error(res.message);
            }
        });
    };

    const renderRewardList = () => {
        const data = (dataSource || {}).data || [];
        return (
            <>
                {data.length > 0 ? <p>{`已有 ${data.length} 人打赏`}</p> : null}
                <div className={styles['reward-list']}>
                    {data.map(({ created_user }, index) => (
                        <UserAuthor key={index} size="small" model="avatar" info={created_user} />
                    ))}
                </div>
            </>
        );
    };

    return (
        <>
            <div className={styles['reward-warpper']}>
                <div className={styles['reward-desc']}>如果您喜欢，可以打赏支持我一下~~~</div>
                <div className={styles['reward-btn']} onClick={() => setVisible(true)}>
                    <GiftFilled />
                </div>
                {renderRewardList()}
            </div>
            <Panel
                visible={visible}
                onVisibleChange={setVisible}
                author={author}
                doPay={(type, value) => doReward(dataType, dataKey, type, value)}
            />
        </>
    );
};
