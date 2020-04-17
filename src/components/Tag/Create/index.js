import React, { useState, useRef } from 'react';
import { Row, Col, Button, message } from 'antd';
import { useDispatch } from 'umi';
import Editor from '@/components/Editor';

import Form, { Submit } from '@/components/Form';
import formMap from './formMap';

const { TagName } = Form.createItem(formMap);

export default ({ defaultName, onCallback }) => {
    const [form] = Form.useForm();
    const engine = useRef(null);

    const dispatch = useDispatch();
    const [nameErrors, setNameErrors] = useState();
    const [loading, setLoading] = useState(false);

    const handleSubmit = values => {
        const content = engine.current.getPureContent();
        if (Editor.Utils.isBlank(content)) {
            message.error('请输入描述内容');
            return;
        }
        const html = engine.current.getPureHtml();
        setLoading(true);
        dispatch({
            type: 'tag/create',
            payload: {
                ...values,
                content,
                html,
            },
        }).then(res => {
            setLoading(false);
            if (res.result === true) {
                form.resetFields();
                engine.current.setValue(null);
                if (onCallback) onCallback(res);
                else {
                    message.success('创建成功');
                }
            } else if (res.status === 1001) {
                setNameErrors(res.message);
            } else {
                message.error(res.message);
            }
        });
    };

    const asyncValidator = (_, value) => {
        value = value.toLowerCase();
        return new Promise((resolve, reject) => {
            dispatch({
                type: 'tag/query',
                payload: {
                    name: value,
                },
            }).then(res => {
                if (res.result) return reject('当前标签不可用');
                resolve();
            });
        });
    };

    const onCancel = () => {
        form.resetFields();
        engine.current.setValue(null);
        if (onCallback) onCallback();
    };

    const onEditorLoaded = e => {
        engine.current = e;
    };

    return (
        <Form
            form={form}
            onSubmit={handleSubmit}
            initialValues={{
                name: defaultName,
            }}
        >
            <TagName
                autoComplete="off"
                name="name"
                asyncValidator={asyncValidator}
                errors={nameErrors}
            />
            <Form.Item>
                <Editor
                    onReady={onEditorLoaded}
                    save={false}
                    toolbar={[
                        ['heading', 'bold', 'italic', 'strikethrough', 'quote'],
                        ['codeblock', 'table', 'math'],
                        ['orderedlist', 'unorderedlist', 'tasklist'],
                        ['image', 'video', 'link', 'label'],
                    ]}
                />
            </Form.Item>
            <Form.Item>
                <Row gutter={8}>
                    <Col span={12}>
                        <Button style={{ width: '100%' }} onClick={onCancel}>
                            取消
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Submit size={null} loading={loading}>
                            {loading ? '创建中...' : '提交'}
                        </Submit>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );
};
