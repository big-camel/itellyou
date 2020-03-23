import { list } from '../../services/user/service'
export default {
    namespace: 'userActivity',

    state: {
        list:null
    },

    effects: {
        *list({ payload : { append , ...payload } }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'setList',
                payload:{append , ...(response ? response.data : {}) }
            })
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
    }
}