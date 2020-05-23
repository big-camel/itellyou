import { isBrowser } from 'umi';
import { fetchMe } from '@/services/user';

export default async props => {
    let me = (props || {}).me;
    if (!me) {
        if (typeof window !== 'undefined' && window.g_initialProps && window.g_initialProps.user) {
            me = window.g_initialProps.user.me;
        } else if (isBrowser()) {
            const { result, data } = (await fetchMe()) || {};
            if (result) {
                me = data;
            }
        }

        if (!me)
            return {
                isLogin: false,
            };
    }

    const isLogin = !!me;
    const accessArray = me.access || [];
    const accessList = {};
    accessArray.forEach(({ name }) => {
        const names = name.split('_');
        const key = [];
        names.forEach(char => {
            if (key.length === 0) key.push(char);
            else {
                key.push(char.charAt(0).toUpperCase() + char.slice(1));
            }
        });
        accessList[key.join('')] = true;
    });

    return {
        isLogin,
        ...accessList,
    };
};
