import { routerRedux } from 'dva'
import { stringify } from 'qs'
import { setAuthority } from '@/utils/authority'
import { reloadAuthorized } from '@/utils/Authorized'
import { queryName , fetchMe , update , profile , logout } from '@/services/user/index'
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

        *fetchMe({ payload }, { call,put }){
            const response = yield call(fetchMe,payload)
            if(response && response.result){
                yield put({
                    type: 'setMe',
                    payload: response.data
                })
            }
            return response
        },
        *update({ payload }, { call,put }){
            const response = yield call(update,payload)
            if(response && response.result){
                yield put({
                    type: 'setMe',
                    payload: response.data
                })
            }
            return response
        },
        *profile({ payload }, { call,put }){
            const response = yield call(profile,payload)
            if(response && response.result){
                yield put({
                    type: 'setMe',
                    payload: response.data
                })
            }
            return response
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
        }
    },

    reducers:{
        setMe(state,{ payload }){
            return {
                ...state,
                me:{...state.me,...payload}
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