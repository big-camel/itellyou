import React from 'react';
import Google from './Google';
import classNames from 'classnames';

export default ({ className, ...props }) => {
    return (
        <div className={classNames(className)} {...props}>
            <Google
                client="ca-pub-3706417744839656"
                slot="1432657820"
                style={{ display: 'block' }}
            />
        </div>
    );
};
