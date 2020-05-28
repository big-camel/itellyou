import React, { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { history, useDispatch, useSelector } from 'umi';
import { Button, Tooltip, Modal, message, Space } from 'antd';
import Editor from '@/components/Editor';
import Timer from '@/components/Timer';
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { UserAuthor } from '@/components/User';
import { PaidReadSetting } from '@/components/PaidRead';
import styles from './Edit.less';

const AnswerEdit = ({ id, onSubmit, onCancel, ...props }) => {
    const editor = useRef();
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [paidReadSetting, setPaidReadSetting] = useState(false);

    const dispatch = useDispatch();
    const { detail } = useSelector(state => state.doc);
    const question = useSelector(state => state.question);
    const me = useSelector(state => state.user.me);
    const question_id = question.detail ? question.detail.id : null;
    const userAnswer = question.user_answer;

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

    const onPaidReadSubmit = value => {
        return new Promise(resolve => {
            dispatch({
                type: 'doc/paidread',
                payload: {
                    data: { ...value, id },
                    type: `question/${question_id}/answer`,
                },
            }).then(({ result }) => {
                if (result) {
                    setPaidReadSetting(false);
                    message.success('设置成功');
                }
                resolve();
            });
        });
    };

    return (
        <div
            className={classNames(
                styles['edit-warpper'],
                { [styles['edit-new']]: !detail || !detail.published },
                props.className,
            )}
        >
            {(!detail || !detail.published) && me && <UserAuthor info={me} />}
            <Editor
                className={styles['answer-editor']}
                ref={editor}
                id={id}
                ot={false}
                dataType={`question/${question_id}/answer`}
                onSave={onSave}
                onPublished={onPublished}
            />
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
                <Space>
                    {detail && (
                        <Tooltip title="提问者始终可查看">
                            <a onClick={() => setPaidReadSetting(true)}>付费阅读</a>
                        </Tooltip>
                    )}
                    {detail && <a onClick={() => editor.current.showHistory()}>历史</a>}
                    {onCancel && <a onClick={onSaveExit}>保存草稿并离开</a>}
                    <Button loading={publishing} type="primary" onClick={onPublish}>
                        {publishing ? '提交中...' : '提交回答'}
                    </Button>
                </Space>
            </div>
            {detail && (
                <PaidReadSetting
                    dataSource={detail.paid_read}
                    visible={paidReadSetting}
                    onCancel={() => setPaidReadSetting(false)}
                    onSubmit={onPaidReadSubmit}
                />
            )}
        </div>
    );
};
export default AnswerEdit;
