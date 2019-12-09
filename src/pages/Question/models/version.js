import { list,find,diff } from '@/pages/Question/services/version'

export default {
    namespace: 'version',

    state: {
        list:[]
    },

    effects:{
        *list({ payload }, { call , put}){
            const response = yield call(list,payload)
            if(response.result){
                yield put({
                    type: 'updateVersions',
                    payload: response.data
                })
            }
            return response
        },
        *find({ payload }, { call }){
            const response = yield call(find,payload)
            if(response.result){
                return response
            }
            return response
        },
        *diff({ payload }, { call }){
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