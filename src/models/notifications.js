import { list , count , deleted ,readed } from '@/services/notifications'
export default {
    namespace: 'notifications',

    state: {
        ...window.appData.notifications,
        groupCount:{
            count:0
        },
        list:{}
    },
    effects: {
        *count(_, { call , put }){
            const response = yield call(count)
            if(response.result){
                yield put({
                    type: 'setCount',
                    payload:response.data
                })
            }
            return response
        },
        *list({ payload : { append , action , ...payload }}, { call , put }){
            const response = yield call(list,{...payload,action})
            if(response.result){
                yield put({
                    type: 'setList',
                    payload:{ append , action , ...(response ? response.data : {}) }
                })
            }
            return response
        },
        *readed({ payload }, { call , put }){
            const response = yield call(readed,payload)
            if(response && response.result){
                yield put({
                    type: 'setGroupCount',
                    payload:{
                        count:0
                    }
                })
            }
            return response
        },
        *deleted({ payload }, { call }){
            const response = yield call(deleted,payload)
            return response
        }
    },
    reducers:{
        setCount(state,{ payload }){
            const groupCount = state.groupCount
            return {
                ...state,
                groupCount:{ ...groupCount , count:payload }
            }
        },
        setGroupCount(state,{ payload }){
            return {
                ...state,
                groupCount:payload
            }
        },
        setList(state,{ payload : { append , action , end , total , data , ...payload} }){
            const list = state.list
            if(!list || !list[action] || !append){
                return {
                    ...state,
                    list:{...list , [action]:{end , total , data , ...payload}}
                }
            }
            const dataList = list[action].data.concat()
            data.forEach(item => {
                if(!dataList.find(child => child.id === item.id)){
                    dataList.push(item)
                }
            })
            return {
                ...state,
                list:{...list,[action]:{...list[action],end,total,data:dataList}}
            }
        }
    }
}