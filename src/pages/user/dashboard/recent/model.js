import { draft, del } from './service';
import { setList, removeItem } from '@/utils/model';
export default {
    namespace: 'draft',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(draft, payload);
            yield put({
                type: 'setList',
                payload: { append, ...(response ? response.data : {}) },
            });
            return response;
        },
        *delete({ payload }, { call, put }) {
            const response = yield call(del, payload);
            if (response && response.result) {
                yield put({
                    type: 'removeItem',
                    payload,
                });
            }
            return response;
        },
    },

    reducers: {
        setList(state, { payload }) {
            return setList('list', payload, state, (child, item) => {
                return child.data_type === item.data_type && item.data_key === child.data_key;
            });
        },
        removeItem(state, { payload }) {
            return removeItem(
                'list',
                null,
                state,
                item => item.data_type === payload.type && item.data_key === payload.key,
            );
        },
    },
};
