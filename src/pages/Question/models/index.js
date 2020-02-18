import { adopt , list , find , view } from '../services/index'

export default {
    namespace: 'question',

    state: {
        ...window.appData.question
    },

    effects: {
        *adopt({ payload }, { call , put }){
            const response = yield call(adopt,payload)
            if(response.result){
                yield put({
                    type:'updateDetail',
                    payload:response.data || {}
                })
                yield put({
                    type:"answer/updateListAll",
                    payload:{allow_adopt:false}
                })
                const { answerId } = payload
                yield put({
                    type:"answer/updateListItem",
                    payload:{id:answerId,adopted:true}
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
        },
        *view({ payload }, { call }){
            const response = yield call( view , payload )
            return response
        }
    },
    reducers:{
        updateDetail(state,{ payload }){
            return {
                ...state,
                detail:{...state.detail,...payload}
            }
        },
        setList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        updateComments(state,{ payload:{ id, value} }){
            const { detail } = state
            if(detail && detail.id === id){
                return { ...state , detail:{...detail,comments:detail.comments + (value || 1)}}
            }
            return {
                ...state
            }
        },
        updateListItem(state,{ payload }){
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex(item => item.id === payload.id)
            if(index >= 0){
                data.splice(index,1,{...data[index],...payload})
            }
            return {
                ...state,
                list:{...state.list,data}
            }
        },
        setUserAnswer(state,{ payload }){
            return {
                ...state,
                user_answer:{...state.user_answer,...payload}
            }
        },
    }
}