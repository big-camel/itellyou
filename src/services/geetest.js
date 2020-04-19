import { stringify } from 'qs';
import request from '@/utils/request';

export const init = mode => {
    return new Promise((resolve, reject) => {
        const { initGeetest } = window;
        if (!initGeetest) return reject('Not fint geetest lib');
        request(`/api/geetest?${stringify({ mode })}`).then(res => {
            if (res.result) {
                const { key, gt, challenge, success, newCaptcha } = res.data;
                initGeetest(
                    {
                        gt,
                        challenge,
                        new_captcha: newCaptcha,
                        offline: !success,
                        product: 'bind',
                    },
                    gtObject => {
                        gtObject.onSuccess(() => {
                            resolve({ validate: gtObject.getValidate(), key });
                            gtObject.reset();
                        });
                        gtObject.onError(error => {
                            reject(error.msg);
                            gtObject.reset();
                        });
                        gtObject.onClose(() => {
                            reject();
                        });
                        gtObject.onReady(() => {
                            gtObject.verify();
                        });
                    },
                );
            } else {
                reject(res.meesage);
            }
        });
    });
};
