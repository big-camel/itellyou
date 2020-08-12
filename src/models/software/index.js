import { list, find, view, vote, del } from '@/services/software/index';
import { setList } from '@/utils/model';

export default {
    namespace: 'software',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
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
                const software = yield select((state) => state.software);
                let detail = software && software.detail ? software.detail : null;

                const setUse = (item) => {
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
                let list = yield select((state) => (state.software ? state.software.list : null));
                let dataItem = list ? list.data.find((item) => item.id === response.data.id) : null;
                if (dataItem) {
                    response.data = setUse(dataItem);
                }
                yield put({
                    type: 'updateListItem',
                    payload: response.data,
                });
            }
            return response;
        },
        *delete({ payload }, { call, put }) {
            const response = yield call(del, payload);
            if (response && response.result) {
                yield put({
                    type: 'userSoftware/removeItem',
                    payload: payload.id,
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
