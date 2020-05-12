import React, { useState, useEffect, useCallback } from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { GiftFilled } from '@ant-design/icons';
import Panel from '../Panel';
import { PayQrCode } from '@/components/Pay';
import styles from './index.less';
import { UserAuthor } from '@/components/User';

export default ({ author, dataType, dataKey }) => {
    const [visible, setVisible] = useState(false);
    const [payVisible, setPayVisibel] = useState(false);
    const [payValue, setPayValue] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'reward/list',
            payload: {
                data_type: dataType,
                data_key: dataKey,
                append: false,
                limit: 99999,
            },
        });
    }, [dispatch, dataType, dataKey]);

    const dataSource = useSelector(state => state.reward.list);

    const me = useSelector(state => state.user.me);

    const doReward = (data_type, data_key, bank_type, amount) => {
        dispatch({
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
                    type: 'user/setMe',
                    payload: {
                        ...me,
                        bank: {
                            ...me.bank,
                            [bank_type]: me.bank[bank_type] - amount,
                        },
                    },
                });
                message.success('打赏成功');
            } else {
                message.error(res.message);
            }
        });
    };

    const onPay = (value, type) => {
        setPayValue(value);
        if (type === 'alipay') {
            setVisible(false);
            setPayVisibel(true);
        } else {
            doReward(dataType, dataKey, type, value);
        }
    };

    const onPayCallback = useCallback(
        status => {
            setPayVisibel(false);
            if (status === 'succeed') {
                dispatch({
                    type: 'user/setBank',
                    payload: {
                        ...me.bank,
                        cash: me.bank.cash + payValue,
                    },
                });
                doReward(dataType, dataKey, 'cash', payValue);
            } else {
                setVisible(true);
            }
        },
        [dispatch, me, dataType, dataKey, payValue, doReward],
    );

    const renderRewardList = () => {
        const { data } = dataSource || {};
        return (
            <div className={styles['reward-list']}>
                {(data || []).map(({ created_user }, index) => (
                    <UserAuthor key={index} size="small" model="avatar" info={created_user} />
                ))}
            </div>
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
            <Modal
                title={null}
                footer={null}
                visible={visible}
                destroyOnClose
                onCancel={() => setVisible(false)}
            >
                <Panel author={author} onPay={onPay} />
            </Modal>
            <PayQrCode visible={payVisible} amount={payValue} onClose={onPayCallback} />
        </>
    );
};
