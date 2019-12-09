import { routerRedux } from 'dva'
import { stringify } from 'qs'
import { setAuthority } from '@/utils/authority'
import { reloadAuthorized } from '@/utils/Authorized'
import { queryName,fetchMe,getTag,setTag,delTag , logout } from '@/services/user'
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
        *getTag(_, { call,put }){
            const response = yield call(getTag)
            yield put({
                type: 'setTag',
                payload: response.data
            })
        },
        *setTag({payload}, { call,put , select }){
            const response = yield call(setTag,payload)
            if(response.result){
                const tag = yield select(state => state.tag)
                if(tag.detail && payload.tags.indexOf(tag.detail.tag_id) >= 0){
                    yield put({
                        type: 'tag/updateDetail',
                        payload:{
                            ...tag.detail,
                            star:true,
                            star_count:tag.detail.star_count + 1
                        }
                    })
                }
            }
            yield put({
                type: 'setTag',
                payload: response.data
            })
            return response
        },
        *delTag({payload}, { call,put , select }){
            const response = yield call(delTag,payload)
            if(response.result){
                const tag = yield select(state => state.tag)
                if(tag.detail && payload.tags.indexOf(tag.detail.tag_id) >= 0){
                    yield put({
                        type: 'tag/updateDetail',
                        payload: {
                            ...tag.detail,
                            star:false,
                            star_count:tag.detail.star_count - 1
                        }
                    })
                }
            }
            yield put({
                type: 'setTag',
                payload: response.data
            })
            return response
        }
    },

    reducers:{
        setTag(state,{ payload }){
            return {
                ...state,
                tag:payload
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