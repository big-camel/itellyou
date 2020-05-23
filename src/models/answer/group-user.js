import { list } from '@/services/answer/group-user';
export default {
    namespace: 'answerGroupUser',

    state: {},
    effects: {
        *list({ payload }, { call, put }) {
            const response = yield call(list, payload);
            const { result, data } = response || {};
            if (result) {
                yield put({
                    type: 'setList',
                    payload: data,
                });
            }
            return response;
        },
    },
    reducers: {
        setList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
    },
};
