import { post } from '@/services/report';
export default {
    namespace: 'report',

    state: {},
    effects: {
        *post({ payload }, { call, put }) {
            const response = yield call(post, payload);
            return response;
        },
    },
    reducers: {},
};
