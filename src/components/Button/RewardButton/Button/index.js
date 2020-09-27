import React, { useState } from 'react';
import { message, Button, Space, Modal } from 'antd';
import { useDispatch } from 'umi';
import { PayCircleFilled, EllipsisOutlined } from '@ant-design/icons';
import { UserAuthor } from '@/components/User';
import List from '@/components/List';
import Timer from '@/components/Timer';
import Panel from '../Panel';
import BaseButton from '../../BaseButton';
import styles from './index.less';

export default ({ author, dataType, dataKey, dataSource, text, children, ...props }) => {
    text = text || children || '打赏支持';
    const [visible, setVisible] = useState(false);
    const [moreVisible, setMoreVisible] = useState(false);
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
        }).then((res) => {
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
        const users = data.length > 8 ? data.slice(0, 8) : data;
        return (
            <>
                <Space size="small" className={styles['reward-list']}>
                    {users.map(({ created_user }, index) => (
                        <UserAuthor key={index} size="small" model="avatar" info={created_user} />
                    ))}
                    {data.length > 8 && (
                        <Button
                            shape="circle"
                            size="small"
                            icon={<EllipsisOutlined />}
                            onClick={() => setMoreVisible(true)}
                        />
                    )}
                    <div>{`共 ${data.length} 人打赏`}</div>
                </Space>
            </>
        );
    };

    const renderItem = ({ created_user, amount, bank_type, created_time }) => {
        let typeText = '积分';
        if (bank_type === 'cash') typeText = '现金';
        return (
            <List.Item>
                <UserAuthor info={created_user} />
                <Space>
                    <div>
                        打赏了 {bank_type === 'cash' ? '¥' : ''}
                        {amount} {typeText}
                    </div>
                    <Timer time={created_time} />
                </Space>
            </List.Item>
        );
    };

    const renderButton = () => {
        const button = (btnProps) => (
            <BaseButton icon={<PayCircleFilled />} onClick={() => setVisible(true)} {...btnProps}>
                {text}
            </BaseButton>
        );
        if (props.hasOwnProperty('simple')) {
            const { simple, ...btnProps } = props;
            return button(btnProps);
        }

        return (
            <Space className={styles['reward-warpper']} direction="vertical" size="middle">
                <div className={styles['reward-desc']}>如果对您有帮助，可以打赏支持我一下~</div>
                <div className={styles['reward-btn']}>
                    {button({
                        ...props,
                        type: 'primary',
                        shape: 'round',
                    })}
                </div>
                {renderRewardList()}
            </Space>
        );
    };

    return (
        <>
            {renderButton()}
            <Panel
                visible={visible}
                onVisibleChange={setVisible}
                author={author}
                doPay={(type, value) => doReward(dataType, dataKey, type, value)}
            />
            <Modal
                title="打赏列表"
                footer={null}
                visible={moreVisible}
                destroyOnClose
                onCancel={() => setMoreVisible(false)}
            >
                <List
                    dataSource={(dataSource || {}).data || []}
                    renderItem={renderItem}
                    split={false}
                />
            </Modal>
        </>
    );
};
