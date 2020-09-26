import { loginByAccount, loginByMobile, loginByOauth } from './service';
import { getPageQuery } from '@/utils';

const onRedirect = () => {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    let { redirect } = params || { redirect: '/' };
    if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
        } else {
            window.location.href = '/';
            return;
        }
    }
    window.location.href = redirect || '/';
};
export default {
    namespace: 'login',

    state: {},

    effects: {
        *account({ payload }, { call }) {
            const response = yield call(loginByAccount, payload);
            if (response.result === true && response.status === 200) {
                onRedirect();
            }
            return response;
        },
        *mobile({ payload }, { call }) {
            const response = yield call(loginByMobile, payload);
            if (response.result === true && response.status === 200) {
                onRedirect();
            }
            return response;
        },
        *oauth({ payload }, { call }) {
            const response = yield call(loginByOauth, payload);
            if (response.result === true && response.status === 200) {
                onRedirect();
            }
            return response;
        },
    },
};
