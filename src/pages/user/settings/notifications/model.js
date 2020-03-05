
import { list , set } from './service'

export default {
    namespace: 'notificationsSettings',

    state: {
        list:[]
    },

    effects: {
        *list({ payload }, { call , put}){
            const response = yield call(list,payload)
            const { result , data } = response || {}
            if(result){
                yield put({
                    type:"setList",
                    payload:data
                })
            }
            return response
        },
        *set({ payload }, { call , put }){
            const response = yield call(set,payload)
            if(response && response.result){
                yield put({
                    type:"updateItem",
                    payload:payload
                })
            }
            return response
        }
    },
    reducers:{
        setList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        updateItem(state,{payload:{ action , type , ...payload}}){
            const list = state.list.concat()
            const index = list.find(item => item.action === action && item.type === type)
            if(index >= 0){
                list.splice(index,1,{...list[index] , ...payload })
                return {
                    ...state,
                    list:list
                }
            }
            return {...state}
        }
    }
}