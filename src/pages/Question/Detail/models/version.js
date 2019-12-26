import { list,find,diff } from '../services/version'
import { getQuestionId } from "../services/doc"

export default {
    namespace: 'version',

    state: {
        list:[]
    },

    effects:{
        *list({ payload }, { call , put , select }){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.questionId = questionId

            const response = yield call(list,payload)
            if(response.result){
                yield put({
                    type: 'updateVersions',
                    payload: response.data
                })
            }
            return response
        },
        *find({ payload }, { call ,select }){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.questionId = questionId

            const response = yield call(find,payload)
            return response
        },
        *diff({ payload }, { call , select }){
            const questionId = yield getQuestionId(select)
            if(!questionId) return
            payload.questionId = questionId
            
            const response = yield call(diff,payload)
            return response
        },
    },

    reducers:{
        updateVersions(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        }
    }
}