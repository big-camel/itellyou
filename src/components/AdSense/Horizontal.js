import React from 'react';
import Google from './Google';
import classNames from 'classnames';

export default ({ className, ...props }) => {
    return (
        <div className={classNames(className)} {...props}>
            <Google
                client="ca-pub-3706417744839656"
                slot="4836967202"
                format="auto"
                responsive={true}
                style={{
                    display: 'block',
                    minHeigth: 100,
                    maxHeight: 280,
                    minWidth: 300,
                    width: '100%',
                }}
            />
        </div>
    );
};
