import { alipayPrecreate, alipayQuery } from '@/services/pay';
export default {
    namespace: 'pay',

    state: {
        ...window.appData.pay,
    },
    effects: {
        *alipayPrecreate({ payload }, { call, put }) {
            const response = yield call(alipayPrecreate, payload);
            const { result, data } = response || {};
            if (result) {
                yield put({
                    type: 'setAlipay',
                    payload: { ...data },
                });
            }
            return response;
        },
        *alipayQuery({ payload }, { call, put }) {
            const response = yield call(alipayQuery, payload);
            const { result, data } = response || {};
            if (result) {
                yield put({
                    type: 'setAlipay',
                    payload: { ...data },
                });
            }
            return response;
        },
    },
    reducers: {
        setAlipay(state, { payload }) {
            return {
                ...state,
                alipay: { ...state.alipay, ...payload },
            };
        },
    },
};
