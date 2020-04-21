import React, { useRef, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import { withRouter, useSelector, useDispatch, useModel } from 'umi';
import NProgress from 'nprogress';
import { getTitle, getMetas } from '@/utils/page';
import 'nprogress/nprogress.css';
import { Helmet } from 'react-helmet';

function BlankLayout({ route, children, location, title }) {
    const href = location.pathname;
    const hrefRef = useRef();
    const settings = useSelector(state => state.settings);
    const loading = useSelector(state => state.loading);

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

    const { routes = [] } = route || {};
    const breadcrumbNameMap = {};
    if (route && !route.routes) {
        routes.push(route);
    }
    if (!title) {
        routes.forEach(item => {
            if (item && item.name && item.path) {
                breadcrumbNameMap[item.path] = item;
            }
        });
        title = getTitle(location.pathname, breadcrumbNameMap);
    }
    const metas = getMetas(location.pathname, breadcrumbNameMap);

    title = title ? `${title} - ${settings.title}` : settings.title;

    return (
        <DocumentTitle title={title}>
            <>
                {metas && metas.length > 0 && (
                    <Helmet>
                        {metas.map(({ name, content, ...rest }) => (
                            <meta key={name} name={name} content={content} {...rest} />
                        ))}
                    </Helmet>
                )}
                {children}
            </>
        </DocumentTitle>
    );
}
export default withRouter(BlankLayout);
