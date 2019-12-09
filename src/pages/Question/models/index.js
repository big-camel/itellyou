import { adopt , list , find } from '@/pages/Question/services/index'

export default {
    namespace: 'question',

    state: {
        list:null,
        detail:null
    },

    effects: {
        *adopt({ payload }, { call , put }){
            const response = yield call(adopt,payload)
            if(response.result){
                yield put({
                    type:'updateDetail',
                    payload:response.data || {}
                })
            }
            return response
        },
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'setList',
                payload:response.data || {}
            })
        },
        *find({ payload }, { call,put }){
            const response = yield call(find,payload)
            yield put({
                type:'updateDetail',
                payload:response.data || {}
            })
            return response
        }
    },
    reducers:{
        updateDetail(state,{ payload }){
            return {
                ...state,
                detail:payload
            }
        },
        setList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        }
    }
}