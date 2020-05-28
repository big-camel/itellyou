import { history } from 'umi';
import { list, related, find, view, vote, del, paidread } from '@/services/article/index';
import { setList, replaceItem } from '@/utils/model';

export default {
    namespace: 'article',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            if (response && response.result) {
                yield put({
                    type: 'setList',
                    payload: { ...(response.data || {}), append },
                });
            }
            return response;
        },
        *related({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(related, payload);
            yield put({
                type: 'setRelated',
                payload: { append, ...(response.data || {}) },
            });
            return response;
        },
        *find({ payload }, { call, put }) {
            const response = yield call(find, payload);
            const { result, status, data } = response || {};
            if (result) {
                yield put({
                    type: 'updateDetail',
                    payload: data,
                });
            } else if (status > 200) {
                if (history) history.push(`/${status}`);
            }
            yield put({
                type: 'setResponseStatus',
                payload: status,
            });
            return response;
        },
        *view({ payload }, { call }) {
            const response = yield call(view, payload);
            return response;
        },
        *vote({ payload }, { call, put, select }) {
            const response = yield call(vote, payload);
            if (response && response.result) {
                const article = yield select(state => state.article);
                let detail = article && article.detail ? article.detail : null;

                const setUse = item => {
                    response.data['use_support'] =
                        payload.type === 'support' ? !item.use_support : false;
                    response.data['use_oppose'] =
                        payload.type === 'oppose' ? !item.use_oppose : false;
                    return response.data;
                };

                if (detail && response.data.id === detail.id) {
                    response.data = setUse(detail);
                    yield put({
                        type: 'updateDetail',
                        payload: { ...detail, ...response.data },
                    });
                }
                let list = yield select(state => (state.article ? state.article.list : null));
                let dataItem = list ? list.data.find(item => item.id === response.data.id) : null;
                if (dataItem) {
                    response.data = setUse(dataItem);
                }
                yield put({
                    type: 'updateListItem',
                    payload: response.data,
                });

                list = yield select(state => (state.explore ? state.explore.recommends : null));
                dataItem = list
                    ? list.data.find(
                          item => item.type === 'article' && item.object.id === response.data.id,
                      )
                    : null;
                if (dataItem) {
                    response.data = setUse(dataItem);
                    yield put({
                        type: 'explore/replaceRecommendsArticle',
                        payload: {
                            ...response.data,
                        },
                    });
                }
            }
            return response;
        },
        *delete({ payload }, { call, put }) {
            const response = yield call(del, payload);
            if (response && response.result) {
                yield put({
                    type: 'userArticle/removeItem',
                    payload: payload.id,
                });
            }
            return response;
        },
        *paidread({ payload }, { call, put, select }) {
            const response = yield call(paidread, payload);
            if (response && response.result) {
                const article = yield select(state => state.article);
                let detail = article && article.detail ? article.detail : null;
                yield put({
                    type: 'updateDetail',
                    payload: { ...detail, paid_read: null },
                });
            }
            return response;
        },
    },
    reducers: {
        updateDetail(state, { payload }) {
            return {
                ...state,
                detail: { ...state.detail, ...payload },
            };
        },
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
        setRelated(state, { payload }) {
            return setList('related', payload, state);
        },
        updateComments(state, { payload: { id, value } }) {
            const { detail } = state;
            if (detail && detail.id === id) {
                return {
                    ...state,
                    detail: { ...detail, comments: detail.comments + (value || 1) },
                };
            }
            return {
                ...state,
            };
        },
        updateListItem(state, { payload }) {
            return replaceItem('list', payload, state);
        },
        setResponseStatus(state, { payload }) {
            return {
                ...state,
                response_status: payload,
            };
        },
    },
};
