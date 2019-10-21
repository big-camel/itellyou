import { create , get , setLock , delLock , getLock , update , rollback , publish } from '@/services/question/doc'

export default {
    namespace: 'doc',

    state: {},

    effects:{
        *create({ payload }, { call , put}){
            const response = yield call(create,payload)
            if(response.result){
                const { question_id , question_title , question_content  } = response.data
                response.data = Object.assign({} , response.data , { doc_id : question_id , title : question_title , content : question_content })
                yield put({
                    type:'updateDetail',
                    payload:response.data || {}
                })
            }
            return response
        }
        ,
        *get({ payload }, { call,put }){
            const response = yield call(get,payload)
            if(response.result){
                const { question_id , question_title , question_content  } = response.data
                response.data = Object.assign({} , response.data , { doc_id : question_id , title : question_title , content : question_content })
                yield put({
                    type:'updateDetail',
                    payload:response.data || {}
                })
            }
            return response
        },
        *setLock({ payload }, { call , put }){
            const response = yield call(setLock,payload)
            put({
                type: 'updateEditStatus',
                payload: response
            })
            return response
        },
        *delLock({ payload }, { call , put}){
            const response = yield call(delLock,payload)
            put({
                type: 'updateEditStatus',
                payload: response
            })
            return response
        },
        *getLock({ payload }, { call , put }){
            const response = yield call(getLock,payload)
            put({
                type: 'updateEditStatus',
                payload: response
            })
            return response
        },
        *update({ payload }, { call , put}){
            const response = yield call(update,payload)
            if(response.result){
                const { question_id , question_title , question_content  } = response.data
                response.data = Object.assign({} , response.data , { doc_id : question_id , title : question_title , content : question_content })
                yield put({
                    type:'updateDetail',
                    payload:response.data || {}
                })
            }
            return response
        },
        *rollback({ payload }, { call }){
            const response = yield call(rollback,payload)
            return response
        },
        *publish({ payload }, { call }){
            const response = yield call(publish,payload)
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
        updateEditStatus(state, { payload }){
            const { data , code } = payload
            const editStatus = { ...data , code : typeof(code) === "number" ? null : code }
            return {
                ...state,
                editStatus
            }
        }
    }
}