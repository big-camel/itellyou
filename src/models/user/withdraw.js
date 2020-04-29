import { config, post, log } from '@/services/user/withdraw';
import { setList } from '@/utils/model';
export default {
    namespace: 'withdraw',

    state: {
        ...window.appData.withdraw,
    },
    effects: {
        *config({ payload }, { call, put }) {
            const response = yield call(config, payload);
            const { result, data } = response || {};
            if (result) {
                yield put({
                    type: 'setConfig',
                    payload: data,
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
        *post({ payload }, { call, put }) {
            const response = yield call(post, payload);

            return response;
        },
    },
    reducers: {
        setConfig(state, { payload }) {
            return {
                ...state,
                config: { ...state.config, ...payload },
            };
        },
        setLog(state, { payload }) {
            return setList('log', payload, state);
        },
    },
};
