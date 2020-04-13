import defaultSettings from '../../config/defaultSettings';
export default {
    namespace: 'settings',

    state: {
        ...defaultSettings,
    },
    reducers: {
        setSettings(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
