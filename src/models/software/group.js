import { list } from '@/services/software/group';
import { setList } from '@/utils/model';

export default {
    namespace: 'softwareGroup',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { append, ...(response.data || {}) },
            });
            return response
        }
    },
    reducers: {
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
    }
}