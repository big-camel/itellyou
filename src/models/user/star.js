import { star, follower, follow, unfollow } from '@/services/user/star';
import { setList, removeItem, replaceItem } from '@/utils/model';

const setDataList = (name, state, payload) => {
    return setList(
        `${name}List`,
        payload,
        state,
        (child, item) => {
            return child[name].id === item.id;
        },
        (old, { created_time, ...item }) => {
            return { ...old, [name]: { ...old[name], ...item[name] }, created_time };
        },
    );
};

const removeDataItem = (name, state, payload) => {
    return removeItem(`${name}List`, payload, state, item => {
        return item[name].id === payload.id;
    });
};

const replaceDataItem = (name, state, { created_time, ...detail }) => {
    return replaceItem(
        `${name}List`,
        detail.id,
        state,
        item => {
            return item[name].id === detail.id;
        },
        item => {
            return { ...item, [name]: { ...item[name], ...detail }, created_time };
        },
    );
};

export default {
    namespace: 'userStar',

    state: {},

    effects: {
        *starList({ payload }, { call, put }) {
            const response = yield call(star, payload);
            yield put({
                type: 'setStarList',
                payload: response.data,
            });
            return response;
        },
        *followerList({ payload }, { call, put }) {
            const response = yield call(follower, payload);
            yield put({
                type: 'setFollowerList',
                payload: response.data,
            });
            return response;
        },
        *follow({ payload }, { call, put }) {
            const response = yield call(follow, payload);
            if (response.result) {
                const detail = {
                    id: payload.id,
                    use_star: true,
                    follower_count: response.data,
                };
                yield put({
                    type: 'replaceStarItem',
                    payload: {
                        ...detail,
                        created_time: new Date(),
                    },
                });
                yield put({
                    type: 'replaceFollowerItem',
                    payload: {
                        ...detail,
                        created_time: new Date(),
                    },
                });
                yield put({
                    type: 'user/setDetail',
                    payload: detail,
                });
            }
            return response;
        },
        *unfollow({ payload: { name, ...payload } }, { call, put }) {
            const response = yield call(unfollow, payload);
            if (response.result) {
                const detail = {
                    id: payload.id,
                    use_star: false,
                    follower_count: response.data,
                };
                yield put({
                    type: 'replaceStarItem',
                    payload: detail,
                });
                yield put({
                    type: 'replaceFollowerItem',
                    payload: detail,
                });
                yield put({
                    type: 'user/setDetail',
                    payload: detail,
                });
            }
            return response;
        },
    },

    reducers: {
        setStarList(state, { payload }) {
            return setDataList('star', state, payload);
        },
        removeStarItem(state, { payload }) {
            return removeDataItem('star', state, payload);
        },
        replaceStarItem(state, { payload }) {
            return replaceDataItem('star', state, payload);
        },
        setFollowerList(state, { payload }) {
            return setDataList('follower', state, payload);
        },
        removeFollowerItem(state, { payload }) {
            return removeDataItem('follower', state, payload);
        },
        replaceFollowerItem(state, { payload }) {
            return replaceDataItem('follower', state, payload);
        },
    },
};
