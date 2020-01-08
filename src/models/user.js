import { routerRedux } from 'dva'
import { stringify } from 'qs'
import { setAuthority } from '@/utils/authority'
import { reloadAuthorized } from '@/utils/Authorized'
import { queryName,fetchMe,getTag,followTag,unfollowTag , logout } from '@/services/user'
export default {
    namespace: 'user',

    state: {
        me:window.appData.me
    },

    effects: {
        *queryName({ payload }, { call }){
            const response = yield call(queryName,payload)
            return response
        },

        *fetchMe(_, { call,put }){
            const response = yield call(fetchMe)
            yield put({
                type: 'setMe',
                payload: response
            })
        },
        *logout(_, { call,put }){
            const response = yield call(logout)
            yield put({
                type: 'setMe',
                payload: null
            })
            setAuthority({
                authority:'guest'
            })
            reloadAuthorized()
            // redirect
            if (window.location.pathname !== '/user/login') {
                yield put(
                    routerRedux.replace({
                        pathname: '/user/login',
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    })
                )
            }
            return response
        },
        *tag(_, { call,put }){
            const response = yield call(getTag)
            yield put({
                type: 'setTag',
                payload: response.data
            })
        },
        *followTag({payload}, { call , put }){
            const response = yield call(followTag,payload)
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
        *unfollowTag({payload}, { call , put }){
            const response = yield call(unfollowTag,payload)
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
                tag:{...state.tag,...payload}
            }
        },
        addTag(state,{ payload : { detail } }){
            const tag = state.tag || {}
            const data = tag.data ? tag.data.concat() : []
            const index = data.findIndex(item => item.id === detail.id)
            if(index < 0){
                data.push(detail)
                tag.total += 1
            }
            return {
                ...state,
                tag:{...tag,data}
            }
        },
        removeTag(state,{ payload : { id } }){
            const tag = state.tag || {}
            const data = tag.data ? tag.data.concat() : []
            const index = data.findIndex(item => item.id === id)
            if(index >= 0){
                data.splice(index,1)
                tag.total -= 1
            }
            
            return {
                ...state,
                tag:{...tag,data}
            }
        },
        setMe(state,{ payload }){
            return {
                ...state,
                me:payload.data
            }
        },
        setBank(state,{payload}){
            const { me } = state
            me.bank = Object.assign({},me.bank,payload)
            return {
                ...state,
                me
            }
        }
    }
}