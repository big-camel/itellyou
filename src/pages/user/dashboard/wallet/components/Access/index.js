import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import Loading from '@/components/Loading';
import Pay from '@/components/Pay';
import { Card, Space, Statistic, Button } from 'antd';
import styles from './index.less';

export default () => {
    const [payVisible, setPayVisible] = useState(false);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const dispatch = useDispatch();
    const bank = useSelector(state => state.bank.detail);

    useEffect(() => {
        dispatch({
            type: 'bank/info',
        });
    }, [dispatch]);

    const onClose = status => {
        if (status === 'succeed') {
            window.location.reload();
        } else {
            setPayVisible(false);
        }
    };

    if (!bank) return <Loading />;

    const { credit, cash } = bank;
    //<Button>提现</Button>
    return (
        <div className={styles['warpper']}>
            <Card>
                <div className={styles['body']}>
                    <Space size="large">
                        <Statistic title="我的积分" value={credit} />
                        <Statistic title="我的余额(元)" value={cash} precision={2} />
                    </Space>
                    <Space size="large" className={styles['action']}>
                        <Button type="primary" onClick={() => setPayVisible(true)}>
                            充值
                        </Button>
                    </Space>
                    {payVisible && <Pay onClose={onClose} />}
                </div>
            </Card>
        </div>
    );
};
