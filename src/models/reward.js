import { findConfig, list, doReward } from '@/services/reward';
import { setList } from '@/utils/model';

export default {
    namespace: 'reward',

    state: {},
    effects: {
        *findConfig({ payload }, { call, put }) {
            const response = yield call(findConfig, payload);
            if (response.result) {
                yield put({
                    type: 'setConfig',
                    payload: response.data,
                });
            }
            return response;
        },
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { append, ...(response.data || {}) },
            });
        },
        *do({ payload }, { call, put }) {
            const response = yield call(doReward, payload);
            if (response.result) {
                yield put({
                    type: 'setList',
                    payload: { append: true, data: [response.data] },
                });
            }
            return response;
        },
    },
    reducers: {
        setConfig(state, { payload }) {
            return {
                ...state,
                config: payload,
            };
        },
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
    },
};
