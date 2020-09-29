import React, { useEffect, useContext, useRef } from 'react';
import { RouteContext } from '@/context';

const Google = ({ className, style, client, slot, layout, layoutKey, format, responsive }) => {
    const { isMobile } = useContext(RouteContext);

    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e.message);
        }
    }, []);

    if (isMobile) {
        style = {
            ...style,
            width: '100%',
            minWidth: '300px',
            maxWidth: '100%',
        };
    }

    return (
        <ins
            className={`${className} adsbygoogle`}
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
