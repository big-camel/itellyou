import React, { useState } from 'react';
import { Alert, message } from 'antd';
import { useDispatch, useIntl, Link } from 'umi';
import Script from 'react-load-script';
import Form, { Submit } from '@/components/Form';
import styles from './index.less';
import { sendCaptcha } from '@/services/validation';
import formMap from './formMap';

const { Mobile, Captcha } = Form.createItem(formMap);

const Oauth = ({ location }) => {
    const queryParams = location ? location.query || {} : {};

    const intl = useIntl();
    const [form] = Form.useForm();
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
        form.validateFields(['mobile']).then(values => {
            setCaptcha({ sending: true });
            sendCaptcha({
                action: 'login/oauth',
                mobile: values['mobile'],
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
                        setFiledErrors({
                            mobile: renderMobileError(),
                        });
                    } else {
                        message.error(res.message);
                    }
                })
                .catch(error => {
                    setCaptcha({ sending: false });
                    if (!error) return;
                    setSubmit({
                        status: false,
                        message: error.message,
                    });
                });
        });
    };

    const handleSubmit = values => {
        if (submit.loading) return;
        setSubmit({
            loading: true,
            status: true,
            message: null,
        });
        login(values);
    };

    const login = ({ mobile, code }) => {
        dispatch({
            type: 'login/oauth',
            payload: {
                type: queryParams.type,
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
                    default:
                        setSubmit({ ...submit, status: false, message: res.message });
                }
            }
        });
    };

    const renderErrorMessage = () => {
        const { status, message } = submit;
        if (status === false && message)
            return <Alert style={{ marginBottom: 24 }} message={message} type="error" showIcon />;
        return null;
    };

    return (
        <>
            <Script url="https://cdn-object.itellyou.com/geetest/gt.js" />
            <div className={styles.title}>
                验证成功
                <div className={styles['sub']}>绑定手机号立即登录</div>
            </div>
            <Form className={styles['login-form']} form={form} onSubmit={handleSubmit}>
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
                <Submit loading={submit.loading}>{submit.loading ? '登陆中...' : '登陆'}</Submit>
                <p className={styles['protocol']}>
                    登陆即表明同意<Link to="">《ITELLYOU用户协议》</Link>
                </p>
            </Form>
        </>
    );
};

Oauth.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default Oauth;
