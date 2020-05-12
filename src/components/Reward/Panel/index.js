import React, { useState, useRef, useEffect } from 'react';
import { useSelector, Link } from 'umi';
import { Row, Col, Input, Button, Space } from 'antd';
import classNames from 'classnames';
import { UserAuthor } from '@/components/User';
import { limitFloat } from '@/utils/utils';
import { AlipayIcon } from '@/components/ThirdParty';
import styles from './index.less';

const defaultData = [
    [
        {
            key: 'val2',
            value: 2,
        },
        {
            key: 'val5',
            value: 5,
        },
        {
            key: 'val10',
            value: 10,
        },
    ],
    [
        {
            key: 'val20',
            value: 20,
        },
        {
            key: 'val50',
            value: 50,
        },
        {
            key: 'auto',
            value: 'auto',
        },
    ],
];

export default ({ author, onPay }) => {
    const [valKey, setValKey] = useState('val2');
    const [value, setValue] = useState(2);
    const autoRef = useRef();
    const [autoValue, setAutoValue] = useState(1);
    const [autoVisible, setAutoVisible] = useState(false);
    const [payType, setPayType] = useState('alipay');
    const me = useSelector(state => state.user.me);

    useEffect(() => {
        if (me && me.bank.cash > 0) {
            setPayType('cash');
        }
    }, [me]);

    const renderValue = ({ key, value }) => {
        if (key === 'auto') {
            return (
                <div className={styles['auto-layout']}>
                    <Input
                        ref={autoRef}
                        placeholder="自定义"
                        value={autoValue}
                        onChange={e => {
                            const curValue = limitFloat(e.target.value, 1);
                            setAutoValue(curValue);
                            setValue(curValue);
                        }}
                        onBlur={e => {
                            const curValue = parseFloat(e.target.value);
                            setAutoValue(curValue);
                            setValue(curValue);
                        }}
                    />
                    {!autoVisible && (
                        <div
                            className={styles['auto-mask']}
                            onClick={() => {
                                setAutoVisible(true);
                                autoRef.current.focus();
                                setValKey(key);
                                setValue(autoValue);
                            }}
                        >
                            自定义
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div
                onClick={() => {
                    setValKey(key);
                    setValue(value);
                    setAutoVisible(false);
                }}
            >
                {value}
            </div>
        );
    };

    const renderPanel = () => {
        return defaultData.map((row, index) => {
            return (
                <Row key={index} gutter={[24, 24]}>
                    {row.map(item => (
                        <Col key={item.key} span={24 / row.length}>
                            <div
                                className={classNames(styles['reward-item'], {
                                    [styles.active]: item.key === valKey,
                                })}
                            >
                                {renderValue(item)}
                            </div>
                        </Col>
                    ))}
                </Row>
            );
        });
    };

    const renderFooter = () => {
        if (!me)
            return (
                <p className={styles['reward-tip']}>
                    请先<Link to="/login">登录</Link>
                </p>
            );
        if (me.id === author.id) return <p className={styles['reward-tip']}>不能给自己打赏</p>;
        const {
            bank: { cash, credit },
        } = me;

        let disabled = false;
        if (payType === 'credit' && credit < value) {
            disabled = true;
        } else if (payType === 'cash' && cash < value) {
            disabled = true;
        }
        return (
            <div className={styles['reward-footer']}>
                <p className={styles['reward-tip']}>选择支付方式</p>
                <Row gutter={[24, 24]} className={styles['reward-selector']}>
                    <Col span={8}>
                        <Button
                            onClick={() => setPayType('alipay')}
                            className={classNames({ [styles.active]: payType === 'alipay' })}
                        >
                            <Space>
                                <AlipayIcon style={{ marginTop: 2 }} />
                                支付宝
                            </Space>
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Button
                            onClick={() => setPayType('credit')}
                            className={classNames({ [styles.active]: payType === 'credit' })}
                        >
                            账户积分({credit})
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Button
                            onClick={() => setPayType('cash')}
                            className={classNames({ [styles.active]: payType === 'cash' })}
                        >
                            账户余额({cash})
                        </Button>
                    </Col>
                </Row>
                <Button
                    className={styles['okBtn']}
                    type="primary"
                    onClick={() => onPay(value, payType)}
                    disabled={disabled}
                >
                    {disabled ? '余额不足' : '确认支付'}
                    <span className={styles['money']}>
                        {payType !== 'credit' ? '¥' : ''}
                        {value}
                    </span>
                </Button>
            </div>
        );
    };

    return (
        <>
            <div className={styles['reward-panel']}>
                <div className={styles['reward-title']}>
                    <UserAuthor className={styles['author']} info={author} />
                </div>
                <div className={styles['reward-body']}>{renderPanel()}</div>
                {renderFooter()}
            </div>
        </>
    );
};
