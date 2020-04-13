import { list } from './service';
import { setList } from '@/utils/model';
export default {
    namespace: 'userQuestion',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { append, ...(response ? response.data : {}) },
            });
            return response;
        },
    },

    reducers: {
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
    },
};
