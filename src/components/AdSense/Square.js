import React from 'react';
import AdSense from 'react-adsense';
import classNames from 'classnames';

export default ({ className, ...props }) => {
    return (
        <div className={classNames(className)} {...props}>
            <AdSense.Google
                client="ca-pub-3706417744839656"
                slot="1432657820"
                style={{ display: 'block' }}
            />
        </div>
    );
};
