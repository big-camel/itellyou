import { getRoot, getChild, deleteComment, create, vote } from '@/services/question/comment';
export default {
    namespace: 'questionComment',

    state: {},
    effects: {
        *create({ payload }, { call, put }) {
            const response = yield call(create, payload);
            if (response && response.result) {
                const { replyId } = payload;
                yield put({
                    type: 'addItem',
                    payload: {
                        question_id: payload.question_id,
                        detail: response.data,
                        to: replyId,
                    },
                });
                yield put({
                    type: 'addItem',
                    payload: { question_id: 'detail', detail: response.data, to: replyId },
                });
                yield put({
                    type: 'question/updateComments',
                    payload: {
                        id: payload.question_id,
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
                    payload: { question_id: payload.question_id, detail: response.data },
                });
                yield put({
                    type: 'replaceItem',
                    payload: { question_id: 'detail', detail: response.data },
                });
            }
            return response;
        },
        *root({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(getRoot, payload);
            if (response && response.result) {
                yield put({
                    type: 'setList',
                    payload: { question_id: payload.question_id, append, data: response.data },
                });
            }
            return response;
        },
        *child({ payload }, { call, put }) {
            const { append, ...params } = payload;
            const response = yield call(getChild, params);
            if (response && response.result) {
                const { question_id, id } = params;
                yield put({
                    type: 'addChild',
                    payload: {
                        question_id,
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
                const { id } = params;
                const question_id = 'detail';
                if (payload.hasDetail === true) {
                    yield put({
                        type: 'setList',
                        payload: { question_id, data: response.data },
                    });
                } else {
                    yield put({
                        type: 'addChild',
                        payload: {
                            question_id,
                            id,
                            append,
                            childs: response.data,
                        },
                    });
                }
            }
            return response;
        },
        *vote({ payload }, { call, put, select }) {
            const response = yield call(vote, payload);
            if (response && response.result) {
                const { question_id, type } = payload;
                const { id, parent_id, support_count, oppose_count } = response.data;
                const replaceDetail = (item) => {
                    return {
                        use_support: type === 'support' ? !item.use_support : false,
                        use_oppose: type === 'oppose' ? !item.use_oppose : false,
                        support_count,
                        oppose_count,
                    };
                };
                yield put({
                    type: 'replaceItem',
                    payload: {
                        question_id,
                        detail: {
                            id,
                            parent_id,
                        },
                        callback: replaceDetail,
                    },
                });
                yield put({
                    type: 'replaceItem',
                    payload: {
                        question_id: 'detail',
                        detail: {
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
        setList(state, { payload: { question_id, append, data } }) {
            const list = state ? state[question_id] : null;
            if (append && list) {
                data.data.forEach((item) => {
                    if (!list.data.find((child) => child.id === item.id)) {
                        list.data.push(item);
                    }
                });
                list.total = data.total;
                //list.start = data.start
                list.end = data.end;
                return {
                    ...state,
                    [question_id]: { ...list },
                };
            }
            return {
                ...state,
                [question_id]: data,
            };
        },
        addItem(state, { payload: { question_id, detail, to } }) {
            const list = state ? state[question_id] : null;
            if (list) {
                const data = list.data.concat();
                list.comment_count += 1;
                if (detail.parent_id && detail.parent_id > 0 && question_id !== 'detail') {
                    const parent = data.find((item) => item.id === detail.parent_id);
                    if (parent) {
                        if (to && to > 0) {
                            let index = parent.child.findIndex((child) => child.id === to);
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
                        let index = data.findIndex((child) => child.id === to);
                        index = index < 0 ? 0 : index >= data.length - 1 ? data.length : index + 1;
                        data.splice(index, 0, detail);
                    } else {
                        data.splice(0, 0, detail);
                    }
                }
                const newList = { ...list, data };
                if (question_id === 'detail' && list.detail && list.detail.id === detail.id) {
                    newList.detail.comment_count += 1;
                }
                return {
                    ...state,
                    [question_id]: newList,
                };
            }
            return {
                ...state,
            };
        },
        replaceItem(state, { payload: { question_id, detail, ...payload } }) {
            const list = state ? state[question_id] : null;
            if (list) {
                const { parent_id } = detail;
                const replaceCallback = payload.callback;
                const data = list.data.concat();
                if (parent_id && parent_id > 0 && question_id !== 'detail') {
                    const parent = data.find((item) => item.id === parent_id);
                    if (parent) {
                        const index = parent.child.findIndex((child) => child.id === detail.id);
                        if (index >= 0) {
                            const item = parent.child[index];
                            if (typeof replaceCallback === 'function') {
                                detail = replaceCallback(item);
                            }
                            parent.child.splice(index, 1, { ...item, ...detail });
                        }
                    }
                } else {
                    const index = data.findIndex((item) => item.id === detail.id);
                    if (index >= 0) {
                        const item = data[index];
                        if (typeof replaceCallback === 'function') {
                            detail = replaceCallback(item);
                        }
                        data.splice(index, 1, { ...item, ...detail });
                    }
                }

                const newList = { ...list, data };
                if (question_id === 'detail' && list.detail && list.detail.id === detail.id) {
                    if (typeof replaceCallback === 'function') {
                        detail = replaceCallback(list.detail);
                    }
                    newList.detail = { ...list.detail, ...detail };
                }
                return {
                    ...state,
                    [question_id]: newList,
                };
            }
            return {
                ...state,
            };
        },
        addChild(state, { payload: { question_id, id, append, childs } }) {
            const list = state ? state[question_id] : null;
            if (list) {
                let data = list.data.concat();
                const item = data.find((item) => item.id === id);
                if ((item || question_id === 'detail') && childs) {
                    if (append === true) {
                        childs.data.map((child) => {
                            if (question_id === 'detail') {
                                if (!data.find((c) => child.id === c.id)) {
                                    data.push(child);
                                }
                            } else if (!item.child.find((c) => child.id === c.id)) {
                                item.child.push(child);
                            }
                        });
                    } else if (question_id === 'detail') {
                        data = childs.data;
                    } else {
                        item.child = childs.data;
                    }
                    const { start, end } = childs;
                    return {
                        ...state,
                        [question_id]: { ...list, data, start, end },
                    };
                }
            }
            return {
                ...state,
            };
        },
    },
};
