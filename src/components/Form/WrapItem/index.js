import React from 'react';
import Capthcha from './Capthcha';
import Default from './Default';

export default ({ updateActive, type, tabUtil, ...props }) => {
    if (type === 'Captcha') return <Capthcha {...props} />;
    return <Default {...props} />;
};
