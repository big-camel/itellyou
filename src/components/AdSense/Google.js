import React, { useEffect } from 'react';
import classNames from 'classnames';

const Google = ({ className, style, client, slot, layout, layoutKey, format, responsive }) => {
    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e.message);
        }
    }, []);

    return (
        <ins
            className={classNames(`adsbygoogle`, className)}
            style={style}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-layout={layout}
            data-ad-layout-key={layoutKey}
            data-ad-format={format}
            data-full-width-responsive={responsive}
        />
    );
};
Google.defaultProps = {
    className: '',
    style: { display: 'block' },
    format: 'auto',
    layout: '',
    layoutKey: '',
    responsive: 'false',
};
export default Google;
