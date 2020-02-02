import { list , find , view } from '@/services/article/index'

export default {
    namespace: 'article',

    state: {
        ...window.appData.article
    },

    effects: {
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'setList',
                payload:response.data || {}
            })
        },
        *find({ payload }, { call,put }){
            const response = yield call(find,payload)
            if(response && response.result){
                yield put({
                    type:'updateDetail',
                    payload:response.data
                })
            }
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
                detail:payload
            }
        },
        setList(state,{ payload : { end , total , data , ...payload} }){
            const list = state.list
            if(!list){
                return {
                    ...state,
                    list:{end , total , data , ...payload}
                }
            }
            const dataList = list.data.concat()
            data.forEach(item => {
                if(!dataList.find(child => child.id === item.id)){
                    dataList.push(item)
                }
            })
            return {
                ...state,
                list:{...list,end,total,data:dataList}
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
        }
    }
}