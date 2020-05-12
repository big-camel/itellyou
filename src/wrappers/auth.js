import React from 'react';
import { useAccess, Redirect } from 'umi';
import { getRoute } from '@/utils/page';

export default ({ children, route, location: { pathname } }) => {
    const { routes = [] } = route || {};

    if (route && !route.routes) {
        routes.push(route);
    }
    const routeData = getRoute(pathname, routes);
    if (routeData && routeData.unaccessible) {
        const access = useAccess();
        if (!access.isLogin) return <Redirect to="/login" />;
        return <Redirect to="/403" />;
    }
    return children;
};
