import React, { useRef, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import { withRouter, useSelector, useDispatch, useModel } from 'umi';
import NProgress from 'nprogress';
import getPageTitle from '@/utils/getPageTitle';
import 'nprogress/nprogress.css';

function BlankLayout({ route, children, location, title }) {
    const { href } = window.location;
    const hrefRef = useRef();
    const settings = useSelector(state => state.settings);
    const loading = useSelector(state => state.loading);
    if (hrefRef.current !== href) {
        NProgress.start();
        if (!loading.global) {
            NProgress.done();
            hrefRef.current = href;
        }
    }

    const {
        initialState: { me },
    } = useModel('@@initialState');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'user/setMe',
            payload: me,
        });
    }, [dispatch, me]);

    const { routes = [] } = route || {};
    if (!title) {
        const breadcrumbNameMap = {};
        if (route && !route.routes) {
            routes.push(route);
        }
        routes.forEach(item => {
            if (item && item.name && item.path) {
                breadcrumbNameMap[item.path] = item;
            }
        });
        title = getPageTitle(location.pathname, breadcrumbNameMap);
    }

    title = title ? `${title} - ${settings.title}` : settings.title;

    return (
        <DocumentTitle title={title}>
            <React.Fragment>{children}</React.Fragment>
        </DocumentTitle>
    );
}
export default withRouter(BlankLayout);
