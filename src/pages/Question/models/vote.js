import { support , oppose } from '@/pages/Question/services/vote'

export default {
    namespace: 'vote',

    state: {
    },

    effects: {
        *support({ payload }, { call , select , put }){
            const response = yield call( support , payload )
            if(response.result){
                yield put({
                    type:'comment/setItem',
                    payload:response.data
                })
            }
            return response
        },
        *oppose({ payload }, { call , select , put }){
            const response = yield call(oppose,payload)
            if(response.result){
                yield put({
                    type:'comment/setItem',
                    payload:response.data
                })
            }
            return response
        }
    },
    reducers:{
    }
}