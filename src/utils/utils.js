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
    sNum = sNum
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.');
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
