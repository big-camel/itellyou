import { list } from '@/services/reward';
import { setList } from '@/utils/model';

export default {
    namespace: 'softwareReward',

    state: {},
    effects: {
        *list({ payload: { append, id, ...payload } }, { call, put }) {
            const response = yield call(list, { ...payload, data_type: 'software', data_key: id });
            yield put({
                type: 'setList',
                payload: { append, ...(response.data || {}) },
            });
        },
    },
    reducers: {
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
    },
};
