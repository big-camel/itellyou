import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Verify from '@/components/User/Verify';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';
import { sendCaptcha } from '@/services/validation';

const { Mobile, Captcha } = Form.createItem(formMap);

export default ({ onClose, visible }) => {
    const [form] = Form.useForm();
    const [mobileErrors, setMobileErrors] = useState();
    const [codeErrors, setCodeErrors] = useState();
    const [mobileHelp, setMobileHelp] = useState();
    const [captcha, setCaptcha] = useState({
        time: null,
        sending: false,
    });

    const dispatch = useDispatch();
    const loadingEffect = useSelector(state => state.loading);
    const submiting = loadingEffect.effects['user/update'];

    const onCaptcha = e => {
        e.preventDefault();
        form.validateFields(['mobile']).then(values => {
            setCaptcha({ sending: true });
            sendCaptcha({
                action: 'replace/mobile',
                mobile: values['mobile'],
            })
                .then(({ result, status, data, ...res }) => {
                    setCaptcha({ sending: false });
                    if (result) {
                        setCaptcha({ ...captcha, time: data.time + 60 });
                        setMobileHelp({
                            visible: true,
                            content: () => {
                                return '验证码已发送至手机';
                            },
                        });
                    } else if (status === 1002) {
                        setMobileErrors(res.message);
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
                action: 'mobile',
                ...values,
            },
        }).then(res => {
            if (res.result) {
                message.success('更新成功');
                if (onClose) onClose();
            } else if (res.status === 1001) {
                setCodeErrors(res.message);
            } else if (res.status == 1002) {
                setMobileErrors(res.message);
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
                title="更改手机号码"
                visible={visible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    if (onClose) onClose();
                }}
            >
                <Form form={form} layout="vertical" hideRequiredMark={true} onSubmit={handleSubmit}>
                    <Mobile
                        name="mobile"
                        autoComplete="off"
                        maxLength={11}
                        errors={mobileErrors}
                        help={mobileHelp}
                        onBlur={e => {
                            if (e.change) setMobileErrors(null);
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
                            setMobileHelp({
                                visible: false,
                            });
                        }}
                        placeholder={`6位手机验证码`}
                        maxLength={6}
                        {...captcha}
                    />
                    <Submit loading={submiting}>{submiting ? '提交中...' : '确认'}</Submit>
                </Form>
            </Modal>
        </Verify>
    );
};
