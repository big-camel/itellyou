import { history } from 'umi';
import {
    find,
    deleteDraft,
    deleteAnswer,
    revokeDelete,
    list,
    vote,
    view,
    paidread,
} from '@/services/answer/index';
import { setList } from '@/utils/model';

export default {
    namespace: 'answer',

    state: {},

    effects: {
        *list({ payload: { append, ...payload } }, { call, put }) {
            const response = yield call(list, payload);
            if (response && response.result) {
                yield put({
                    type: 'setList',
                    payload: { ...response.data, append },
                });
            }
            return response;
        },
        *find({ payload }, { call, put }) {
            const response = yield call(find, payload);
            const { result, status, data } = response;
            if (result) {
                yield put({
                    type: 'setDetail',
                    payload: { ...data },
                });
            } else if (status > 200) {
                if (history) history.push(`/${status}`);
            }
            yield put({
                type: 'setResponseStatus',
                payload: {
                    code: status,
                    id: payload.id,
                },
            });
            return response;
        },
        *deleteDraft({ payload }, { call, put, select }) {
            const question = yield select((state) => state.question);
            const detail = question ? question.detail : null;
            if (!detail) return;
            payload.question_id = detail.id;
            const response = yield call(deleteDraft, payload);
            if (response && response.result) {
                yield put({
                    type: 'question/updateDetail',
                    payload: {
                        ...detail,
                        user_answer: {
                            ...detail.user_answer,
                            draft: false,
                        },
                    },
                });
            }
            return response;
        },
        *delete({ payload }, { call, put, select }) {
            const response = yield call(deleteAnswer, payload);
            if (response && response.result) {
                const question = yield select((state) => state.question);
                const userAnswer = question && question.detail ? question.detail.user_answer : null;
                const answer = yield select((state) => state.answer);
                const answerDetail =
                    answer && answer.detail ? { ...answer.detail, deleted: true } : null;
                if (userAnswer && userAnswer.id === payload.id) {
                    yield put({
                        type: 'setDetail',
                        payload: answerDetail,
                    });
                }

                if (userAnswer && userAnswer.id === payload.id) {
                    yield put({
                        type: 'question/updateDetail',
                        payload: {
                            ...question.detail,
                            user_answer: {
                                ...question.detail.user_answer,
                                deleted: true,
                            },
                        },
                    });
                }
                const list = answer ? answer.list : null;
                if (list) {
                    const data = list.data.concat();
                    const index = data.findIndex((item) => item.id === payload.id);
                    data.splice(index, 1);
                    yield put({
                        type: 'setList',
                        payload: { ...list, data, total: list.total - 1 },
                    });
                }
                yield put({
                    type: 'userAnswer/removeItem',
                    payload: payload.id,
                });
            }
            return response;
        },
        *revoke({ payload }, { call, put, select }) {
            const response = yield call(revokeDelete, payload);
            if (response && response.result) {
                const question = yield select((state) => state.question);
                const userAnswer = question && question.detail ? question.detail.user_answer : null;
                const answer = yield select((state) => state.answer);
                let detail = answer && answer.detail ? { ...answer.detail, deleted: false } : null;
                if (detail && userAnswer && userAnswer.id === detail.id) {
                    yield put({
                        type: 'setDetail',
                        payload: detail,
                    });
                } else {
                    detail = response.data;
                }

                if (userAnswer && userAnswer.id === detail.id) {
                    yield put({
                        type: 'question/updateDetail',
                        payload: {
                            ...question.detail,
                            user_answer: {
                                ...question.detail.user_answer,
                                deleted: detail.deleted,
                                draft: true,
                            },
                        },
                    });
                }

                const list = answer ? answer.list : { data: [], total: 0 };
                if (list) {
                    const data = list.data.concat();
                    const index = data.findIndex((item) => item.id === detail.id);

                    if (index >= 0) {
                        data.splice(index, 1, detail);
                    } else {
                        data.push(detail);
                    }
                    yield put({
                        type: 'setList',
                        payload: { ...list, data, total: list.total + 1 },
                    });
                }
            }
            return response;
        },
        *vote({ payload }, { call, put, select }) {
            const response = yield call(vote, payload);
            if (response && response.result) {
                const answer = yield select((state) => state.answer);
                let detail = answer && answer.detail ? answer.detail : null;

                const setUse = (item) => {
                    response.data['use_support'] =
                        payload.type === 'support' ? !item.use_support : false;
                    response.data['use_oppose'] =
                        payload.type === 'oppose' ? !item.use_oppose : false;
                    return response.data;
                };

                if (detail && response.data.id === detail.id) {
                    response.data = setUse(detail);
                    yield put({
                        type: 'setDetail',
                        payload: { ...detail, ...response.data },
                    });
                }
            }
            return response;
        },
        *paidread({ payload }, { call, put, select }) {
            const response = yield call(paidread, payload);
            if (response && response.result) {
                const answer = yield select((state) => state.answer);
                let detail = answer && answer.detail ? answer.detail : null;
                yield put({
                    type: 'updateDetail',
                    payload: { ...detail, paid_read: null },
                });
            }
            return response;
        },
        *view({ payload }, { call }) {
            const response = yield call(view, payload);
            return response;
        },
    },
    reducers: {
        setDetail(state, { payload }) {
            return {
                ...state,
                detail: payload,
            };
        },
        updateDetail(state, { payload }) {
            return {
                ...state,
                detail: { ...state.detail, ...payload },
            };
        },
        setDraft(state, { payload }) {
            return {
                ...state,
                draft: payload,
            };
        },
        setList(state, { payload }) {
            return setList('list', payload, state);
        },
        updateComments(state, { payload: { id, value } }) {
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex((item) => item.id === id);
            if (index >= 0) {
                data.splice(index, 1, {
                    ...data[index],
                    comment_count: data[index].comment_count + (value || 1),
                });
            }
            return {
                ...state,
                list: { ...state.list, data },
            };
        },
        updateListItem(state, { payload }) {
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex((item) => item.id === payload.id);
            if (index >= 0) {
                data.splice(index, 1, { ...data[index], ...payload });
            }
            return {
                ...state,
                list: { ...state.list, data },
            };
        },
        updateListAll(state, { payload }) {
            let data = state.list ? state.list.data || [] : [];
            data = data.map((item) => {
                return { ...item, ...payload };
            });
            return {
                ...state,
                list: { ...state.list, data },
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
