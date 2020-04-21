import React from 'react';
import { ConfigProvider } from 'antd';
import { useModel, useSelector } from 'umi';
import { fetchMe } from './services/user/index';

export const dva = {
    config: {
        onError(err) {
            err.preventDefault();
            console.error(err.message);
        },
    },
};

export const rootContainer = container => {
    return <ConfigProvider autoInsertSpaceInButton={false}>{container}</ConfigProvider>;
};

export function onRouteChange({ location, routes, action }) {
    if (action !== 'POP') {
        if (window._czc) {
            window._czc.push(['_trackPageview', location.pathname]);
        }
    }
}

export async function getInitialState() {
    const result = await fetchMe();
    const me = result && result.result ? result.data : null;
    if (window._czc) {
        window._czc.push(['_setCustomVar', me ? 'user' : 'guest', me ? 'vip' : 'guest']);
    }
    return {
        me,
    };
}
