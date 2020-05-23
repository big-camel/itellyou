import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Verify from '@/components/User/Verify';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';
import { sendCaptcha } from '@/services/validation';

const { Email, Captcha } = Form.createItem(formMap);

export default ({ onClose, visible }) => {
    const [form] = Form.useForm();
    const [emailErrors, setEmailErrors] = useState();
    const [codeErrors, setCodeErrors] = useState();
    const [emailHelp, setEmailHelp] = useState();
    const [captcha, setCaptcha] = useState({
        time: null,
        sending: false,
    });

    const dispatch = useDispatch();
    const loadingEffect = useSelector(state => state.loading);
    const submiting = loadingEffect.effects['user/update'];

    const onCaptcha = e => {
        e.preventDefault();
        form.validateFields(['email']).then(values => {
            setCaptcha({ sending: true });
            sendCaptcha({
                action: 'replace/email',
                email: values['email'],
            })
                .then(({ result, status, data, ...res }) => {
                    setCaptcha({ sending: false });
                    if (result) {
                        setCaptcha({ ...captcha, time: data.time + 60 });
                        setEmailHelp({
                            visible: true,
                            content: () => {
                                return '验证码已发送至邮箱';
                            },
                        });
                    } else if (status === 1002) {
                        setEmailErrors(res.message);
                    } else {
                        message.error(res.message);
                    }
                })
                .catch(error => {
                    setCaptcha({ sending: false });
                });
        });
    };

    const handleSubmit = values => {
        dispatch({
            type: 'user/update',
            payload: {
                action: 'email',
                ...values,
            },
        }).then(res => {
            if (res.result) {
                message.success('更新成功');
                if (onClose) onClose();
            } else if (res.status === 1001) {
                setCodeErrors(res.message);
            } else if (res.status == 1002) {
                setEmailErrors(res.message);
            } else {
                message.error(res.message);
            }
        });
    };

    return (
        <Verify
            form={form}
            visible={visible}
            onClose={() => {
                if (onClose) onClose();
            }}
        >
            <Modal
                title="更改邮箱"
                visible={visible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    if (onClose) onClose();
                }}
            >
                <Form form={form} layout="vertical" hideRequiredMark={true} onSubmit={handleSubmit}>
                    <Email
                        name="email"
                        autoComplete="off"
                        errors={emailErrors}
                        help={emailHelp}
                        onBlur={e => {
                            if (e.change) setEmailErrors(null);
                        }}
                    />
                    <Captcha
                        name="code"
                        autoComplete="off"
                        errors={codeErrors}
                        onBlur={e => {
                            if (e.change) setCodeErrors(null);
                        }}
                        onSend={onCaptcha}
                        onStop={() => {
                            setEmailHelp({
                                visible: false,
                            });
                        }}
                        placeholder={`6位验证码`}
                        maxLength={6}
                        {...captcha}
                    />
                    <Submit loading={submiting}>{submiting ? '提交中...' : '确认'}</Submit>
                </Form>
            </Modal>
        </Verify>
    );
};
