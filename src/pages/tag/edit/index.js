import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';
import { Button, message, Space, Badge } from 'antd';
import { history, useSelector } from 'umi';
import Editor from '@/components/Editor';
import styles from './index.less';
import logo from '@/assets/logo.svg';
import moment from 'moment';
import Timer from '@/components/Timer';
import { RouteContext } from '@/context';
import { UserAuthor } from '@/components/User';

function Edit({ match: { params } }) {
    const id = params.id ? parseInt(params.id) : null;
    if (!id) history.push('/404');
    const editor = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [collabUsers, setCollabUsers] = useState([]);
    const { detail } = useSelector((state) => state.doc);
    const { isMobile } = useContext(RouteContext);
    useEffect(() => {
        if ((id && detail) || !id) {
            setLoading(false);
        }
    }, [detail, id]);

    const onSave = useCallback((action) => {
        setSaving(action === 'begin');
    }, []);

    const onReverted = () => {
        // 重新加载页面
        window.location.reload();
    };

    const renderSaveStatus = () => {
        if (saving) {
            return '保存中...';
        }
        if (detail) {
            return <span>保存于 {moment(detail.updated_time).format('H:mm:ss')}</span>;
        }

        if (!loading && detail) {
            return (
                <span>
                    最后更改于
                    <Timer time={detail.updated_time} />
                </span>
            );
        }
    };

    const onPublish = () => {
        const engine = editor.current.getEngine();
        const content = engine.getPureContent();
        if (Editor.Utils.isBlank(content)) {
            message.error('请输入正文');
            return;
        }

        if (editor.current) {
            setPublishing(true);
            editor.current.onPublish();
        }
    };

    const onPublished = useCallback((res) => {
        setPublishing(false);
        if (res && !res.result) {
            message.error(res.message);
            return;
        }

        message.info('发布成功', 1, () => {
            window.location.href = '/tag/' + res.data.id;
        });
    }, []);

    const renderCollabUsers = () => {
        if (isMobile) return null;
        return (
            <Space>
                {collabUsers.map((user) => (
                    <div key={user.id} className={styles['collab-user']}>
                        <UserAuthor model="avatar" size="small" info={user} />
                        <Badge color={user.color} />
                    </div>
                ))}
            </Space>
        );
    };

    return (
        <>
            {!loading && (
                <header className={styles.header}>
                    <div className={styles.container}>
                        <div className={styles.logo}>
                            <a href="/">
                                <img src={logo} alt="" />
                            </a>
                        </div>
                        {!isMobile && (
                            <div className={styles['sub-title']}>
                                标签编辑<span>-</span>
                                {detail ? detail.name : null}
                            </div>
                        )}
                        <div className={styles['save-status']}>{renderSaveStatus()}</div>
                        <div className={styles.right}>
                            {renderCollabUsers()}
                            {!isMobile && detail && (
                                <Button onClick={() => editor.current.showHistory()}>历史</Button>
                            )}
                            <Button type="primary" loading={publishing} onClick={onPublish}>
                                {publishing ? '发布中...' : '发布'}
                            </Button>
                        </div>
                    </div>
                </header>
            )}
            <div className={styles.container}>
                <div className={styles['editor']}>
                    <Editor
                        type={isMobile ? 'mini' : 'full'}
                        ref={editor}
                        id={id}
                        ot={true}
                        dataType="tag"
                        toolbar={
                            isMobile
                                ? [
                                      ['heading', 'bold'],
                                      ['codeblock'],
                                      ['orderedlist', 'unorderedlist'],
                                      ['image', 'video', 'file'],
                                  ]
                                : null
                        }
                        toc={isMobile ? false : true}
                        onSave={onSave}
                        onReverted={onReverted}
                        onPublished={onPublished}
                        onCollabUsers={setCollabUsers}
                    />
                </div>
            </div>
        </>
    );
}
Edit.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};
export default Edit;
