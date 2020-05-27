import React from 'react';
import { ConfigProvider } from 'antd';

export const ssr = {
    modifyGetInitialPropsCtx: async ctx => {
        return ctx;
    },
};

export const rootContainer = container => {
    return <ConfigProvider autoInsertSpaceInButton={false}>{container}</ConfigProvider>;
};

let refer;
export function onRouteChange({ location, routes, action }) {
    if (action !== 'POP') {
        if (typeof window !== 'undefined' && window._czc) {
            window._czc.push(['_trackPageview', location.pathname, refer]);
        }
    }
    refer = location.pathname;
}
