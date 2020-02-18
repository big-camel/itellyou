import { draft , del } from './service'
export default {
    namespace: 'draft',

    state: {},

    effects: {
        *list({ payload : { append , ...payload } }, { call,put }){
            const response = yield call(draft,payload)
            yield put({
                type:'setList',
                payload:{append , ...(response ? response.data : {}) }
            })
            return response
        },
        *delete({ payload }, { call,put }){
            const response = yield call(del,payload)
            if(response && response.result){
                yield put({
                    type:'removeItem',
                    payload
                })
            }
            return response
        }
    },

    reducers:{
        setList(state,{ payload : { append , end , total , data , ...payload} }){
            const list = state.list
            if(!list || !append){
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
        removeItem(state,{ payload }){
            const data = state.list ? state.list.data || [] : [];
            const index = data.findIndex(item => item.data_type === payload.type && item.data_key === payload.key)
            if(index >= 0){
                data.splice(index,1)
            }
            return {
                ...state,
                list:{...state.list,data}
            }
        },
    }
}