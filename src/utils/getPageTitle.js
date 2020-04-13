import { useIntl } from 'umi';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

export const matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
};

const getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);
    if (!currRouterData) {
        return;
    }
    const intl = useIntl();
    const pageName = intl.formatMessage({
        id: currRouterData.locale || currRouterData.name,
        defaultMessage: currRouterData.name,
    });
    return pageName;
};

export default memoizeOne(getPageTitle, isEqual);
