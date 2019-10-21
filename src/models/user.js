import { routerRedux } from 'dva/router'
import { stringify } from 'qs'
import { setAuthority } from '@/utils/authority'
import { reloadAuthorized } from '@/utils/Authorized'
import { checkNickname,fetchCurrent,getTag,setTag,delTag , logout } from '@/services/user'
export default {
    namespace: 'user',

    state: {},

    effects: {
        *checkNickname({ payload }, { call }){
            const response = yield call(checkNickname,payload)
            return response
        },

        *fetchCurrent(_, { call,put }){
            const response = yield call(fetchCurrent)
            yield put({
                type: 'currentUserState',
                payload: response
            })
        },
        *logout(_, { call,put }){
            const response = yield call(logout)
            yield put({
                type: 'currentUserState',
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
                type: 'currentTagState',
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
                type: 'currentTagState',
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
                type: 'currentTagState',
                payload: response.data
            })
            return response
        }
    },

    reducers:{
        currentTagState(state,{ payload }){
            return {
                ...state,
                tag:payload
            }
        },
        currentUserState(state,{ payload }){
            return {
                ...state,
                current:payload.data
            }
        }
    }
}