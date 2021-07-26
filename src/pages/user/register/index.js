import React, { useState } from 'react';
import { Alert, message, Space } from 'antd';
import { history, useIntl, Link, useSelector, useDispatch } from 'umi';
import Script from 'react-load-script';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';
import { sendCaptcha } from '@/services/validation';
import styles from './index.less';
import { AlipayLogin, GithubLogin } from '@/components/ThirdParty';

const { Name, Password, Mobile, Captcha } = Form.createItem(formMap);

const Register = () => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [filedErrors, setFiledErrors] = useState({});
    const [mobileHelp, setMobileHelp] = useState();
    const [captcha, setCaptcha] = useState({
        time: null,
        sending: false,
    });

    const [submit, setSubmit] = useState({});

    const loadingState = useSelector((state) => state.loading);
    const submiting = loadingState.effects['register/submit'];

    const settings = useSelector((state) => state.settings);

    const dispatch = useDispatch();

    const renderMobileError = () => (
        <span key="mobileError">
            {intl.formatMessage({ id: 'register.mobile.takeUp' })}
            <Link to="/login">{intl.formatMessage({ id: 'login.page' })}</Link>
        </span>
    );

    const sendMobileCaptcha = (e) => {
        e.preventDefault();
        form.validateFields(['mobile']).then((values) => {
            setCaptcha({ sending: true });
            sendCaptcha({
                action: 'register',
                mobile: values['mobile'],
            })
                .then(({ result, status, data, ...res }) => {
                    setCaptcha({ sending: false });
                    if (result) {
                        setCaptcha({ ...captcha, time: data.time + 60 });
                        setMobileHelp({
                            trigger: 'blur',
                            visible: true,
                            content: (value) => {
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
                        setFiledErrors({
                            mobile: renderMobileError(),
                        });
                    } else {
                        message.error(res.message);
                    }
                })
                .catch((error) => {
                    setCaptcha({ sending: false });
                    if (!error) return;

                    setSubmit({
                        status: false,
                        message: error,
                    });
                });
        });
    };

    const handleSubmit = (values) => {
        setSubmit({
            status: true,
            message: null,
        });
        setFiledErrors(() => {
            return {};
        });
        dispatch({
            type: 'register/submit',
            payload: {
                name: values['name'],
                loginPassword: values['password'],
                mobile: values['mobile'],
                code: values['code'],
            },
        }).then((res) => {
            if (res.result === true) {
                history.push('/login');
            } else if (res.result === false) {
                switch (res.status) {
                    case 1001:
                        setFiledErrors((value) => {
                            return {
                                ...value,
                                code: res.message,
                            };
                        });
                        break;
                    case 1002:
                        setFiledErrors((value) => {
                            return {
                                ...value,
                                mobile: renderMobileError(),
                            };
                        });
                        break;
                    case 1003:
                        setFiledErrors((value) => {
                            return {
                                ...value,
                                name: res.message,
                            };
                        });
                        break;
                    default:
                        setSubmit({
                            status: false,
                            message: res.message,
                        });
                }
            }
        });
    };

    const renderErrorMessage = () => {
        const { status, message } = submit;
        if (status === false)
            return <Alert style={{ marginBottom: 24 }} message={message} type="error" showIcon />;
        return null;
    };

    const { site } = settings || {};

    return (
        <>
            <Script url="https://cdn-object.yanmao.cc/geetest/gt.js" />
            <div className={styles.title}>注册</div>
            <Form onSubmit={handleSubmit} className={styles['form']} form={form}>
                {renderErrorMessage()}
                <Name
                    name="name"
                    errors={filedErrors['name']}
                    onBlur={(e) => {
                        if (e.change)
                            setFiledErrors((value) => {
                                return {
                                    ...value,
                                    name: null,
                                };
                            });
                    }}
                    autoComplete="off"
                    asyncValidator={(_, value) => {
                        return new Promise((resolve, reject) => {
                            dispatch({
                                type: 'user/queryName',
                                payload: {
                                    name: value,
                                },
                            }).then((res) => {
                                if (res.result) return resolve();
                                reject(res.message);
                            });
                        });
                    }}
                />
                <Password name="password" autoComplete="off" />
                <Mobile
                    name="mobile"
                    autoComplete="off"
                    maxLength={11}
                    errors={filedErrors['mobile']}
                    onBlur={(e) => {
                        if (e.change)
                            setFiledErrors((value) => {
                                return {
                                    ...value,
                                    mobile: null,
                                };
                            });
                    }}
                    help={mobileHelp}
                />
                <Captcha
                    name="code"
                    autoComplete="off"
                    onSend={sendMobileCaptcha}
                    onPressEnter={form.submit}
                    errors={filedErrors['code']}
                    onBlur={(e) => {
                        if (e.change)
                            setFiledErrors((value) => {
                                return {
                                    ...value,
                                    code: null,
                                };
                            });
                    }}
                    {...captcha}
                />
                <Submit loading={submiting}>
                    {submiting
                        ? intl.formatMessage({ id: 'register.submit.loadingText' })
                        : intl.formatMessage({ id: 'register.submit.text' })}
                </Submit>
                <p className={styles['protocol']}>
                    注册即表明同意
                    <a
                        target="_blank"
                        href={
                            (site || { user_agreement_link: 'https://www.yanmao.cc' })
                                .user_agreement_link
                        }
                    >
                        《ITELLYOU用户协议》
                    </a>
                </p>
                <Space className={styles['third-login']} size="large">
                    <AlipayLogin />
                    <GithubLogin />
                </Space>
                <Space className={styles['register-footer']}>
                    <Link to="/login">直接登陆</Link>
                </Space>
            </Form>
        </>
    );
};

Register.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default Register;
