import React, { useState } from 'react';
import { Button } from 'antd';
import { RewardPanel } from '@/components/Reward';
import styles from './index.less';

export default ({ data, author, doPay }) => {
    const { star_to_read, paid_to_read, paid_type, paid_amount } = data || {};

    const [visible, setVisible] = useState(false);

    if (!star_to_read && !paid_to_read) return null;

    const renderText = () => {
        let text = '';
        if (star_to_read) {
            text = '关注作者';
        }
        if (paid_to_read) {
            if (text !== '') text += ' 或 ';
            text += '支付 ' + paid_amount + ` ${paid_type === 'credit' ? ' 积分' : ' 元'}`;
        }
        text += '，阅读完整内容';
        return text;
    };

    const onPurchaseClick = () => {
        if (!paid_to_read) return;
        setVisible(true);
    };

    return (
        <div className={styles['purchase-layout']}>
            <div className={styles['purchase-mask']}></div>
            <Button type="link" className={styles['purchase-btn']} onClick={onPurchaseClick}>
                {renderText()}
            </Button>
            <RewardPanel
                visible={visible}
                onVisibleChange={setVisible}
                author={author}
                amount={paid_amount}
                type={paid_type}
                doPay={doPay}
            />
        </div>
    );
};
