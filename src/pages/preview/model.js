import { getURL } from './service';
export default {
    namespace: 'preview',

    state: {
        urls: {},
    },

    effects: {
        *getURL({ payload }, { call, put }) {
            const response = yield call(getURL, payload);
            yield put({
                type: 'setURL',
                payload: { key: payload.key, data: response.data },
            });
            return response;
        },
    },

    reducers: {
        setURL(state, { payload: { key, data } }) {
            return {
                ...state,
                [key]: data,
            };
        },
    },
};
