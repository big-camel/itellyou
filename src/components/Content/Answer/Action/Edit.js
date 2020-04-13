import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import Editor from '@/components/Editor';
import { history, useDispatch, useSelector } from 'umi';
import { Button, Tooltip, Modal, message } from 'antd';
import Timer from '@/components/Timer';
import styles from './Edit.less';
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { UserAuthor } from '@/components/User';

const AnswerEdit = ({ id, onSubmit, onCancel, ...props }) => {
    const editor = useRef();
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const dispatch = useDispatch();
    const { type, detail } = useSelector(state => state.doc);
    const question = useSelector(state => state.question);
    const me = useSelector(state => state.user.me);
    const question_id = question.detail ? question.detail.id : null;
    const userAnswer = question.user_answer;

    const docType = `question/${question_id}/answer`;
    useEffect(() => {
        if (type !== docType) {
            dispatch({
                type: 'doc/setType',
                payload: docType,
            });
            return;
        }
    }, [dispatch, id]);

    /**useEffect(() => {
    if (id) {
      dispatch({
        type: 'doc/setDetail',
        payload: {
          id,
        },
      });
    }
  }, [dispatch, id]);**/

    const onSaveExit = () => {
        if (editor.current) {
            editor.current.onSave('user', null, () => {
                onCancel();
            });
        } else {
            onCancel();
        }
    };

    const onSave = useCallback(
        (action, res) => {
            if (action === 'begin') {
                setSaving(true);
            } else if (action === 'finish') {
                setSaving(false);
                dispatch({
                    type: 'answer/findDraft',
                    payload: {
                        question_id,
                    },
                });
            }
        },
        [dispatch, question_id],
    );

    const onRenderStatus = () => {
        if (saving) return <span>草稿保存中...</span>;
        if (userAnswer && userAnswer.draft && userAnswer.id === detail.id)
            return (
                <span>
                    草稿保存于
                    <Timer time={detail.updated_time} />
                </span>
            );
    };

    const onDeleteDraft = callback => [
        dispatch({
            type: 'answer/deleteDraft',
            payload: {
                id: detail.id,
            },
        }).then(res => {
            if (res.result) {
                if (userAnswer && !userAnswer.published) {
                    dispatch({
                        type: 'doc/clearDetail',
                    });
                    const engine = editor.current.getEngine();
                    if (engine) engine.clearValue();
                    const editorBiz = editor.current.getEditorBiz();
                    if (editorBiz) {
                        editorBiz.onSaved({
                            content: engine.getPureContent(),
                            draft_version: 0,
                            updated_time: new Date().getTime(),
                        });
                        editorBiz.clearCachedContent();
                    }
                    setHistory(true);
                }
            }
            callback();
            if (onCancel) {
                onCancel();
            }
        }),
    ];

    const deleteDraft = () => {
        Modal.confirm({
            title: '清除草稿',
            content: `你确定要清除保存的草稿${
                userAnswer && !userAnswer.published ? '' : '并取消编辑'
            }吗？`,
            okText: '确定',
            cancelText: '取消',
            centered: true,
            onOk() {
                return new Promise(resolve => {
                    if (editor.current) {
                        editor.current.onSave('user', null, () => {
                            onDeleteDraft(resolve);
                        });
                    } else {
                        onDeleteDraft(resolve);
                    }
                });
            },
            onCancel() {},
        });
    };

    const onPublish = () => {
        if (publishing) return;
        const engine = editor.current.getEngine();
        const content = engine.getPureContent();
        if (Editor.Utils.isBlank(content)) {
            message.error('请输入回答内容!');
            return;
        }
        setPublishing(true);
        editor.current.onPublish({
            remark: '发布回答',
        });
    };

    const onPublished = useCallback(
        ({ result, data }) => {
            setPublishing(false);
            if (!result) {
                return;
            }

            if (userAnswer && userAnswer.id === parseInt(data.id)) {
                dispatch({
                    type: 'question/setUserAnswer',
                    payload: {
                        published: data.published,
                        deleted: data.deleted,
                    },
                });
            }
            if (onSubmit) {
                onSubmit(data);
                return;
            }
            history.push(`/question/${question_id}/answer/${data.id}`);
        },
        [question_id, onSubmit],
    );

    return (
        <div
            className={classNames(
                styles['edit-warpper'],
                { [styles['edit-new']]: !detail || !detail.published },
                props.className,
            )}
        >
            {(!detail || !detail.published) && me && <UserAuthor info={me} />}
            {type === docType && (
                <Editor
                    className={styles['answer-editor']}
                    ref={editor}
                    id={id}
                    ot={false}
                    onSave={onSave}
                    onPublished={onPublished}
                />
            )}
            <div className={styles.footer}>
                <div className={styles.status}>
                    {detail && (
                        <React.Fragment>
                            {userAnswer && userAnswer.draft && userAnswer.id === detail.id && (
                                <Tooltip title="删除草稿">
                                    <Button type="ghost" onClick={deleteDraft}>
                                        <DeleteOutlined />
                                    </Button>
                                </Tooltip>
                            )}
                            {onRenderStatus()}
                        </React.Fragment>
                    )}
                    {!detail && props.historyView && (
                        <Button
                            onClick={() => editor.current.showHistory()}
                            type="ghost"
                            icon={<RollbackOutlined />}
                        >
                            撤销删除
                        </Button>
                    )}
                </div>
                <div className={styles.action}>
                    {detail && <Button onClick={() => editor.current.showHistory()}>历史</Button>}
                    {onCancel && <Button onClick={onSaveExit}>保存草稿并离开</Button>}
                    <Button loading={publishing} type="primary" onClick={onPublish}>
                        {publishing ? '提交中...' : '提交回答'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default AnswerEdit;
