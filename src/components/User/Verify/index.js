import React, { useState, useEffect } from 'react';
import { Modal, Select, message, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Script from 'react-load-script';
import Loading from '@/components/Loading';
import Form from '@/components/Form';
import formMap from './formMap';
import { sendCaptcha } from '@/services/validation';
import { mobile, email } from '@/services/user/verify';

const { Captcha } = Form.createItem(formMap);
const VERIFY_SESSION_KEY = 'itellyou_verify_key';

function Verify({ defaultValue, onClose, onSucceed, children, ...props }) {
    defaultValue = defaultValue || 'mobile';

    const [type, setType] = useState(defaultValue);
    const initVisible = props.visible === undefined ? true : props.visible;
    const [visible, setVisible] = useState(initVisible);

    const [captcha, setCaptcha] = useState({
        time: null,
        sending: false,
    });
    const [codeHelp, setCodeHelp] = useState();
    const [codeErrors, setCodeErrors] = useState();

    const expired = sessionStorage.getItem(VERIFY_SESSION_KEY);

    const now = new Date().getTime();
    const [verifySucceed, setVerifySucceed] = useState(expired && expired > now / 1000);

    const [form] = Form.useForm(props.form);

    const dispatch = useDispatch();
    const me = useSelector((state) => state.user.me) || {};
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const succeed = expired && expired > new Date().getTime() / 1000;
        setVerifySucceed(succeed);
        if (succeed && onSucceed) {
            onSucceed();
        }
    }, [expired, onSucceed]);

    useEffect(() => {
        setVisible(initVisible);
    }, [initVisible]);

    useEffect(() => {
        if (!me || (!me.mobile && !me.email)) {
            dispatch({
                type: 'user/fetchAccount',
            });
        }
    }, [dispatch, me]);

    const dataSource = [];
    if (me.mobile) {
        dataSource.push({
            key: 'mobile',
            title: `使用手机 ${me.mobile} 验证`,
        });
    }
    if (me.email) {
        dataSource.push({
            key: 'email',
            title: `使用邮箱 ${me.email} 验证`,
        });
    }

    const onTypeChange = (value) => {
        setType(value);
    };

    let typeText = '';
    switch (type) {
        case 'mobile':
            typeText = '手机';
            break;
        case 'email':
            typeText = '邮箱';
            break;
    }

    const sendMobileCaptcha = (e) => {
        e.preventDefault();
        setCaptcha({ sending: true });
        sendCaptcha({
            action: `verify/${type}`,
        })
            .then(({ result, status, data, ...res }) => {
                setCaptcha({ sending: false });
                if (result) {
                    setCaptcha({ ...captcha, time: data.time + 60 });
                    setCodeHelp({
                        visible: true,
                        content: () => {
                            return `验证码已发送至绑定${typeText}`;
                        },
                    });
                } else {
                    message.error(res.message);
                }
            })
            .catch((error) => {
                setCaptcha({ sending: false });
                if (!error) return;
            });
    };

    const onVerify = () => {
        setLoading(true);
        form.validateFields(['code'])
            .then((values) => {
                const verify = type === 'mobile' ? mobile : email;
                verify(values).then(({ result, status, data, ...res }) => {
                    setLoading(false);
                    if (result) {
                        sessionStorage.setItem(VERIFY_SESSION_KEY, data);
                        form.resetFields();
                        setVerifySucceed(true);
                    } else if (status === 1001) {
                        setCodeErrors(res.message);
                    } else {
                        message.error(res.message);
                    }
                });
            })
            .catch(() => {
                setLoading(false);
            });
    };

    if (verifySucceed) return children || null;

    const { Option } = Select;

    const render = () => {
        if (!me || (!me.mobile && !me.email)) return <Loading />;
        if (dataSource.length === 0) return <p>暂无可验证选项</p>;
        return (
            <Form form={form}>
                <Form.Item>
                    <p style={{ margin: 0 }}>
                        为了你的帐户安全，请验证身份。验证成功后进行下一步操作。
                    </p>
                </Form.Item>
                <Row>
                    <Col span={16}>
                        <Form.Item>
                            <Select
                                defaultValue={defaultValue}
                                value={type}
                                onChange={onTypeChange}
                                size="large"
                            >
                                {dataSource.map((item) => (
                                    <Option key={item.key}>{item.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Captcha
                            name="code"
                            autoComplete="off"
                            errors={codeErrors}
                            onBlur={(e) => {
                                if (e.change) setCodeErrors(null);
                            }}
                            help={codeHelp}
                            onSend={sendMobileCaptcha}
                            onStop={() => {
                                setCodeHelp({
                                    visible: false,
                                });
                            }}
                            placeholder={`6位${typeText}验证码`}
                            {...captcha}
                        />
                    </Col>
                </Row>
            </Form>
        );
    };

    return (
        <>
            <Script url="https://cdn-object.aomao.com/geetest/gt.js" />
            <Modal
                title="身份验证"
                visible={visible}
                okText={loading ? '验证中...' : '验证'}
                onOk={onVerify}
                cancelText="取消"
                destroyOnClose={true}
                okButtonProps={{
                    loading,
                }}
                onCancel={() => {
                    setVisible(false);
                    if (onClose) {
                        onClose();
                    }
                }}
            >
                {render()}
            </Modal>
        </>
    );
}
export default Verify;
