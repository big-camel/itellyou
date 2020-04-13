import { list, follow, unfollow } from '@/services/tag/star';
import { setList, removeItem, replaceItem } from '@/utils/model';

export default {
    namespace: 'tagStar',

    state: {},

    effects: {
        *list({ payload }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: response.data,
            });
        },
        *follow({ payload: { name, ...payload } }, { call, put, select }) {
            const response = yield call(follow, payload);

            if (response.result) {
                if (!name) {
                    const info = yield select(state => state.tag.detail[payload.id]);
                    name = info ? info.name : null;
                }
                const detail = {
                    id: payload.id,
                    name,
                    use_star: true,
                    star_count: response.data,
                };
                yield put({
                    type: 'setList',
                    payload: {
                        append: true,
                        end: true,
                        data: [
                            {
                                tag: detail,
                                created_time: new Date(),
                            },
                        ],
                    },
                });
                yield put({
                    type: 'tag/updateDetail',
                    payload: detail,
                });
                yield put({
                    type: 'tag/replaceItem',
                    payload: detail,
                });
            }
            return response;
        },
        *unfollow({ payload: { name, ...payload } }, { call, put, select }) {
            const response = yield call(unfollow, payload);
            if (response.result) {
                if (!name) {
                    const info = yield select(state => state.tag.detail[payload.id]);
                    name = info ? info.name : null;
                }
                const detail = {
                    id: payload.id,
                    name,
                    use_star: false,
                    star_count: response.data,
                };
                yield put({
                    type: 'replaceItem',
                    payload: detail,
                });
                yield put({
                    type: 'tag/updateDetail',
                    payload: detail,
                });
                yield put({
                    type: 'tag/replaceItem',
                    payload: detail,
                });
            }
            return response;
        },
    },

    reducers: {
        setList(state, { payload }) {
            return setList(
                'list',
                payload,
                state,
                (child, item) => {
                    return child.tag.id === item.tag.id;
                },
                (old, { created_time, ...item }) => {
                    return { ...old, tag: { ...old.tag, ...item.tag }, created_time };
                },
            );
        },
        removeItem(state, { payload }) {
            return removeItem('list', payload.id, state, item => {
                return item.tag.id === payload.id;
            });
        },
        replaceItem(state, { payload: { created_time, ...payload } }) {
            return replaceItem(
                'list',
                payload,
                state,
                item => {
                    return item.tag.id === payload.id;
                },
                item => {
                    return { ...item, tag: { ...item.tag, ...payload }, created_time };
                },
            );
        },
    },
};
