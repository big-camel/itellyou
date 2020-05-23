import React from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Verify from '@/components/User/Verify';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';

const { Path } = Form.createItem(formMap);

export default ({ onClose, visible, defaultValue }) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const loadingEffect = useSelector(state => state.loading);
    const submiting = loadingEffect.effects['user/update'];

    const findPath = (_, path) => {
        return new Promise((resolve, reject) => {
            if (path === defaultValue) {
                return resolve();
            }

            dispatch({
                type: 'path/find',
                payload: {
                    path,
                },
            }).then(({ result }) => {
                if (result) return reject('不可用的路径或已被使用');
                resolve();
            });
        });
    };

    const handleSubmit = values => {
        dispatch({
            type: 'user/update',
            payload: {
                action: 'path',
                ...values,
            },
        }).then(res => {
            if (res.result) {
                message.success('更新成功');
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
                title="更改个人路径"
                visible={visible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    if (onClose) onClose();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    hideRequiredMark={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        path: defaultValue,
                    }}
                >
                    <Path
                        name="path"
                        autoComplete="off"
                        placeholder={defaultValue}
                        defaultValue={defaultValue}
                        asyncValidator={findPath}
                    />
                    <Submit loading={submiting}>{submiting ? '提交中...' : '确认'}</Submit>
                </Form>
            </Modal>
        </Verify>
    );
};
