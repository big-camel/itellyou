import { loginByAccount, loginByMobile } from './service';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

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
                setAuthority({
                    authority: response.data.authority || 'user',
                });
                reloadAuthorized();
                onRedirect();
            }
            return response;
        },
        *mobile({ payload }, { call }) {
            const response = yield call(loginByMobile, payload);
            if (response.result === true && response.status === 200) {
                setAuthority({
                    authority: response.data.authority || 'user',
                });
                reloadAuthorized();
                onRedirect();
            }
            return response;
        },
    },
};
