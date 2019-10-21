import { getVersions,getVersion,getVersionDiff } from '@/services/question/version'

export default {
    namespace: 'version',

    state: {
        versions:[]
    },

    effects:{
        *list({ payload }, { call , put}){
            const response = yield call(getVersions,payload)
            if(response.result){
                yield put({
                    type: 'updateVersions',
                    payload: response.data
                })
            }
            return response.data
        },
        *get({ payload }, { call }){
            const response = yield call(getVersion,payload)
            if(response.result){
                response.data['title'] = response.data['question_title']
                response.data['content'] = response.data['question_content']
              
                return response.data
            }
            return response.data
        },
        *diff({ payload }, { call }){
            const response = yield call(getVersionDiff,payload)
            return response.data
        },
    },

    reducers:{
        updateVersions(state,{ payload }){
            return {
                ...state,
                versions:payload
            }
        }
    }
}