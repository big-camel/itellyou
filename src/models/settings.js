import defaultSettings from '../../config/defaultSettings';
import { getSetting, getLink } from '@/services/system';
export default {
    namespace: 'settings',

    state: {
        ...defaultSettings,
    },
    effects: {
        *systemSetting({ payload }, { call, put }) {
            const response = yield call(getSetting, payload);
            if (response && response.result) {
                yield put({
                    type: 'setSettings',
                    payload: {
                        title: response.data.name,
                        site: response.data,
                    },
                });
            }
            return response;
        },
        *systemLink({ payload }, { call, put }) {
            const response = yield call(getLink, payload);
            if (response && response.result) {
                yield put({
                    type: 'setSettings',
                    payload: {
                        links: response.data.data,
                    },
                });
            }
            return response;
        },
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
