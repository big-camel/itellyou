import React from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Verify from '@/components/User/Verify';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';

const { Password, ConfirmPassword } = Form.createItem(formMap);

export default ({ onClose, visible }) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const loadingEffect = useSelector(state => state.loading);
    const submiting = loadingEffect.effects['user/update'];

    const handleSubmit = values => {
        dispatch({
            type: 'user/update',
            payload: {
                action: 'password',
                ...values,
            },
        }).then(res => {
            if (res.result) {
                message.success('修改成功');
                if (onClose) onClose();
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
                title="更改密码"
                visible={visible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    if (onClose) onClose();
                }}
            >
                <Form form={form} layout="vertical" hideRequiredMark={true} onSubmit={handleSubmit}>
                    <Password name="password" autoComplete="off" placeholder="新密码" />
                    <ConfirmPassword
                        name="confirm"
                        autoComplete="off"
                        dependencies={['password']}
                    />
                    <Submit loading={submiting}>{submiting ? '提交中...' : '确认'}</Submit>
                </Form>
            </Modal>
        </Verify>
    );
};
