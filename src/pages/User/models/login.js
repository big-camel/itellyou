import { loginByAccount,loginByMobile } from '@/services/user'
import { routerRedux } from 'dva/router'
import { setAuthority } from '@/utils/authority'
import { getPageQuery } from '@/utils/utils'
import { reloadAuthorized } from '@/utils/Authorized'

export default {
    namespace: 'login',

    state: {},

    effects: {
        *loginByAccount({ payload }, { call,put }){
            const response = yield call(loginByAccount,payload)
            
            if (response.result === true && response.status === 200) {
                setAuthority({
                    authority:response.data.authority || "user",
                })
                reloadAuthorized()
                const urlParams = new URL(window.location.href)
                const params = getPageQuery()
                let { redirect } = params
                if (redirect) {
                    const redirectUrlParams = new URL(redirect)
                    if (redirectUrlParams.origin === urlParams.origin) {
                            redirect = redirect.substr(urlParams.origin.length)
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1)
                        }
                    } else {
                        redirect = null
                    }
                }
                yield put(routerRedux.replace(redirect || '/'));
            }else{
                return response
            }
        },
        *loginByMobile({ payload }, { call,put }){
            const response = yield call(loginByMobile,payload)
            if (response.result === true && response.status === 200) {
                setAuthority({
                    authority:response.data.authority || "user"
                })
                reloadAuthorized()
                const urlParams = new URL(window.location.href)
                const params = getPageQuery()
                let { redirect } = params
                if (redirect) {
                    const redirectUrlParams = new URL(redirect)
                    if (redirectUrlParams.origin === urlParams.origin) {
                            redirect = redirect.substr(urlParams.origin.length)
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1)
                        }
                    } else {
                        redirect = null
                    }
                }
                yield put(routerRedux.replace(redirect || '/'));
            }else{
                return response
            }
        }
    },
}