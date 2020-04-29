import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Modal, InputNumber, Space, message } from 'antd';
import Loading from '@/components/Loading';
import Verify from '@/components/User/Verify';
import styles from './index.less';

export default ({ onClose }) => {
    onClose = onClose || function() {};
    const dispatch = useDispatch();
    const bank = useSelector(state => state.bank.detail);
    const config = useSelector(state => state.withdraw.config);
    const loadingState = useSelector(state => state.loading);
    const submiting = loadingState.effects['withdraw/post'];
    const [value, setValue] = useState(0);
    const [error, setError] = useState();

    useEffect(() => {
        if (config) {
            const { min } = config;
            if (value < min) {
                setValue(min);
            }
        }
    }, [config]);

    useEffect(() => {
        dispatch({
            type: 'withdraw/config',
        });
    }, [dispatch]);

    useEffect(() => {
        if (!bank) {
            dispatch({
                type: 'bank/info',
            });
        }
    }, [dispatch, bank]);

    const onChagne = value => {
        if (value > bank.cash) {
            setError('提现金额超过账户余额');
        } else {
            setError(null);
        }
        setValue(value);
    };

    const onSubmit = () => {
        if (submiting) return;
        dispatch({
            type: 'withdraw/post',
            payload: {
                amount: value,
            },
        }).then(res => {
            if (res && res.result) {
                message.success('提现成功');
                onClose('succeed');
            } else {
                message.error(res.message);
            }
        });
    };

    const render = () => {
        if (!config || !bank) return <Loading />;
        const { min, max, rate } = config;
        const balance = bank.cash;
        const formatter = '￥ ';
        const getFee = () => {
            if (rate <= 0) return 0.0;
            return ((value ? value : min) * rate) / 100;
        };
        return (
            <div>
                <Space>
                    单笔提现限额<strong>{min}</strong>～<strong>{max}</strong>元，服务费率
                    <strong>{rate}</strong>%
                </Space>
                <div className={styles['withdraw-content']}>
                    <h3 className={styles['title']}>提现金额</h3>
                    <InputNumber
                        size="large"
                        className={styles['amount']}
                        min={min}
                        max={balance > max ? max : balance}
                        precision={2}
                        value={value}
                        onChange={onChagne}
                        formatter={value =>
                            `${formatter}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={value => value.replace(new RegExp(`${formatter}\s?|(,*)`, 'g'), '')}
                    />
                </div>
                {error && <p className={styles['error']}>{error}</p>}
                {!error && (
                    <Space>
                        账户余额<strong>{balance}</strong>元，服务费
                        <strong>{getFee().toFixed(2)}</strong>元
                    </Space>
                )}
            </div>
        );
    };

    return (
        <Verify onClose={onClose}>
            <Modal
                title="账户提现"
                visible={true}
                width={500}
                onCancel={onClose}
                okText="提交"
                cancelText="取消"
                onOk={onSubmit}
                okButtonProps={{
                    loading: submiting,
                }}
            >
                {render()}
            </Modal>
        </Verify>
    );
};
