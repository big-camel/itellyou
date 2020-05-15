import debounce from 'lodash/debounce';
import EditorBiz from '../Biz';
import sharedb from './ot/client';
import { EventEmitter } from 'events';
import { EVENT, ERROR_CODE, ERROR_LEVEL, STATUS, MESSAGE } from './constant';
import { getPureContent, isBlank } from '../utils';

class CollabBiz extends EventEmitter {
    constructor(id, dispatch, options) {
        super();
        this.id = id;
        this.dispatch = dispatch;
        this.options = Object.assign(
            {
                collab: null,
            },
            options,
        );
        this.socket = null;
        this.engine = options.engine;
        this.status = STATUS.initialize;
        this.users = [];
        this.currentMember = null;
        this.editorBiz = null;
        this.editorInitialized = false;
    }

    onPageClose = () => {
        this.exit();
    };

    onVisibilityChange = () => {
        if ('hidden' === document.visibilityState) {
            this.emit(EVENT.inactive);
        }
    };

    loaded(doc, collab) {
        this.options.collab = collab;
        const { me } = this.options;
        this.editorBiz = new EditorBiz(doc, this.dispatch, {
            mode: collab ? EditorBiz.MODE.OT : EditorBiz.MODE.NORMAL,
            me,
        });
        if (!collab) {
            this.transmit(STATUS.active);
        } else {
            this.transmit(STATUS.docLoaded);
        }
        this.startCollab(this.engine);
        this.gracefulRefreshEditor();
        if (!this.editorInitialized) {
            this.bindEvents();
            if (!collab) this.editorInitialized = true;
        }
    }

    init() {
        this.reset();
        const { ot, me } = this.options;
        if (!this.id) {
            const doc = {
                id: me.id + new Date().getTime(),
                content: '',
                draft_version: 0,
                updated_time: new Date().getTime(),
            };
            setTimeout(() => {
                this.loaded(doc);
            }, 10);
            return;
        }

        this.dispatch({
            type: 'doc/find',
            payload: {
                data: {
                    id: this.id,
                    ot,
                },
                onError: error => {
                    this.onError({
                        code: ERROR_CODE.INIT_FAILED,
                        level: ERROR_LEVEL.FATAL,
                        message: '加载文档失败',
                        error,
                    });
                },
            },
        }).then(({ data }) => {
            if (!data) return;
            const { collab, ...doc } = data;
            this.loaded(doc, collab);
        });
    }

    reset() {
        this.users = [];
        this.currentMember = null;
        this.disconnect();
        this.transmit(STATUS.initialize);
    }

    reload() {
        this.init();
    }

    startCollab(engine) {
        this.engine = engine;
        const { collab } = this.options;
        if (!collab) {
            console.warn('collab is undefined');
            return;
        }
        const { host, key, token } = collab;
        const url = `${host}/?key=${key}&token=${token}`;
        const socket = new WebSocket(url);

        socket.addEventListener('open', () => {
            console.log('collab server connected');
            this.socket = socket;
            this.socket.addEventListener('message', event => {
                const { data, action } = JSON.parse(event.data);
                if ('members' === action) {
                    this.addMembers(data);
                    engine.ot.setMembers(data);
                    return;
                }
                if ('join' === action) {
                    this.addMembers([data]);
                    engine.ot.addMember(data);
                    return;
                }
                if ('leave' === action) {
                    engine.ot.removeMember(data);
                    this.removeMember(data);
                    return;
                }
                if ('ready' === action) {
                    this.currentMember = data;
                    engine.ot.setCurrentMember(data);
                    this.loadDocument();
                }
                if ('broadcast' === action) {
                    const { body, type } = data;
                    if (body.user.uuid !== this.currentMember.uuid) {
                        this.emit(EVENT.broadcast, {
                            type,
                            body,
                        });
                    }
                    if (type === MESSAGE.DOC_DELETED) {
                        this.transmit(STATUS.deleted);
                    }
                }
            });
        });
        socket.addEventListener('close', () => {
            console.log('collab server connection close, current status: ', this.status);
            if (this.status !== STATUS.exit) {
                console.log('connect closed');
                this.onError({
                    code: ERROR_CODE.DISCONNECTED,
                    level: ERROR_LEVEL.FATAL,
                    message: '网络连接异常，无法继续编辑',
                });
            }
        });
        socket.addEventListener('error', error => {
            console.log('collab server connection error');
            this.onError({
                code: ERROR_CODE.CONNECTION_ERROR,
                level: ERROR_LEVEL.FATAL,
                message: '网络连接异常，无法继续编辑',
                error,
            });
        });
    }

    disconnect() {
        if (this.socket) {
            try {
                this.socket.close(ERROR_CODE.STATUS_CODE.FORCE_DISCONNECTED, 'FORCE_DISCONNECTED');
            } catch (e) {
                console.log(e);
            }
        }
    }

    broadcast(type, body) {
        this.socket.send(
            JSON.stringify({
                action: 'broadcast',
                data: {
                    type,
                    body,
                    sender: this.currentMember,
                },
            }),
        );
    }

    exit() {
        if (this.status !== STATUS.exit) {
            this.transmit(STATUS.exit);
            this.disconnect();
        }
    }

    cache(value) {
        if (!this.id) return;
        if (this.editorInitialized) {
            this.editorBiz.saveToCache({
                value,
            });
        } else {
            console.warn('editor not initialized,ignore cache cmd');
        }
    }

    doSaveContent(value, callback) {
        callback = callback || function() {};
        const { type, content, html, ...other } = value;

        if (!this.editorBiz.isContentChanged(content) && type !== EditorBiz.SAVE_TYPE.FORCE) {
            return callback();
        }

        const data = {
            id: this.id,
            content,
            html,
            ...other,
            save_type: type === EditorBiz.SAVE_TYPE.AUTO ? 'auto' : 'user',
        };

        this.emit(EVENT.saving);

        const { ot } = this.options;
        const server = `doc/${this.id ? 'update' : 'create'}`;
        if (!this.id) {
            data.ot = ot;
        }
        this.dispatch({
            type: server,
            payload: {
                data,
                onError: error => {
                    this.emit(EVENT.error, {
                        code: ERROR_CODE.SAVE_FAILED,
                        level: ERROR_LEVEL.WARNING,
                        error,
                    });
                },
            },
        }).then(res => {
            const { result, data } = res;
            if (result) {
                if (!this.id) {
                    this.id = data;
                    this.reload();
                    this.emit(EVENT.saved);
                    return callback(res);
                }
                this.editorBiz.onSaved(data);
                this.editorBiz.clearCachedContent();
                this.emit(EVENT.saved);
            }

            callback(res);
        });
    }

    doPublishDoc(params) {
        this.dispatch({
            type: 'doc/publish',
            payload: {
                data: {
                    id: this.id,
                    ...params,
                },
                onError: error => {
                    this.emit(EVENT.error, {
                        code: ERROR_CODE.PUBLISH_FAILED,
                        level: ERROR_LEVEL.WARNING,
                        error,
                    });
                },
            },
        }).then(res => {
            if (res.result && this.options.ot) {
                this.broadcast(MESSAGE.DOC_PUBLISHED, {
                    user: this.currentMember,
                });
            }
            this.emit(EVENT.published, res);
        });
    }

    onDocDeleted() {
        this.exit();
        this.broadcast(MESSAGE.DOC_DELETED, {
            user: this.currentMember,
        });
    }

    doReverted(content) {
        // 手动修改引擎value，让其同步到 ot 服务器
        this.engine.ot.doc.data = [];
        this.engine.ot.syncData(content);
        const check = debounce(() => {
            if (this.otDoc && this.otDoc.hasWritePending()) {
                check();
            } else {
                this.emit(EVENT.reverted);
            }
        }, 100);
        check();
    }

    getContent() {
        return this.engine.getPureValue();
    }

    setContent(value) {
        value = getPureContent(value);
        value = value || '<p><br /></p>';
        this.engine.setValue(value);
    }

    gracefulRefreshEditor() {
        const initialDocument = this.editorBiz.getInitialDocument();
        const { value, origin } = initialDocument;
        let refresh = true;
        if (this.editorInitialized) {
            if (origin === 'cache') {
                refresh = false;
            } else {
                const content = this.getContent();
                if (content === value) refresh = false;
            }
        }
        if (refresh) this.setContent(value);
        this.initialContent = value;
    }

    initOt(doc) {
        this.engine.ot.init(doc, this.initialContent);
        if (!isBlank(this.initialContent)) {
            this.engine.focus();
        }
        this.editorInitialized = true;
    }

    loadDocument() {
        const connection = new sharedb.Connection(this.socket);
        connection.on('receive', event => {
            //console.log("receive", event)
        });

        const doc = connection.get('itellyou', this.options.collab.key);

        doc.subscribe(error => {
            if (error) {
                console.log('collab doc subscribe error', error);
            } else {
                try {
                    this.initOt(doc);
                    this.emit(EVENT.usersChange, this.normalizeMembers());
                    this.transmit(STATUS.active);
                } catch (err) {
                    console.log('itellyou engine init failed:', err);
                }
            }
        });

        doc.on('create', () => {
            console.log('collab doc create');
        });

        doc.on('load', () => {
            console.log('collab doc loaded');
        });

        doc.on('op', (op, type) => {
            console.log('op', op, type ? 'local' : 'server');
        });

        doc.on('del', (t, n) => {
            console.log('collab doc deleted', t, n);
        });

        doc.on('error', error => {
            console.log('collab doc error', {
                error,
                origin_code: error.code,
            });

            this.onError({
                code: ERROR_CODE.COLLAB_DOC_ERROR,
                message: error.message,
                error,
                level: this.adaptShareErrorLevel(error),
            });
        });
        this.otDoc = doc;
    }

    adaptShareErrorLevel(error) {
        return ERROR_LEVEL.NOTICE;
    }

    loadMemberData() {}

    bindEvents() {
        window.addEventListener('beforeunload', this.onPageClose);
        window.addEventListener('visibilitychange', this.onVisibilityChange);
        window.addEventListener('pagehide', this.onPageClose);
    }

    unbindEvents() {
        window.removeEventListener('beforeunload', this.onPageClose);
        window.removeEventListener('visibilitychange', this.onVisibilityChange);
        window.removeEventListener('pagehide', this.onPageClose);
    }

    addMembers(member) {
        this.users = this.users.concat(member);
        if (this.isActive()) {
            setTimeout(() => {
                this.emit(EVENT.usersChange, this.normalizeMembers());
            }, 1000);
        }
    }

    removeMember(member) {
        this.users = this.users.filter(user => {
            return user.uuid !== member.uuid;
        });
        if (this.isActive()) {
            this.emit(EVENT.usersChange, this.normalizeMembers());
        }
    }

    normalizeMembers() {
        const members = [];
        const colorMap = {};
        const users = this.engine.ot.getMembers();
        users.forEach(user => {
            colorMap[user.uuid] = user.color;
        });
        const memberMap = {};
        for (let i = this.users.length; i > 0; i--) {
            const member = this.users[i - 1];
            if (!memberMap[member.key]) {
                const cloneMember = Object.assign({}, member);
                cloneMember.color = colorMap[member.uuid];
                memberMap[member.key] = member;
                if (member.key !== this.options.me.key) {
                    members.push(cloneMember);
                }
            }
        }
        return members;
    }

    transmit(status) {
        const prevStatus = this.status;
        this.status = status;
        this.emit(EVENT.statusChange, {
            form: prevStatus,
            to: status,
        });
    }

    onError(error) {
        this.emit(EVENT.error, error);
        this.status = STATUS.error;
    }

    isActive() {
        return this.status === STATUS.active;
    }

    isNetworkError(error) {
        if (!error) return false;
        const errors = [ERROR_CODE.CONNECTION_ERROR, ERROR_CODE.DISCONNECTED];
        return errors.includes(error.code);
    }
}

CollabBiz.STATUS = STATUS;
CollabBiz.EVENT = EVENT;
CollabBiz.ERROR_CODE = ERROR_CODE;
CollabBiz.ERROR_LEVEL = ERROR_LEVEL;
CollabBiz.MESSAGE = MESSAGE;

export default CollabBiz;
