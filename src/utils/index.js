import { parse, stringify } from 'qs';

export function getPageQuery() {
    return parse(typeof window !== 'undefined' ? window.location.href.split('?')[1] : null);
}

export function getQueryPath(path = '', query = {}) {
    const search = stringify(query);
    if (search.length) {
        return `${path}?${search}`;
    }
    return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function limitFloat(val, min) {
    let sNum = val.toString(); //先转换成字符串类型
    if (sNum.indexOf('.') == 0) {
        //第一位就是 .
        console.log('first str is .');
        sNum = '0' + sNum;
    }
    sNum = sNum.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
    sNum = sNum.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
    sNum = sNum.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    sNum = sNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (sNum.trim() === '') sNum = `${min || 0}`;
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (sNum.indexOf('.') < 0 && sNum != '') {
        sNum = parseFloat(sNum);
    }
    if (typeof sNum === 'string' && sNum.indexOf('.') !== sNum.length - 1) {
        sNum = parseFloat(sNum);
        if (min && sNum < min) {
            return min;
        }
    }
    return sNum;
}

export const getScrollTop = () => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

export const getOffset = (element) => {
    if (!element.getClientRects().length)
        return {
            top: 0,
            left: 0,
        };
    const rect = element.getBoundingClientRect();
    const view = element.ownerDocument.defaultView;

    return {
        top: rect.top + view.pageYOffset,
        left: rect.left + view.pageXOffset,
    };
};

export const calcHeight = (element, isTop) => {
    const offset = getOffset(element);
    const { offsetHeight } = element;
    const scrollTop = getScrollTop();

    let height = 0;
    if (window.innerHeight + scrollTop <= offsetHeight + offset.top) {
        height = isTop ? window.innerHeight - 32 : window.innerHeight - offset.top - 16;
    } else {
        height = offsetHeight + offset.top - scrollTop - offset.top - 102;
    }
    return height;
};

export const scrollToElement = (from, to) => {
    let top = getOffset(to ? to : from).top - 80;
    let i = to ? getOffset(from).top : 0;
    const value = Math.abs(top - i);
    let step = 5;
    if (value > 200 && value <= 500) step = 15;
    else if (value > 500 && value <= 1000) step = 30;
    else if (value > 1000) step = 50;
    if (top < i) step = -step;

    const scrollInterval = setInterval(() => {
        window.scrollTo(0, i);
        if (i + step >= top || (step < 0 && i + step <= top)) {
            i = top;
            clearInterval(scrollInterval);
        } else {
            i += step;
        }
    }, 5);
};
