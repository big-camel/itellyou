import { useIntl } from 'umi';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

export const matchParamsPath = (path, routes) => {
    const routeMap = {};

    const renderMap = routes => {
        routes.forEach(item => {
            if (item && item.name && item.path) {
                routeMap[item.path] = item;
            }
            if (item.routes) {
                renderMap(item.routes);
            }
        });
    };

    renderMap(routes);

    const pathKey = Object.keys(routeMap).find(key => pathToRegexp(key).test(path));
    return routeMap[pathKey];
};

export const getRoute = memoizeOne((pathname, routes) => {
    return matchParamsPath(pathname, routes);
}, isEqual);

export const getTitle = memoizeOne((pathname, routes) => {
    const currRouterData = matchParamsPath(pathname, routes);
    if (!currRouterData) {
        return;
    }
    const intl = useIntl();
    const pageName = intl.formatMessage({
        id: currRouterData.locale || currRouterData.name,
        defaultMessage: currRouterData.name,
    });
    return pageName;
}, isEqual);

export const getMetas = memoizeOne((pathname, routes) => {
    const currRouterData = matchParamsPath(pathname, routes);
    if (!currRouterData) {
        return;
    }
    return currRouterData.metas;
}, isEqual);
