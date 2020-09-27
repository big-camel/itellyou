import React, { useRef, useEffect } from 'react';
import { withRouter, useSelector, Redirect, useAccess, Helmet, isBrowser } from 'umi';
import NProgress from 'nprogress';
import { getRoute, getTitle, getMetas } from '@/utils/page';
import { RouteContext } from '@/context';
import useMedia from 'use-media-antd-query';
import { BackTopButton } from '@/components/Button';
import 'nprogress/nprogress.css';

function BlankLayout({ route, children, location: { pathname }, title }) {
    const href = pathname;
    const hrefRef = useRef();
    const settings = useSelector((state) => state.settings);
    const loading = useSelector((state) => state.loading);

    const { routes = [] } = route || {};

    if (route && !route.routes) {
        routes.push(route);
    }

    useEffect(() => {
        if (hrefRef.current !== href) {
            if (loading.global && !NProgress.status) {
                NProgress.start();
            }

            if (!loading.global && NProgress.status) {
                NProgress.done();
                hrefRef.current = href;
                if (typeof window !== 'undefined' && window.app && window.app.done) {
                    window.app.done();
                }
            }
        }
    }, [href, loading]);

    const colSize = isBrowser() ? useMedia() : '';
    const isMobile = isBrowser() ? colSize === 'sm' || colSize === 'xs' : settings.isMobile;

    if (!title) {
        title = getTitle(pathname, routes);
    }

    const routeData = getRoute(pathname, routes);
    if (routeData && routeData.unaccessible) {
        const access = useAccess();
        if (!access.isLogin) return <Redirect to="/login" />;
        return <Redirect to="/403" />;
    }

    const metas = getMetas(pathname, routes) || [];

    title = title ? `${title} - ${settings.title}` : settings.title;

    return (
        <>
            <Helmet>
                <title>{title}</title>
                {metas.map(({ name, content }) => (
                    <meta key={name} name={name} content={content} />
                ))}
            </Helmet>
            <RouteContext.Provider
                value={{
                    isMobile,
                    routes,
                }}
            >
                {children}
                <BackTopButton />
            </RouteContext.Provider>
        </>
    );
}

BlankLayout.getInitialProps = ({
    isServer,
    isMobile,
    isSpider,
    user,
    site,
    links,
    store,
    params,
}) => {
    const { dispatch, getState } = store;

    const state = getState();
    if (isServer) {
        dispatch({
            type: 'user/setMe',
            payload: user,
        });
        dispatch({
            type: 'settings/setSettings',
            payload: {
                isMobile,
                isSpider,
                site,
                links,
            },
        });
        return Promise.resolve({
            ...state,
            user: { ...state.user, me: user },
            settings: { ...state.settings, site, links },
        });
    }
    user = state.user;

    if (!user || !user.me) {
        dispatch({
            type: 'user/fetchMe',
            payload: {
                ...params,
            },
        });
    }

    const { settings } = state;

    if (!settings || !settings.site) {
        dispatch({
            type: 'settings/systemSetting',
            payload: {
                ...params,
            },
        });
    }
    if (!settings || !settings.links) {
        dispatch({
            type: 'settings/systemLink',
            payload: {
                ...params,
            },
        });
    }
};
export default withRouter(BlankLayout);
