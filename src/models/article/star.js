import { list, follow, unfollow } from '@/services/article/star';
import { setList, removeItem, replaceItem } from '@/utils/model';

export default {
    namespace: 'articleStar',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { append, ...response.data },
            });
        },
        *follow({ payload }, { call, put }) {
            const response = yield call(follow, payload);
            if (response.result) {
                const detail = {
                    id: payload.id,
                    use_star: true,
                    star_count: response.data,
                };
                yield put({
                    type: 'replaceItem',
                    payload: detail,
                });
                yield put({
                    type: 'article/updateDetail',
                    payload: detail,
                });
            }
            return response;
        },
        *unfollow({ payload: { remove, ...payload } }, { call, put }) {
            const response = yield call(unfollow, payload);
            if (response.result) {
                const detail = {
                    id: payload.id,
                    use_star: false,
                    star_count: response.data,
                };

                if (remove) {
                    yield put({
                        type: 'removeItem',
                        payload: {
                            id: payload.id,
                        },
                    });
                } else {
                    yield put({
                        type: 'replaceItem',
                        payload: detail,
                    });
                    yield put({
                        type: 'article/updateDetail',
                        payload: detail,
                    });
                }
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
                    return child.article.id === item.article.id;
                },
                (old, { created_time, ...item }) => {
                    return { ...old, article: { ...old.article, ...item.article }, created_time };
                },
            );
        },
        removeItem(state, { payload }) {
            return removeItem('list', payload.id, state, (item) => {
                return item.article.id === payload.id;
            });
        },
        replaceItem(state, { payload: { created_time, ...payload } }) {
            return replaceItem(
                'list',
                payload,
                state,
                (item) => {
                    return item.article.id === payload.id;
                },
                (item) => {
                    return { ...item, article: { ...item.article, ...payload }, created_time };
                },
            );
        },
    },
};
