import { alipayPrecreate, alipayQuery, log } from '@/services/user/pay';
import { setList } from '@/utils/model';
export default {
    namespace: 'pay',

    state: {},
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
        *log({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(log, payload);
            yield put({
                type: 'setLog',
                payload: { append, ...(response.data || {}) },
            });
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
        setLog(state, { payload }) {
            return setList('log', payload, state);
        },
    },
};
