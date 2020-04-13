import React, { useState, useRef } from 'react';
import { Button, Row, Col } from 'antd';
import { LineEditor } from '@itellyou/itellyou-editor';
import styles from './index.less';

function CommentEdit({ defaultValue, onSubmit }) {
    const editor = useRef();
    const [submiting, setSubmiting] = useState(false);

    const doSubmit = () => {
        if (onSubmit && editor.current && !submiting) {
            setSubmiting(true);
            const pureContent = editor.current.getPureContent();
            const pureHtml = editor.current.getPureHtml();
            const result = onSubmit(pureContent, pureHtml);
            if (typeof result === 'object') {
                result.then(() => {
                    editor.current.clearValue();
                    setSubmiting(false);
                });
            } else {
                setSubmiting(false);
            }
        }
    };

    const onEditorLoad = e => {
        editor.current = e;
    };

    return (
        <div className={styles['comment-editor']}>
            <Row type="flex" gutter={16} align="bottom">
                <Col span={20}>
                    <LineEditor defaultValue={defaultValue} onLoad={onEditorLoad} />
                </Col>
                <Col span={4}>
                    <Button
                        className={styles['comment-editor-submit']}
                        type="primary"
                        loading={submiting}
                        onClick={doSubmit}
                    >
                        提交
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
export default CommentEdit;
