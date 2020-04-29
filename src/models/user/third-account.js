import { find, del } from '@/services/user/third-account';
export default {
    namespace: 'thirdAccount',

    state: {
        ...window.appData.thirdAccount,
    },
    effects: {
        *find({ payload }, { call, put }) {
            const response = yield call(find, payload);
            const { result, data } = response || {};
            if (result) {
                yield put({
                    type: 'setDetail',
                    payload: data,
                });
            }
            return response;
        },
        *delete({ payload }, { call, put }) {
            const response = yield call(del, payload);
            if (response && response.result) {
                yield put({
                    type: 'updateDelete',
                    payload: payload.type,
                });
            }
            return response;
        },
    },
    reducers: {
        setDetail(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        updateDelete(state, { payload }) {
            delete state[payload];
            return {
                ...state,
            };
        },
    },
};
