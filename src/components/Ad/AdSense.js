import React, { useEffect } from 'react';

export default ({ style, slot_id, data_id, format }) => {
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
            className="adsbygoogle"
            style={style}
            data-ad-client={data_id}
            data-ad-slot={slot_id}
            data-ad-format={format}
            data-full-width-responsive={true}
        />
    );
};
