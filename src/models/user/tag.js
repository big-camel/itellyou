import { get,follow,unfollow } from '@/services/user/tag'
export default {
    namespace: 'userTag',

    state: {},

    effects: {
        *get(_, { call,put }){
            const response = yield call(get)
            yield put({
                type: 'setTag',
                payload: response.data
            })
        },
        *follow({payload}, { call , put }){
            const response = yield call(follow,payload)
            if(response.result){
                yield put({
                    type: 'tag/updateDetail',
                    payload:{
                        ...response.data
                    }
                })
                yield put({
                    type:"tag/replaceItem",
                    payload:{
                        detail:response.data
                    }
                })
                yield put({
                    type:'addTag',
                    payload:{
                        detail:response.data
                    }
                })
            }
            return response
        },
        *unfollow({payload}, { call , put }){
            const response = yield call(unfollow,payload)
            if(response.result){
                yield put({
                    type: 'tag/updateDetail',
                    payload:{
                        ...response.data
                    }
                })
                yield put({
                    type:"tag/replaceItem",
                    payload:{
                        detail:response.data
                    }
                })
                yield put({
                    type:'removeTag',
                    payload:{
                        id:response.data.id
                    }
                })
            }
            return response
        }
    },

    reducers:{
        setTag(state,{ payload }){
            return {
                ...state,
                ...payload
            }
        },
        addTag(state,{ payload : { detail } }){
            const tag = state || {}
            const data = tag.data ? tag.data.concat() : []
            const index = data.findIndex(item => item.id === detail.id)
            if(index < 0){
                data.push(detail)
                tag.total += 1
            }
            return {...tag,data}
        },
        removeTag(state,{ payload : { id } }){
            const tag = state || {}
            const data = tag.data ? tag.data.concat() : []
            const index = data.findIndex(item => item.id === id)
            if(index >= 0){
                data.splice(index,1)
                tag.total -= 1
            }
            
            return {...tag,data}
        }
    }
}