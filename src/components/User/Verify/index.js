import React, { useState, useEffect } from 'react';
import { Modal, Select, message, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Loading from '@/components/Loading';
import '@/utils/gt.js';
import Form from '@/components/Form';
import formMap from './formMap';
import { sendCaptcha } from '@/services/validation';
import { mobile, email } from '@/services/verify';

const { Captcha } = Form.createItem(formMap);
const VERIFY_SESSION_KEY = 'itellyou_verify_key';

function Verify({ defaultValue, onClose, children, ...props }) {
    defaultValue = defaultValue || 'mobile';

    const [type, setType] = useState(defaultValue);
    const [visible, setVisible] = useState(props.visible);

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
    const me = useSelector(state => state.user.me);
    const loadingEffect = useSelector(state => state.loading);

    useEffect(() => {
        setVerifySucceed(expired && expired > new Date().getTime() / 1000);
    }, [expired]);

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible]);

    useEffect(() => {
        if (!me) {
            dispatch({
                type: 'user/fetchMe',
            });
        }
    }, [dispatch, me]);

    if (!me) return <Loading />;

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
    if (dataSource.length === 0) {
        return <p>暂无可验证选项</p>;
    }

    const onTypeChange = value => {
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

    const sendMobileCaptcha = e => {
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
            .catch(error => {
                setCaptcha({ sending: false });
                if (!error) return;
            });
    };

    const loading = loadingEffect.effects[`verify/${type}`];

    const onVerify = () => {
        form.validateFields(['code'])
            .then(values => {
                const verify = type === 'mobile' ? mobile : email;
                verify(values).then(({ result, status, data, ...res }) => {
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
            .catch(() => {});
    };

    if (verifySucceed) return children;

    const { Option } = Select;
    return (
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
                                {dataSource.map(item => (
                                    <Option key={item.key}>{item.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Captcha
                            name="code"
                            autoComplete="off"
                            errors={codeErrors}
                            onBlur={e => {
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
        </Modal>
    );
}
export default Verify;
