import { list, follow, unfollow } from '@/services/answer/star';
import { setList, removeItem, replaceItem } from '@/utils/model';

export default {
    namespace: 'answerStar',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { ...response.data, append },
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
                (child, item) => child.answer.id === item.answer.id,
                (old, item) => {
                    return {
                        ...old,
                        created_time: item.created_time,
                        answer: { ...old.answer, ...item.answer },
                    };
                },
            );
        },
        removeItem(state, { payload }) {
            return removeItem('list', null, state, (item) => item.answer.id === payload.id);
        },
        replaceItem(state, { payload: { created_time, ...payload } }) {
            return replaceItem(
                'list',
                payload,
                state,
                (item) => item.answer.id === payload.id,
                (item) => {
                    return { ...item, answer: { ...item.answer, ...payload }, created_time };
                },
            );
        },
    },
};
