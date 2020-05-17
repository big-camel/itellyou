import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, Link } from 'umi';
import { Row, Col, Input, Button, Space, Modal } from 'antd';
import classNames from 'classnames';
import { PayQrCode } from '@/components/Pay';
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

export default ({ visible, onVisibleChange, author, amount, type, doPay }) => {
    const [payVisible, setPayVisibel] = useState(false);
    const [valKey, setValKey] = useState('val2');
    const [value, setValue] = useState(amount || 2);
    const autoRef = useRef();
    const [autoValue, setAutoValue] = useState(1);
    const [autoVisible, setAutoVisible] = useState(false);
    const [payType, setPayType] = useState('alipay');
    const [paying, setPaying] = useState(false);
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
        if (amount) {
            return (
                <div className={styles['pay-amount']}>
                    支付<span className={styles['amount']}>{amount}</span>
                    {type === 'credit' ? '积分' : '元'}
                </div>
            );
        }
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
        if (me.id === author.id) return <p className={styles['reward-tip']}>不能给自己支付</p>;
        const {
            bank: { cash, credit },
        } = me;

        let disabled = false;
        if (payType === 'credit' && credit < value) {
            disabled = true;
        } else if (payType === 'cash' && cash < value) {
            disabled = true;
        }

        const pays = [
            {
                key: 'alipay',
                title: (
                    <Space>
                        <AlipayIcon style={{ marginTop: 2 }} />
                        支付宝
                    </Space>
                ),
            },
            {
                key: 'cash',
                title: `账户余额(${cash})`,
            },
        ];

        const creditPay = {
            key: 'credit',
            title: `账户积分(${credit})`,
        };

        if (type === 'credit') {
            pays = [creditPay];
        } else if (!type) {
            pays.push(creditPay);
        }

        return (
            <div className={styles['reward-footer']}>
                <p className={styles['reward-tip']}>选择支付方式</p>
                <Row gutter={[24, 24]} className={styles['reward-selector']}>
                    {pays.map(({ key, title }) => (
                        <Col key={key} span={24 / pays.length}>
                            <Button
                                onClick={() => setPayType(key)}
                                className={classNames({ [styles.active]: payType === key })}
                            >
                                {title}
                            </Button>
                        </Col>
                    ))}
                </Row>
                <Button
                    className={styles['okBtn']}
                    type="primary"
                    onClick={() => onPay(payType, value)}
                    disabled={disabled}
                    loading={paying}
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

    const onPay = (type, value) => {
        if (type === 'alipay') {
            onVisibleChange(false);
            setPayVisibel(true);
        } else {
            setPaying(true);
            const result = doPay(type, value);
            if (typeof result === 'object') {
                result.then(() => setPaying(false));
            } else {
                setPaying(false);
            }
        }
    };

    const onPayCallback = useCallback(
        status => {
            setPayVisibel(false);
            if (status === 'succeed') {
                doPay('cash', value);
            } else {
                onVisibleChange(true);
            }
        },
        [me, value, doPay],
    );

    return (
        <>
            <Modal
                title={null}
                footer={null}
                visible={visible}
                destroyOnClose
                onCancel={() => onVisibleChange(false)}
            >
                <div className={styles['reward-panel']}>
                    <div className={styles['reward-title']}>
                        <UserAuthor className={styles['author']} info={author} />
                    </div>
                    <div className={styles['reward-body']}>{renderPanel()}</div>
                    {renderFooter()}
                </div>
            </Modal>
            <PayQrCode visible={payVisible} amount={value} onClose={onPayCallback} />
        </>
    );
};
