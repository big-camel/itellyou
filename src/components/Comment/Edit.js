import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { Button, message } from 'antd';
import { useSelector, Link, isBrowser } from 'umi';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { LineEditor } from '@/components/Editor/Async';
import { isBlank } from '@/components/Editor/utils';
import styles from './index.less';
import Loading from '../Loading';

function CommentEdit({ defaultValue, onSubmit }) {
    const editor = useRef();
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);
    const [singleView, setSingleView] = useState(true);
    const [isFocus, setIsFocus] = useState(false);
    const [content, setContent] = useState();
    const me = useSelector((state) => state.user.me);

    const doSubmit = () => {
        if (onSubmit && editor.current && !submiting) {
            if (isBlank(content)) {
                message.error('请输入评论内容');
                return;
            }
            setSubmiting(true);
            const pureHtml = editor.current.getPureHtml();
            const result = onSubmit(content, pureHtml);
            if (typeof result === 'object') {
                result.then((callback) => {
                    editor.current.clearValue();
                    setSubmiting(false);
                    if (typeof callback === 'function') callback();
                });
            } else {
                setSubmiting(false);
            }
        }
    };

    const onEditorLoad = (e) => {
        e.container.on('focus', () => {
            setIsFocus(true);
        });
        e.container.on('blur', () => {
            setIsFocus(false);
        });
        editor.current = e;
        setLoading(false);
    };

    const onEditorChange = () => {
        const style = window.getComputedStyle(editor.current.container[0], null);
        let height = parseInt(style.height, 10);
        const lineHeight = parseInt(style.lineHeight, 10);
        const paddingTop = parseInt(style.paddingTop, 10);
        const paddingBottom = parseInt(style.paddingBottom, 10);
        height -= paddingTop + paddingBottom;
        const lineCount = height / lineHeight;
        setSingleView(lineCount <= 1);

        const pureContent = editor.current.getPureContent();
        setContent(pureContent);
    };

    const renderEditor = () => {
        if (!me)
            return (
                <div className={styles['comment-not-login']}>
                    <Link to="/login">登录</Link>后参与评论
                </div>
            );

        const isShowBtn = !loading && (isFocus || !isBlank(content) || !singleView);

        return (
            <div
                className={classNames(
                    styles['comment-warp'],
                    { [styles['comment-single']]: singleView },
                    { [styles['comment-hide-btn']]: !isShowBtn },
                    { [styles['comment-active']]: isFocus || !isBlank(content) },
                )}
            >
                {isBrowser() ? (
                    <>
                        <LineEditor
                            defaultValue={defaultValue}
                            onLoad={onEditorLoad}
                            onChange={onEditorChange}
                            toolbar={[['emoji']]}
                            onFoucs={() => {
                                console.log('onfous');
                            }}
                        />
                        {!loading && (
                            <Button
                                key="editor-submit"
                                className={styles['comment-editor-submit']}
                                type="primary"
                                loading={submiting}
                                onClick={doSubmit}
                                disabled={isBlank(content)}
                            >
                                发布
                            </Button>
                        )}
                    </>
                ) : (
                    <Loading />
                )}
            </div>
        );
    };

    return <div className={styles['comment-editor']}>{renderEditor()}</div>;
}
export default CommentEdit;
