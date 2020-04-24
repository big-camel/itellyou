import { info, log } from '@/services/bank';
import { setList } from '@/utils/model';
export default {
    namespace: 'bank',

    state: {
        ...window.appData.bank,
    },
    effects: {
        *info({ payload }, { call, put }) {
            const response = yield call(info, payload);
            const { result, data } = response || {};
            if (result) {
                yield put({
                    type: 'setDetail',
                    payload: data,
                });
            }
            return response;
        },
        *log({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(log, payload);
            yield put({
                type: 'setList',
                payload: { ...(response.data || {}), append },
            });
        },
    },
    reducers: {
        setDetail(state, { payload }) {
            return {
                ...state,
                detail: { ...state.detail, ...payload },
            };
        },
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
    },
};
