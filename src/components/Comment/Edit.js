import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useSelector, Link } from 'umi';
import { useEditor } from '@/components/Editor';
import styles from './index.less';

function CommentEdit({ defaultValue, onSubmit }) {
    const { LineEditor } = useEditor() || {};
    const editor = useRef();
    const [submiting, setSubmiting] = useState(false);
    const me = useSelector(state => state.user.me);

    const doSubmit = () => {
        if (onSubmit && editor.current && !submiting) {
            setSubmiting(true);
            const pureContent = editor.current.getPureContent();
            const pureHtml = editor.current.getPureHtml();
            const result = onSubmit(pureContent, pureHtml);
            if (typeof result === 'object') {
                result.then(callback => {
                    editor.current.clearValue();
                    setSubmiting(false);
                    if (typeof callback === 'function') callback();
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
            {!me && (
                <div className={styles['comment-not-login']}>
                    <Link to="/login">登录</Link>后参与评论
                </div>
            )}
            {me && LineEditor && (
                <div className={styles['comment-warp']}>
                    <LineEditor defaultValue={defaultValue} onLoad={onEditorLoad} />

                    <Button
                        className={styles['comment-editor-submit']}
                        type="primary"
                        loading={submiting}
                        onClick={doSubmit}
                    >
                        提交
                    </Button>
                </div>
            )}
        </div>
    );
}
export default CommentEdit;
