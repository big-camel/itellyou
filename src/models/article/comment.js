import { getRoot, getChild, deleteComment, create, vote } from '@/services/article/comment';
export default {
    namespace: 'articleComment',
    state: {},
    effects: {
        *create({ payload }, { call, put }) {
            const response = yield call(create, payload);
            if (response && response.result) {
                const { replyId } = payload;
                yield put({
                    type: 'addItem',
                    payload: {
                        type: 'list',
                        articleId: payload.articleId,
                        detail: response.data,
                        to: replyId,
                    },
                });
                yield put({
                    type: 'addItem',
                    payload: {
                        type: 'detail',
                        articleId: payload.articleId,
                        detail: response.data,
                        to: replyId,
                    },
                });
            }

            return response;
        },
        *delete({ payload }, { call, put }) {
            const response = yield call(deleteComment, payload);
            if (response && response.result) {
                yield put({
                    type: 'replaceItem',
                    payload: { type: 'list', articleId: payload.articleId, detail: response.data },
                });
                yield put({
                    type: 'replaceItem',
                    payload: {
                        type: 'detail',
                        articleId: payload.articleId,
                        detail: response.data,
                    },
                });
            }
            return response;
        },
        *root({ payload }, { call, put }) {
            const response = yield call(getRoot, payload);
            if (response && response.result) {
                yield put({
                    type: 'setList',
                    payload: { type: 'list', articleId: payload.articleId, data: response.data },
                });
            }
            return response;
        },
        *child({ payload }, { call, put }) {
            const { append, ...params } = payload;
            const response = yield call(getChild, params);
            if (response && response.result) {
                const { articleId, id } = params;
                yield put({
                    type: 'addChild',
                    payload: {
                        articleId,
                        id,
                        append,
                        childs: response.data,
                    },
                });
            }
            return response;
        },
        *childDetail({ payload }, { call, put }) {
            const { append, ...params } = payload;
            const response = yield call(getChild, params);
            if (response && response.result) {
                const { articleId, id } = params;
                const type = 'detail';
                if (payload.hasDetail === true) {
                    yield put({
                        type: 'setList',
                        payload: { type, articleId, data: response.data },
                    });
                } else {
                    yield put({
                        type: 'addChild',
                        payload: {
                            articleId,
                            type,
                            id,
                            append,
                            childs: response.data,
                        },
                    });
                }
            }
            return response;
        },
        *vote({ payload }, { call, put }) {
            const response = yield call(vote, payload);
            if (response && response.result) {
                const { articleId, type } = payload;
                const { id, parent_id, support, oppose } = response.data;
                const replaceDetail = item => {
                    return {
                        use_support: type === 'support' ? !item.use_support : false,
                        use_oppose: type === 'oppose' ? !item.use_oppose : false,
                        support,
                        oppose,
                    };
                };
                yield put({
                    type: 'replaceItem',
                    payload: {
                        type: 'list',
                        detail: {
                            articleId,
                            id,
                            parent_id,
                        },
                        callback: replaceDetail,
                    },
                });
                yield put({
                    type: 'replaceItem',
                    payload: {
                        type: 'detail',
                        detail: {
                            articleId,
                            id,
                            parent_id,
                        },
                        callback: replaceDetail,
                    },
                });
            }
            return response;
        },
    },
    reducers: {
        setList(state, { payload: { type, articleId, data } }) {
            return {
                ...state,
                [articleId]: { ...state[articleId], [type]: data },
            };
        },
        addItem(state, { payload: { type, articleId, detail, to } }) {
            const list = state && state[articleId] ? state[articleId][type] : null;
            if (list) {
                const data = list.data.concat();
                list.comments += 1;
                if (detail.parent_id && detail.parent_id > 0 && type !== 'detail') {
                    const parent = data.find(item => item.id === detail.parent_id);
                    if (parent) {
                        if (to && to > 0) {
                            let index = parent.child.findIndex(child => child.id === to);
                            index =
                                index < 0
                                    ? 0
                                    : index >= parent.child.length - 1
                                    ? parent.child.length
                                    : index + 1;
                            parent.child.splice(index, 0, detail);
                        } else {
                            parent.child.splice(0, 0, detail);
                        }
                    }
                } else {
                    if (to && to > 0) {
                        let index = data.findIndex(child => child.id === to);
                        index = index < 0 ? 0 : index >= data.length - 1 ? data.length : index + 1;
                        data.splice(index, 0, detail);
                    } else {
                        data.splice(0, 0, detail);
                    }
                }
                const newList = { ...list, data };
                if (type === 'detail' && list.detail && list.detail.id === detail.id) {
                    newList.detail.comments += 1;
                }
                return {
                    ...state,
                    [articleId]: { ...state[articleId], [type]: newList },
                };
            }
            return {
                ...state,
            };
        },
        replaceItem(state, { payload: { type, articleId, detail, ...payload } }) {
            const list = state && state[articleId] ? state[articleId][type] : null;
            if (list) {
                const { parent_id } = detail;
                const replaceCallback = payload.callback;
                const data = list.data.concat();
                if (parent_id && parent_id > 0 && type !== 'detail') {
                    const parent = data.find(item => item.id === parent_id);
                    if (parent) {
                        const index = parent.child.findIndex(child => child.id === detail.id);
                        if (index >= 0) {
                            const item = parent.child[index];
                            if (typeof replaceCallback === 'function') {
                                detail = replaceCallback(item);
                            }
                            parent.child.splice(index, 1, { ...item, ...detail });
                        }
                    }
                } else {
                    const index = data.findIndex(item => item.id === detail.id);
                    if (index >= 0) {
                        const item = data[index];
                        if (typeof replaceCallback === 'function') {
                            detail = replaceCallback(item);
                        }
                        data.splice(index, 1, { ...item, ...detail });
                    }
                }

                const newList = { ...list, data };
                if (type === 'detail' && list.detail && list.detail.id === detail.id) {
                    if (typeof replaceCallback === 'function') {
                        detail = replaceCallback(list.detail);
                    }
                    newList.detail = { ...list.detail, ...detail };
                }
                return {
                    ...state,
                    [articleId]: { ...state[articleId], [type]: newList },
                };
            }
            return {
                ...state,
            };
        },
        addChild(state, { payload: { type, articleId, id, append, childs } }) {
            const list = state && state[articleId] ? state[articleId][type] : null;
            if (list) {
                let data = list.data.concat();
                const item = data.find(item => item.id === id);
                if ((item || type === 'detail') && childs) {
                    if (append === true) {
                        childs.data.map(child => {
                            if (type === 'detail') {
                                if (!data.find(c => child.id === c.id)) {
                                    data.push(child);
                                }
                            } else if (!item.child.find(c => child.id === c.id)) {
                                item.child.push(child);
                            }
                        });
                    } else if (type === 'detail') {
                        data = childs.data;
                    } else {
                        item.child = childs.data;
                    }
                    const { start, end } = childs;
                    return {
                        ...state,
                        [articleId]: { ...state[articleId], [type]: { ...list, data, start, end } },
                    };
                }
            }
            return {
                ...state,
            };
        },
    },
};
