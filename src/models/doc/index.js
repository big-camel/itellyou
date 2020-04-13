import { create, find, update, revert, publish } from '@/services/doc/index';

export default {
    namespace: 'doc',

    state: {
        type: 'doc',
        ...window.appData.doc,
    },

    effects: {
        *create({ payload }, { call, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(create, { ...payload.data, type });
            if (!response.result) {
                payload.onError(response);
            }
            return response;
        },
        *find({ payload }, { call, put, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(find, { ...payload.data, type });
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
        *update({ payload }, { call, put, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(update, { ...payload.data, type });
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
        *revert({ payload }, { call, put, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(revert, { ...payload, type });
            if (response.result) {
                yield put({
                    type: 'setDetail',
                    payload: response.data || {},
                });
            }
            return response;
        },
        *publish({ payload }, { call, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(publish, { ...payload.data, type });
            if (!response.result) {
                payload.onError(response);
            }
            return response;
        },
    },

    reducers: {
        setType(state, { payload }) {
            return {
                ...state,
                type: payload,
            };
        },
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
