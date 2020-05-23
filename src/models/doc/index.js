import { history } from 'umi';
import { create, find, update, meta, paidread, revert, publish } from '@/services/doc/index';

export default {
    namespace: 'doc',

    state: {
        type: 'doc',
    },

    effects: {
        *create({ payload: { data, type } }, { call }) {
            const response = yield call(create, { ...data, type });
            if (!response.result) {
                payload.onError(response);
            }
            return response;
        },
        *find({ payload: { data, type } }, { call, put }) {
            const response = yield call(find, { ...data, type });
            const { result, status } = response;
            if (result) {
                yield put({
                    type: 'setDetail',
                    payload: response.data,
                });
            } else if (status > 200) {
                history.push(`/${status}`);
            } else {
                payload.onError(response);
            }
            return response;
        },
        *update({ payload: { data, type } }, { call, put }) {
            const response = yield call(update, { ...data, type });
            if (response.result) {
                yield put({
                    type: 'setDetail',
                    payload: response.data,
                });
            } else {
                payload.onError(response);
            }
            return response;
        },
        *meta({ payload: { data, onError, type } }, { call, put }) {
            const response = yield call(meta, { ...data, type });
            if (response.result) {
                yield put({
                    type: 'setDetail',
                    payload: response.data,
                });
            } else if (onError) {
                onError(response);
            }
            return response;
        },
        *revert({ payload }, { call, put }) {
            const response = yield call(revert, payload);
            if (response.result) {
                yield put({
                    type: 'setDetail',
                    payload: response.data || {},
                });
            }
            return response;
        },
        *publish({ payload: { data, type } }, { call, select }) {
            const response = yield call(publish, { ...data, type });
            if (!response.result) {
                payload.onError(response);
            }
            return response;
        },
        *paidread({ payload: { data, onError, type } }, { call, put }) {
            const response = yield call(paidread, { ...data, type });
            if (response.result) {
                yield put({
                    type: 'setDetail',
                    payload: response.data,
                });
            } else if (onError) {
                onError(response);
            }
            return response;
        },
    },

    reducers: {
        setDetail(state, { payload }) {
            state = state || {};
            return {
                ...state,
                detail: payload,
            };
        },
        clearDetail(state) {
            return {
                ...state,
                detail: null,
            };
        },
    },
};
