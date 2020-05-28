import { history } from 'umi';
import { adopt, list, related, find, view, del } from '@/services/question/index';
import { setList } from '@/utils/model';

export default {
    namespace: 'question',

    state: {},

    effects: {
        *adopt({ payload }, { call, put }) {
            const response = yield call(adopt, payload);
            if (response.result) {
                yield put({
                    type: 'updateDetail',
                    payload: response.data || {},
                });
                yield put({
                    type: 'answer/updateListAll',
                    payload: { allow_adopt: false },
                });
                const { answer_id } = payload;
                yield put({
                    type: 'answer/updateListItem',
                    payload: { id: answer_id, adopted: true },
                });
            }
            return response;
        },
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'setList',
                payload: { append, ...(response.data || {}) },
            });
        },
        *related({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(related, payload);
            yield put({
                type: 'setRelated',
                payload: { append, ...(response.data || {}) },
            });
        },
        *find({ payload }, { call, put }) {
            const response = yield call(find, payload);
            const { result, status, data } = response;
            if (result) {
                yield put({
                    type: 'updateDetail',
                    payload: data || {},
                });
            } else if (status > 200) {
                if (history) history.push(`/${status}`);
            }
            yield put({
                type: 'setResponseStatus',
                payload: status,
            });
            return response;
        },
        *view({ payload }, { call }) {
            const response = yield call(view, payload);
            return response;
        },
        *delete({ payload }, { call, put }) {
            const response = yield call(del, payload);
            if (response && response.result) {
                yield put({
                    type: 'userQuestion/removeItem',
                    payload: payload.id,
                });
            }
            return response;
        },
    },
    reducers: {
        updateDetail(state, { payload }) {
            return {
                ...state,
                detail: { ...state.detail, ...payload },
            };
        },
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
        setRelated(state, { payload }) {
            return setList('related', payload, state);
        },
        updateComments(state, { payload: { id, value } }) {
            const { detail } = state;
            if (detail && detail.id === id) {
                return {
                    ...state,
                    detail: { ...detail, comments: detail.comments + (value || 1) },
                };
            }
            return {
                ...state,
            };
        },
        updateListItem(state, { payload }) {
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex(item => item.id === payload.id);
            if (index >= 0) {
                data.splice(index, 1, { ...data[index], ...payload });
            }
            return {
                ...state,
                list: { ...state.list, data },
            };
        },
        setUserAnswer(state, { payload }) {
            return {
                ...state,
                user_answer: { ...state.user_answer, ...payload },
            };
        },
        setResponseStatus(state, { payload }) {
            return {
                ...state,
                response_status: payload,
            };
        },
    },
};
