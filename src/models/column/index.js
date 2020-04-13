import { create, list, setting, detail, queryName } from '@/services/column/index';
import { setList, replaceItem } from '@/utils/model';

export default {
    namespace: 'column',

    state: {
        list: null,
        detail: null,
    },

    effects: {
        *create({ payload }, { call, put, select }) {
            const response = yield call(create, payload);
            if (response && response.result) {
                const list = yield select(state => state.column.list) || {
                    total: 1,
                    start: true,
                    end: true,
                };
                yield put({
                    type: 'setList',
                    payload: { append: true, ...list, data: [response.data] },
                });
            }
            return response;
        },
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { append, ...response.data },
            });
        },
        *detail({ payload }, { call, put }) {
            const response = yield call(detail, payload);
            yield put({
                type: 'updateDetail',
                payload: response.data || {},
            });
        },
        *setting({ payload }, { call, put }) {
            const response = yield call(setting, payload);
            yield put({
                type: 'updateDetail',
                payload: response.data || {},
            });
            return response;
        },
        *queryName({ payload }, { call }) {
            const response = yield call(queryName, payload);
            return response;
        },
    },
    reducers: {
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
        updateDetail(state, { payload }) {
            return {
                ...state,
                detail: { ...state.detail, ...payload },
            };
        },
        replaceItem(state, { payload: { detail } }) {
            return replaceItem('list', detail, state);
        },
    },
};
