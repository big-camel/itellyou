import { create , list , articleList , detail , userList , queryName } from '@/services/column/index'

export default {
    namespace: 'column',

    state: {
        list:null,
        detail:null
    },

    effects: {
        *create({ payload }, { call , put , select }){
            const response = yield call(create,payload)
            if(response && response.result){
                const user = yield select(state => state.column.user)
                if(user){
                    const data = user.data.concat()
                    data.push(response.data)
                    yield  put({
                        type:'updateUserList',
                        payload:{...user,data,total:user.total+1}
                    })
                }else{
                    yield put({
                        type:'updateUserList',
                        payload:{total:1,data:[response.data]}
                    })
                }
            }
            return response
        },
        *list({ payload } , { call , put }){
            const response = yield call(list,payload)
            yield put({
                type:'updateList',
                payload:response.data || {}
            })
        },
        *detail({ payload } , { call , put }){
            const response = yield call(detail,payload)
            yield put({
                type:'updateDetail',
                payload:response.data || {}
            })
        },
        *userList({ payload } , { call , put }){
            const response = yield call(userList,payload)
            yield put({
                type:'updateUserList',
                payload:response.data || {}
            })
        },
        *queryName({ payload }, { call }){
            const response = yield call(queryName,payload)
            return response
        }
    },
    reducers:{
        updateList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        updateUserList(state,{ payload }){
            return {
                ...state,
                user:payload
            }
        },
        updateDetail(state,{ payload }){
            return {
                ...state,
                detail:payload
            }
        },
        replaceItem(state,{ payload : { detail } }){
            const list = state.list
            if(list){
                const data = list.data.concat()
                const index = data.findIndex(item => item.id === detail.id)
                if(index >= 0){
                    const item = data[index]
                    data.splice(index,1,{...item,...detail})
                }
                
                return {
                    ...state,
                    list:{...list,data}
                }
            }
            return {
                ...state
            }
        }
    }
}