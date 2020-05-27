import { recommends, writer, answerer } from './service';
import { setList, replaceItem } from '@/utils/model';
export default {
    namespace: 'explore',

    state: {},
    effects: {
        *recommends({ payload: { append, ...payload } }, { call, put, select }) {
            const data = yield select(state => state.explore.recommends);
            if (data && data.offset === payload.offset) return;

            const response = yield call(recommends, payload);
            if (response && response.result) {
                yield put({
                    type: 'setRecommends',
                    payload: { append, ...response.data },
                });
            }
            return response;
        },
        *writer({ payload: { append, ...payload } }, { call, put, select }) {
            const data = yield select(state => state.explore.writer);
            if (data && data.offset === payload.offset) return;

            const response = yield call(writer, payload);
            if (response && response.result) {
                yield put({
                    type: 'setWriter',
                    payload: response.data,
                });
            }
            return response;
        },
        *answerer({ payload: { append, ...payload } }, { call, put, select }) {
            const data = yield select(state => state.explore.answerer);
            if (data && data.offset === payload.offset) return;
            const response = yield call(answerer, payload);
            if (response && response.result) {
                yield put({
                    type: 'setAnswerer',
                    payload: response.data,
                });
            }
            return response;
        },
    },
    reducers: {
        setRecommends(state, { payload }) {
            return setList('recommends', payload, state, (child, item) => {
                if (child.type === 'article' && item.type === 'article')
                    return child.object.id === item.object.id;
                if (child.type === 'question' && item.type === 'question') {
                    return child.object.answer_list.find(answer => {
                        return item.object.answer_list.find(
                            itemAnswer => answer.id === itemAnswer.id,
                        );
                    });
                }
            });
        },
        replaceRecommendsArticle(state, { payload }) {
            return replaceItem(
                'recommends',
                payload,
                state,
                item => {
                    return item.type === 'article' && item.object.id === payload.id;
                },
                item => {
                    return { ...item, object: { ...item.object, ...payload } };
                },
            );
        },
        replaceRecommendsAnswer(state, { payload }) {
            return replaceItem(
                'recommends',
                payload,
                state,
                item => {
                    return (
                        item.type === 'question' &&
                        item.object.answer_list.find(answer => answer.id === payload.id)
                    );
                },
                item => {
                    const answer_list = item.object.answer_list.map(answer => {
                        return answer.id === payload.id ? { ...answer, ...payload } : answer;
                    });
                    return { ...item, object: { ...item.object, answer_list, ...payload } };
                },
            );
        },
        setWriter(state, { payload }) {
            return setList('writer', payload, state);
        },
        setAnswerer(state, { payload }) {
            return setList('answerer', payload, state);
        },
    },
};
