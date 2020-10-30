export default {
    namespace: 'ad',

    state: {},
    effects: {},
    reducers: {
        setAd(state, { payload }) {
            return {
                ...state,
                detail: { ...payload },
            };
        },
    },
};
