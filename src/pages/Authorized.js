import React from 'react'
import Redirect from 'umi/redirect'
import pathToRegexp from 'path-to-regexp'
import Authorized from '@/utils/Authorized'
import { getAuthority } from '@/utils/authority'
import Exception from '@/components/Exception'

function AuthComponent({ children, location, route: { routes} }) {
  const auth = getAuthority();
  const isLogin = auth && auth[0] !== 'guest';
  const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
      // match prefix
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        authorities = route.authority || authorities;
  
        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities;
        }
      }
    });
    return authorities;
  };
  
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes)}
      noMatch={isLogin ? <Exception status={403} title="403" subTitle="无权限" /> : <Redirect to="/login" />}
    >
      {children}
    </Authorized>
  );
}
export default AuthComponent
