import React, { useRef, useEffect } from 'react';
import DocumentMeta from 'react-document-meta';
import { withRouter, useSelector, useDispatch, useModel, Redirect, useAccess } from 'umi';
import NProgress from 'nprogress';
import useAntdMediaQuery from 'use-media-antd-query';
import { getRoute, getTitle, getMetas } from '@/utils/page';
import { RouteContext } from '@/context';
import 'nprogress/nprogress.css';

function BlankLayout({ route, children, location: { pathname }, title }) {
    const href = pathname;
    const hrefRef = useRef();
    const settings = useSelector(state => state.settings);
    const loading = useSelector(state => state.loading);

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
                if (window.app && window.app.done) {
                    window.app.done();
                }
            }
        }
    }, [href, loading]);

    const { initialState } = useModel('@@initialState');
    const me = initialState ? initialState.me : null;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'user/setMe',
            payload: me,
        });
    }, [dispatch, me]);

    const colSize = useAntdMediaQuery();
    const isMobile = colSize === 'sm' || colSize === 'xs';

    if (!title) {
        title = getTitle(pathname, routes);
    }

    const routeData = getRoute(pathname, routes);
    if (routeData && routeData.unaccessible) {
        const access = useAccess();
        if (!access.isLogin) return <Redirect to="/login" />;
        return <Redirect to="/403" />;
    }

    const metas = getMetas(pathname, routes);

    title = title ? `${title} - ${settings.title}` : settings.title;

    return (
        <DocumentMeta
            title={title}
            meta={{
                name: {
                    ...metas,
                },
            }}
        >
            <RouteContext.Provider
                value={{
                    isMobile,
                    routes,
                }}
            >
                {children}
            </RouteContext.Provider>
        </DocumentMeta>
    );
}
export default withRouter(BlankLayout);
