import { list } from './service';

export default {
    namespace: 'search',

    state: {
        ...window.appData.search,
    },
    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            if (response && response.result) {
                yield put({
                    type: 'setList',
                    payload: {
                        append,
                        ...response.data,
                    },
                });
            }
            return response;
        },
    },
    reducers: {
        setList(state, { payload: { append, end, total, data, ...payload } }) {
            const list = state.list;
            if (!list || !append) {
                return {
                    ...state,
                    list: { end, total, data, ...payload },
                };
            }
            const dataList = list.data.concat();
            data.forEach(item => {
                if (!dataList.find(child => child.id === item.id)) {
                    dataList.push(item);
                }
            });
            return {
                ...state,
                list: { ...list, end, total, data: dataList },
            };
        },
        updateListItem(state, { payload }) {
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex(
                item => item.id === payload.id && item.type === payload.type,
            );
            if (index >= 0) {
                data.splice(index, 1, { ...data[index], ...payload });
            }
            return {
                ...state,
                list: { ...state.list, data },
            };
        },
    },
};
