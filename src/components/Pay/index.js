import React, { useState } from 'react';
import classNames from 'classnames';
import { Modal, Space, Button } from 'antd';
import { AlipayCircleFilled } from '@ant-design/icons';
import QrCode from './QrCode';

import styles from './index.less';

const defaultValues = [
    {
        title: '2 元',
        value: 2,
    },
    {
        title: '5 元',
        value: 5,
    },
    {
        title: '10 元',
        value: 10,
    },
    {
        title: '50 元',
        value: 50,
    },
    {
        title: '100 元',
        value: 100,
    },
    {
        title: '200 元',
        value: 200,
    },
];

export default ({ values = defaultValues, defaultValue, onClose }) => {
    values = values || [];
    const [selectedValue, setSelectedValue] = useState(defaultValue || 2);
    const [setp, setSetp] = useState('init');

    const render = () => {
        if (setp === 'pay') return <QrCode amount={selectedValue} onClose={onClose} />;
        return (
            <Modal
                wrapClassName={styles['warpper']}
                title="账户充值"
                visible={true}
                footer={null}
                width={500}
                onCancel={onClose}
            >
                <div className={styles['desc']}>充值后可用于付费内容，可提现</div>
                <h3>充值金额</h3>
                <div className={styles['value-list']}>
                    {values.map(({ title, value }, index) => (
                        <div
                            key={index}
                            className={classNames(styles['value-item'], {
                                [styles['active']]: value === selectedValue,
                            })}
                            onClick={() => setSelectedValue(value)}
                        >
                            <div className={styles['value-title']}>{title}</div>
                        </div>
                    ))}
                </div>
                <h3>支付方式</h3>
                <div className={styles['pay-with']}>
                    <Space>
                        <AlipayCircleFilled />
                        <span>支付宝</span>
                    </Space>
                </div>
                <div className={styles['dashline']} />
                <h3>总计</h3>
                <div className={styles['pay-total']}>{`${selectedValue} 元`}</div>
                <div className={styles['action-btns']}>
                    <Button type="primary" onClick={() => setSetp('pay')}>
                        立即支付
                    </Button>
                </div>
            </Modal>
        );
    };

    return render();
};
