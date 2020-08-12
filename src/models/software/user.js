import { list, del } from '@/services/software/user';
import { setList, removeItem } from '@/utils/model';
export default {
    namespace: 'userSoftware',

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
        removeItem(state, { payload }) {
            return removeItem('list', payload, state);
        },
    },
};
