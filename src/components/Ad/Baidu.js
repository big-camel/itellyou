import React, { useEffect, useRef } from 'react';

export default ({ style, slot_id }) => {
    const div = useRef();

    useEffect(() => {
        let id = div.current.getAttribute('id');
        if (!id) {
            id = '_' + Math.random().toString(36).slice(2);
            div.current.setAttribute('id', id);
        }
        try {
            if (typeof window === 'undefined') return;
            (window.slotbydup = window.slotbydup || []).push({
                id: slot_id,
                container: id,
                async: true,
            });
        } catch (e) {
            console.error(e.message);
        }
    }, []);

    return <div ref={div} style={style} />;
};
