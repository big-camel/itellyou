import { list,find,diff } from '../services/version'
import { getQuestionId } from "../services/doc"

export default {
    namespace: 'version',

    state: {
        list:[]
    },

    effects:{
        *list({ payload }, { call , put , select }){
            const question_id = yield getQuestionId(select)
            if(!question_id) return
            payload.question_id = question_id

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
            const question_id = yield getQuestionId(select)
            if(!question_id) return
            payload.question_id = question_id

            const response = yield call(find,payload)
            return response
        },
        *diff({ payload }, { call , select }){
            const question_id = yield getQuestionId(select)
            if(!question_id) return
            payload.question_id = question_id
            
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