import request from '@/utils/request';
import { init } from './geetest';

export async function sendCaptcha({ action, ...params }) {
    return new Promise((resolve, reject) => {
        init(action)
            .then(({ validate, key }) => {
                if (!validate) return reject();
                request(`/api/validation/${action}/code`, {
                    method: 'POST',
                    data: {
                        ...params,
                        geetest: {
                            key,
                            challenge: validate.geetest_challenge,
                            validate: validate.geetest_validate,
                            seccode: validate.geetest_seccode,
                        },
                    },
                })
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}
