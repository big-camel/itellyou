import React, { useEffect, useRef } from 'react';

export default ({ style, slot_id, data_id, format }) => {
    const div = useRef();
    useEffect(() => {
        try {
            div.current.setAttribute('style', style);
            if (typeof window === 'undefined') return;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e.message);
        }
    }, []);
    let styleJson = {};
    if (style) {
        try {
            styleJson = JSON.parse(style);
        } catch (e) {}
    }

    return (
        <ins
            ref={div}
            className="adsbygoogle"
            data-ad-client={data_id}
            data-ad-slot={slot_id}
            data-ad-format={format}
            data-full-width-responsive={true}
        />
    );
};
