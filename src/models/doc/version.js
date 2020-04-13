import { list, find, diff } from '@/services/doc/version';

export default {
    namespace: 'version',

    state: {
        list: [],
    },

    effects: {
        *list({ payload }, { call, put, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(list, { ...payload, type });
            if (response.result) {
                yield put({
                    type: 'updateVersions',
                    payload: response.data,
                });
            }
            return response;
        },
        *find({ payload }, { call, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(find, { ...payload, type });
            if (response.result) {
                return response;
            }
            return response;
        },
        *diff({ payload }, { call, select }) {
            const type = yield select(state => state.doc.type);
            const response = yield call(diff, { ...payload, type });
            return response;
        },
    },

    reducers: {
        updateVersions(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
    },
};
