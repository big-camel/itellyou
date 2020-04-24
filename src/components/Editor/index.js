import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useImperativeHandle,
    forwardRef,
} from 'react';
import { useSelector } from 'umi';
import { message } from 'antd';
import omit from 'omit.js';
import { FullEditor, MiniEditor } from '@itellyou/itellyou-editor';
import Viewer from './Viewer';
import History from './History';

import debounce from 'lodash/debounce';
import Collab, { EVENT, STATUS, ERROR_CODE } from './Collab';
import EditorBiz from './Biz';
import * as Utils from './utils';
const { SAVE_TYPE } = EditorBiz;

function Editor(
    {
        id,
        type = 'mini',
        api,
        save = true,
        ot = true,
        className,
        onPublished,
        onReady,
        onChange,
        historyExtra,
        ...props
    },
    ref,
) {
    const [loadScripts, setLoadScripts] = useState(true);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [collabLoaded, setCollabLoaded] = useState(false);
    const [historyView, setHistoryView] = useState(props.historyView);
    const [publishing, setPublishing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStaus] = useState(STATUS.initialize);
    const [collabUsers, setCollabUsers] = useState([]);
    const doc = useSelector(state => state.doc);
    const engine = useRef();

    const collab = useRef();

    onChange = onChange || useCallback(() => {}, []);

    onPublished = onPublished || useCallback(() => {}, []);

    useEffect(() => {
        const scripts = [
            `https://cdn-object.itellyou.com/ali-sdk/aliyun-oss-sdk-5.3.1.min.js`,
            `https://cdn-object.itellyou.com/ali-sdk/aliyun-upload-sdk-1.5.0.min.js`,
        ];
        scripts.map(src => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            document.body.appendChild(script);
        });
        setLoadScripts(false);
    }, []);

    const onEditorLoaded = inst => {
        engine.current = inst;
        setEditorLoaded(true);
        if (onReady) onReady(engine.current);
    };

    useImperativeHandle(ref, () => ({
        onPublish,
        onSave,
        showHistory,
        getEngine: () => engine.current,
        getCollabBiz: () => collab.current,
        getEditorBiz: () => (collab.current ? collab.current.editorBiz : null),
    }));

    const doSave = useCallback(
        (type, params, callback) => {
            if (!save) return;
            const content = engine.current.getPureContent();
            const html = engine.current.getPureHtml();
            const userSave = props.onSave || function() {};
            userSave('begin', { content, html });
            collab.current.doSaveContent(
                {
                    type,
                    content,
                    html,
                    ...params,
                },
                res => {
                    userSave('finish', res);
                    callback(res);
                },
            );
        },
        [save, props.onSave],
    );

    const onSave = useCallback(
        (type, params, callback) => {
            callback = callback || function() {};
            if (status !== STATUS.active) {
                console.log('on save, editor not active, ignore');
                return;
            }
            if (saving) return; //message.error('正在保存，请稍后再试');
            if (!collab.current) return;
            engine.current.event.trigger('save:before');
            engine.current.asyncEvent
                .emitAsync('save:before')
                .then(() => {
                    doSave(type, params, callback);
                })
                .catch(error => {
                    if (type === SAVE_TYPE.USER_PUBLISH) {
                        setPublishing(false);
                        message.error(error);
                    } else {
                        doSave(type, params, callback);
                    }
                });
        },
        [status, saving, doSave],
    );

    const onUserSave = useCallback(() => {
        onSave(SAVE_TYPE.USER_SAVE);
    }, [onSave]);

    const onAutoSave = useCallback(() => onSave(SAVE_TYPE.AUTO), [onSave]);

    useEffect(() => {
        window.addEventListener('beforeunload', onAutoSave);
        return () => {
            window.removeEventListener('beforeunload', onAutoSave);
        };
    }, [onAutoSave]);

    const onDebounceSave = useCallback(debounce(onAutoSave, 60000), [onAutoSave]);

    const onEditorChange = useCallback(
        content => {
            collab.current.cache(content);
            onDebounceSave();
            onChange(content);
        },
        [onDebounceSave, onChange],
    );

    const onCollabReady = useCallback(collabBiz => {
        collabBiz.on(EVENT.statusChange, ({ to }) => {
            setStaus(to);
        });
        collabBiz.on(EVENT.usersChange, users => {});
        collabBiz.on(EVENT.saving, () => {
            setSaving(true);
        });
        collabBiz.on(EVENT.saved, () => {
            setSaving(false);
        });
        collabBiz.on(EVENT.error, ({ code, level }) => {
            if (code === ERROR_CODE.SAVE_FAILED) {
                setSaving(false);
                setPublishing(false);
            }
            if (code === ERROR_CODE.PUBLISH_FAILED) {
                setPublishing(false);
            }
        });
        collab.current = collabBiz;
        setCollabLoaded(true);
    }, []);

    useEffect(() => {
        if (collab.current) {
            collab.current.on(EVENT.inactive, onAutoSave);
        }
        return () => {
            if (collab.current) {
                collab.current.off(EVENT.inactive, onAutoSave);
            }
        };
    }, [collabLoaded, onAutoSave]);

    useEffect(() => {
        if (collab.current) {
            collab.current.on(EVENT.published, onPublished);
        }
        return () => {
            if (collab.current) {
                collab.current.off(EVENT.published, onPublished);
            }
        };
    }, [collabLoaded, onPublished]);

    const onPublish = params => {
        if (publishing) return;
        setPublishing(true);
        onSave(SAVE_TYPE.USER_PUBLISH, null, () => {
            collab.current.doPublishDoc(params);
        });
    };

    const showHistory = () => {
        onAutoSave();
        setHistoryView(true);
    };

    const onReverted = ({ result, data, message }) => {
        if (result) {
            if (ot) {
                collab.current.doReverted(data.content);
            }
            if (props.onReverted) props.onReverted();
        } else {
            message.error(message);
        }
    };
    const restProps = omit(props, ['onSave', 'historyExtra', 'onReverted']);
    let EditorType = FullEditor;

    let toolbar = [
        ['section'],
        ['save', 'undo', 'redo', 'paintformat', 'removeformat'],
        ['heading', 'fontsize'],
        ['bold', 'italic', 'strikethrough', 'underline', 'moremark'],
        ['fontcolor', 'highlight'],
        ['alignment'],
        ['unorderedlist', 'orderedlist', 'tasklist', 'indent-list'],
        ['link', 'quote', 'hr'],
        ['search', /**'translate',**/ 'toc'],
    ];
    if (type === 'mini') {
        EditorType = MiniEditor;
        toolbar = [
            ['emoji', 'heading', 'bold', 'italic', 'strikethrough', 'quote'],
            ['codeblock', 'table', 'math'],
            ['orderedlist', 'unorderedlist', 'tasklist'],
            ['alignment'],
            ['image', 'video', 'file', 'link', 'label'],
        ];
    }
    return (
        <div className={className}>
            {editorLoaded && (
                <Collab id={id} ot={ot} engine={engine.current} onReady={onCollabReady} />
            )}
            {!loadScripts && (
                <EditorType
                    defaultValue={null}
                    onSave={onUserSave}
                    onChange={onEditorChange}
                    onLoad={onEditorLoaded}
                    ot={ot}
                    save={save}
                    toolbar={toolbar}
                    emoji={{
                        action: 'https://cdn-object.itellyou.com/emoji/',
                    }}
                    markdown={{
                        action: null,
                        items: [
                            'codeblcok',
                            'bold',
                            'strikethrough',
                            'italic',
                            'orderedlist',
                            'unorderedlist',
                            'tasklist',
                            'checkedtasklist',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'quote',
                            'link',
                        ],
                    }}
                    lockedtext={{
                        action: '/api/crypto',
                    }}
                    image={{
                        action: `/api/upload/image?type=${doc.type}`,
                        display: 'block',
                        align: 'center',
                    }}
                    file={{
                        action: `/api/upload/file?type=${doc.type}`,
                    }}
                    localdoc={{
                        action: `/api/upload/doc?type=${doc.type}`,
                    }}
                    video={{
                        action: {
                            create: `/api/upload/video?type=${doc.type}`,
                            query: '/api/upload/video/query',
                            save: `/api/upload/video/save?type=${doc.type}`,
                        },
                        user_id: '1049903053975201',
                    }}
                    {...restProps}
                />
            )}
            {historyView && (
                <History
                    id={id}
                    extra={historyExtra}
                    onReverted={onReverted}
                    onCancel={() => {
                        setHistoryView(false);
                    }}
                />
            )}
        </div>
    );
}

Editor = forwardRef(Editor);
Editor.Biz = EditorBiz;
Editor.Viewer = Viewer;
Editor.History = History;
Editor.Utils = Utils;
export default Editor;
