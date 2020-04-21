import { history } from 'umi';
import {
    find,
    findDraft,
    deleteDraft,
    deleteAnswer,
    revokeDelete,
    list,
    vote,
} from '@/services/answer/index';
import { setList } from '@/utils/model';

export default {
    namespace: 'answer',

    state: {
        ...window.appData.answer,
    },

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
                history.push(`/${status}`);
            }
            return response;
        },
        *findDraft({ payload }, { call, put, select }) {
            if (!payload) {
                const question = yield select(state => state.question);
                const detail = question ? question.detail : null;
                if (!detail) return;
                payload = { question_id: detail.id };
            }
            const response = yield call(findDraft, payload);
            if (response && response.result) {
                yield put({
                    type: 'question/setUserAnswer',
                    payload: response.data,
                });
            }
            return response;
        },
        *deleteDraft({ payload }, { call, put, select }) {
            const question = yield select(state => state.question);
            const detail = question ? question.detail : null;
            if (!detail) return;
            payload.question_id = detail.id;
            const response = yield call(deleteDraft, payload);
            if (response && response.result) {
                yield put({
                    type: 'question/setUserAnswer',
                    payload: {
                        draft: false,
                    },
                });
            }
            return response;
        },
        *delete({ payload }, { call, put, select }) {
            const response = yield call(deleteAnswer, payload);
            if (response && response.result) {
                const userAnswer = yield select(state =>
                    state.question ? state.question.user_answer : null,
                );
                const answer = yield select(state => state.answer);
                let detail = answer && answer.detail ? { ...answer.detail, deleted: true } : null;
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
                        type: 'question/setUserAnswer',
                        payload: {
                            deleted: detail.deleted,
                        },
                    });
                }
                const list = answer ? answer.list : null;
                if (list) {
                    const data = list.data;
                    const index = data.findIndex(item => item.id === detail.id);
                    data.splice(index, 1, detail);
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
                const userAnswer = yield select(state =>
                    state.question ? state.question.user_answer : null,
                );
                const answer = yield select(state => state.answer);
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
                        type: 'question/setUserAnswer',
                        payload: {
                            deleted: detail.deleted,
                            draft: true,
                        },
                    });
                }

                const list = answer ? answer.list : null;
                if (list) {
                    let data = list.data;
                    const index = data.findIndex(item => item.id === detail.id);

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
                const answer = yield select(state => state.answer);
                let detail = answer && answer.detail ? answer.detail : null;

                const setUse = item => {
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
                let list = yield select(state => (state.answer ? state.answer.list : {}));

                let dataItem = list ? list.data.find(item => item.id === response.data.id) : null;
                if (dataItem) {
                    response.data = setUse(dataItem);
                }
                yield put({
                    type: 'updateListItem',
                    payload: response.data,
                });

                list = yield select(state => (state.explore ? state.explore.recommends : null));
                dataItem = list
                    ? list.data.find(item => {
                          const { type, object } = item;
                          if (type === 'question') {
                              const answer = object.answer_list.find(
                                  answer => answer.id === payload.id,
                              );
                              if (answer) return answer;
                          }
                      })
                    : null;
                if (dataItem) {
                    response.data = setUse(dataItem);
                    yield put({
                        type: 'explore/replaceRecommendsArticle',
                        payload: {
                            ...response.data,
                        },
                    });
                }
            }
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
            const index = data.findIndex(item => item.id === id);
            if (index >= 0) {
                data.splice(index, 1, {
                    ...data[index],
                    comments: data[index].comments + (value || 1),
                });
            }
            return {
                ...state,
                list: { ...state.list, data },
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
        updateListAll(state, { payload }) {
            let data = state.list ? state.list.data || [] : [];
            data = data.map(item => {
                return { ...item, ...payload };
            });
            return {
                ...state,
                list: { ...state.list, data },
            };
        },
    },
};
