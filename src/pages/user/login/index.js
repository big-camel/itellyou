import React, { useState } from 'react';
import { Alert, message } from 'antd';
import { useIntl, Link, useDispatch } from 'umi';
import '@/utils/gt.js';
import Form, { Tab, Submit } from '@/components/Form';
import formMap from './formMap';
import styles from './index.less';
import { sendCaptcha } from '@/services/validation';
import { init } from '@/services/geetest';

const { UserName, Password, Mobile, Captcha } = Form.createItem(formMap);

export default () => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [tab, setTab] = useState('account');
    const [filedErrors, setFiledErrors] = useState({});
    const [mobileHelp, setMobileHelp] = useState();
    const [captcha, setCaptcha] = useState({
        time: null,
        sending: false,
    });

    const [submit, setSubmit] = useState({});

    const dispatch = useDispatch();

    const sendMobileCaptcha = e => {
        e.preventDefault();
        form.validateFields(['mobile'])
            .then(() => {
                const mobile = form.getFieldValue('mobile');
                setCaptcha({ sending: true });
                sendCaptcha({
                    action: 'login',
                    mobile,
                })
                    .then(({ result, status, data, ...res }) => {
                        setCaptcha({ sending: false });
                        if (result) {
                            setCaptcha({ ...captcha, time: data.time + 60 });
                            setMobileHelp({
                                trigger: 'blur',
                                visible: true,
                                content: value => {
                                    if (value !== data.mobile) return null;
                                    return (
                                        <span>
                                            {intl.formatMessage({
                                                id: 'validation.capthcha.sendSuccess',
                                            })}
                                            <Link to="help">
                                                {intl.formatMessage({
                                                    id: 'validation.capthcha.notGet',
                                                })}
                                            </Link>
                                        </span>
                                    );
                                },
                            });
                        } else if (status === 1002) {
                            setFiledErrors(value => {
                                return {
                                    ...value,
                                    mobile: (
                                        <span key="mobileError">
                                            手机号尚未注册，请更换手机号或去
                                            <Link to="/user/register">注册</Link>
                                        </span>
                                    ),
                                };
                            });
                        } else {
                            message.error(res.message);
                        }
                    })
                    .catch(error => {
                        if (!error) return;
                        setCaptcha({ sending: false });
                        setSubmit({
                            status: false,
                            message: error,
                        });
                    });
            })
            .catch(() => {});
    };

    const loginByAccount = () => {
        init('login')
            .then(({ validate, key }) => {
                if (!validate) return setSubmit({ ...submit, loading: false });
                const username = form.getFieldValue('username');
                const password = form.getFieldValue('password');
                dispatch({
                    type: 'login/account',
                    payload: {
                        username,
                        password,
                        geetest: {
                            key,
                            challenge: validate.geetest_challenge,
                            validate: validate.geetest_validate,
                            seccode: validate.geetest_seccode,
                        },
                    },
                }).then(({ result, status, ...res }) => {
                    setSubmit({ ...submit, loading: false });
                    if (!result) {
                        switch (status) {
                            case 1002:
                            case 1003:
                                const type = status === 1002 ? '手机号' : '邮箱';
                                setFiledErrors(value => {
                                    return {
                                        ...value,
                                        username: (
                                            <span key="mobileError">
                                                {type}尚未注册，请更换{type}或去
                                                <Link target="_blank" to="/register">
                                                    注册
                                                </Link>
                                            </span>
                                        ),
                                    };
                                });
                                break;
                            case 1004:
                                setFiledErrors(value => {
                                    return {
                                        ...value,
                                        username: res.message,
                                    };
                                });
                                break;
                            case 1005:
                                setFiledErrors(value => {
                                    return {
                                        ...value,
                                        password: res.message,
                                    };
                                });
                                break;
                            default:
                                setSubmit({ ...submit, status: false, message: res.message });
                        }
                    }
                });
            })
            .catch(error => {
                if (!error) return;
                setSubmit({
                    loading: false,
                    status: false,
                    message: error,
                });
            });
    };

    const loginByMobile = ({ mobile, code }) => {
        dispatch({
            type: 'login/mobile',
            payload: {
                mobile,
                code,
            },
        }).then(({ result, status, ...res }) => {
            setSubmit({ ...submit, loading: false });
            if (!result) {
                switch (status) {
                    case 1001:
                        setFiledErrors(value => {
                            return {
                                ...value,
                                code: res.message,
                            };
                        });
                        break;
                    case 1002:
                        setFiledErrors(value => {
                            return {
                                ...value,
                                mobile: (
                                    <span key="mobileError">
                                        手机号尚未注册，请更换手机号或去
                                        <Link to="/register">注册</Link>
                                    </span>
                                ),
                            };
                        });
                        break;
                    default:
                        setSubmit({ ...submit, status: false, message: res.message });
                }
            }
        });
    };

    const handleSubmit = values => {
        if (submit.loading) return;
        setSubmit({
            loading: true,
            status: true,
            message: null,
        });
        if (tab === 'account') {
            loginByAccount();
        } else if (tab === 'mobile') {
            loginByMobile(values);
        }
    };

    const renderErrorMessage = () => {
        const { status, message } = submit;
        if (status === false && message)
            return <Alert style={{ marginBottom: 24 }} message={message} type="error" showIcon />;
        return null;
    };

    return (
        <Form
            className={styles['login-form']}
            form={form}
            onSubmit={handleSubmit}
            defaultActiveKey={'account'}
            onChange={tab => setTab(tab)}
        >
            <Tab key="account" tab={'账号密码登录'}>
                {renderErrorMessage()}
                <UserName
                    name="username"
                    autoComplete="off"
                    errors={filedErrors['username']}
                    onBlur={e => {
                        if (e.change) setFiledErrors({ ...filedErrors, username: null });
                    }}
                />
                <Password
                    name="password"
                    autoComplete="off"
                    errors={filedErrors['password']}
                    onBlur={e => {
                        if (e.change) setFiledErrors({ ...filedErrors, password: null });
                    }}
                    onPressEnter={e => {
                        e.target.blur();
                        form.submit();
                    }}
                />
            </Tab>
            <Tab key="mobile" tab={'手机动态码登录'}>
                {renderErrorMessage()}
                <Mobile
                    name="mobile"
                    autoComplete="off"
                    maxLength={11}
                    errors={filedErrors['mobile']}
                    onBlur={e => {
                        if (e.change) setFiledErrors({ ...filedErrors, mobile: null });
                    }}
                    help={mobileHelp}
                />
                <Captcha
                    name="code"
                    autoComplete="off"
                    onSend={sendMobileCaptcha}
                    onPressEnter={e => {
                        e.target.blur();
                        form.submit();
                    }}
                    errors={filedErrors['code']}
                    onBlur={e => {
                        if (e.change) setFiledErrors({ ...filedErrors, code: null });
                    }}
                    {...captcha}
                />
            </Tab>
            <Submit loading={submit.loading}>{submit.loading ? '登陆中...' : '登陆'}</Submit>
            <div className={styles['login-footer']}>
                <Link to="/register">快速注册</Link>
            </div>
        </Form>
    );
};
