/**
 * request 网络请求工具
 * 更详细的api文档: https://github.com/umijs/umi-request
 */

import { extend } from 'umi-request';
import pathToRegexp from 'path-to-regexp';
import { isBrowser, history } from 'umi';
import omit from 'omit.js';

let notification;
import('antd').then(module => {
    notification = module.notification;
});

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
    if (!isBrowser()) {
        return console.log('umi-request error:', error);
    }
    const { response } = error;
    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const { status, url } = response;
        if (
            !pathToRegexp('/user/me').test(url) &&
            !pathToRegexp('^/[login|regiser|401|403|404|5d{2}]').test(history.location.pathname)
        ) {
            let url = status;
            if (status === 401) url = 'login';
            else if (status >= 500) url = 500;
            history.push(`/${url}`);
        } else if (notification) {
            notification.error({
                message: `请求错误 ${status}: ${url}`,
                description: errorText,
            });
        }
    } else if (!response && notification) {
        notification.error({
            description: '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }
    return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, { params = {}, data = {}, headers, ...options }) => {
    const exclude = [];
    if (!isBrowser()) {
        let token = params.token;
        let apiUrl = params.api_url;
        if (!token) token = data.token;
        if (!apiUrl) apiUrl = data.api_url;
        const cookies = headers.Cookie ? headers.Cookie.split(';') : [];

        if (token) {
            exclude.push('token');
            cookies.push(`token=${token}`);
        }
        headers.Cookie = cookies.join(';');

        if (apiUrl) {
            url = apiUrl + url;
            exclude.push('api_url');
        }
    }
    return {
        url,
        options: {
            headers,
            params: omit(params, exclude),
            data: omit(data, exclude),
            ...options,
            interceptors: true,
        },
    };
});

export default request;
