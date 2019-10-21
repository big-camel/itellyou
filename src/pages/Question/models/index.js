import { create , adopt , getList , getDetail } from '@/services/question/index'

export default {
    namespace: 'question',

    state: {
        list:null,
        detail:null,
        editStatus:null
    },

    effects: {
        *create({ payload }, { call , put}){
            const response = yield call(create,payload)
            if(response.result){
                yield put({
                    type:'updateDetail',
                    payload:response.data || {}
                })
            }
            return response
        },
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
        *getList({ payload }, { call,put }){
            const response = yield call(getList,payload)
            yield put({
                type:'listState',
                payload:response.data || {}
            })
        },
        *getDetail({ payload }, { call,put }){
            const response = yield call(getDetail,payload)
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
        listState(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        }
    }
}