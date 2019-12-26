import { create , draft , update , rollback , publish , getQuestionId } from '../services/doc'

export default {
    namespace: 'doc',

    state:window.appData.doc || null,

    effects:{
        *create({ payload }, { call , select }){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.data.questionId = questionId

            const response = yield call(create,payload.data)
            if(!response.result){
                payload.onError(response)
            }
            return response
        },
        *draft({ payload }, { call,put , select}){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.data.questionId = questionId

            const response = yield call(draft,payload.data)
            if(response.result){
                yield put({
                    type:'setDetail',
                    payload:response.data
                })
            }else{
                payload.onError(response)
            }
            return response
        },
        *update({ payload }, { call , put , select }){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.data.questionId = questionId

            const response = yield call(update,payload.data)
            if(response.result){
                yield put({
                    type:'setDetail',
                    payload:response.data
                })
            }else{
                payload.onError(response)
            }
            return response
        },
        *rollback({ payload }, { call , put , select }){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.data.questionId = questionId

            const response = yield call(rollback,payload.data)
            if(!response.result){
                payload.onError(response)
            }else{
                yield put({
                    type:'setDetail',
                    payload:response.data || {}
                })
            }
            return response
        },
        *publish({ payload }, { call , select }){
           const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.data.questionId = questionId

            const response = yield call(publish,payload.data)
            if(!response.result){
                payload.onError(response)
            }
            return response
        }
    },

    reducers:{
        setDetail(state,{ payload }){
            state = state || {}
            return {
                ...state,
                ...payload
            }
        },
        clearDetail(){
            return null
        }
    }
}