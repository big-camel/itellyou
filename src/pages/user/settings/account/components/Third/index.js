import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Button, Modal, Space, message, Card } from 'antd';
import Loading from '@/components/Loading';
import Verify from '@/components/User/Verify';
import { oauthURL } from '@/services/user/oauth';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AlipayIcon, GithubIcon } from '@/components/ThirdParty';
import styles from './index.less';

export default () => {
    const [verifyType, setVerifyType] = useState(null);
    const [unbindType, setUnbindType] = useState(null);
    const dispatch = useDispatch();

    const loaddingState = useSelector((state) => state.loading);
    const { alipay, github } = useSelector((state) => state.thirdAccount) || {};

    const onSucceed = useCallback(() => {
        if (!verifyType) return verifyType;
        const type = verifyType;
        setVerifyType(null);
        oauthURL({ type, action: 'bind' }).then(({ result, data, ...res }) => {
            if (result) {
                window.location.href = data;
                return;
            }
            message.error(res.message);
        });
    }, [oauthURL, verifyType]);

    const onUnBindSucceed = useCallback(() => {
        if (!unbindType) return;
        const type = unbindType;
        setUnbindType(null);
        let text = '';
        if (type === 'alipay') text = '支付宝';
        else if (type === 'github') text = 'Github';
        Modal.confirm({
            title: '解绑第三方帐号',
            content: `你确定要解绑${text}吗？`,
            okText: '确定',
            cancelText: '取消',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return new Promise((resolve) => {
                    dispatch({
                        type: 'thirdAccount/delete',
                        payload: {
                            type,
                        },
                    }).then(() => {
                        resolve();
                    });
                });
            },
        });
    }, [dispatch, unbindType]);

    if (loaddingState.effects['thirdAccount/find']) return <Loading />;

    const renderAlipay = () => {
        if (alipay) {
            const { name } = alipay;
            return (
                <Space>
                    <AlipayIcon />
                    <span>{name}</span>
                    <a type="link" onClick={() => setUnbindType('alipay')}>
                        (解绑)
                    </a>
                </Space>
            );
        }
        return (
            <a onClick={() => setVerifyType('alipay')}>
                <Space>
                    <AlipayIcon />
                    绑定支付宝
                </Space>
            </a>
        );
    };

    const renderGithub = () => {
        if (github) {
            const { name } = github;
            return (
                <Space>
                    <GithubIcon />
                    <span>{name}</span>
                    <a onClick={() => setUnbindType('github')}>(解绑)</a>
                </Space>
            );
        }
        return (
            <a onClick={() => setVerifyType('github')}>
                <Space>
                    <GithubIcon />
                    绑定Github
                </Space>
            </a>
        );
    };

    return (
        <div className={styles['third-warpper']}>
            <Card>
                <Card.Meta title="绑定第三方账号" />
                <Space size="large" className={styles['content']}>
                    {renderAlipay()}
                    {renderGithub()}
                </Space>
            </Card>
            {verifyType && (
                <Verify visible={true} onSucceed={onSucceed} onClose={() => setVerifyType(null)} />
            )}
            {unbindType && (
                <Verify
                    visible={true}
                    onSucceed={onUnBindSucceed}
                    onClose={() => setUnbindType(null)}
                />
            )}
        </div>
    );
};
