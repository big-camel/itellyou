import React, { useContext } from 'react';
import { useSelector } from 'umi';
import classNames from 'classnames';
import { RouteContext } from '@/context';
import Baidu from './Baidu';
import AdSense from './AdSense';
import styles from './index.less';

const rects = {
    rectangle: {
        width: 690,
        height: 280,
    },
    square: {
        width: 292,
        height: 292,
    },
    mobile: {
        width: 6,
        height: 5,
    },
};

export default ({ className, type = 'rectangle', width, height, ...props }) => {
    const { isMobile } = useContext(RouteContext);
    type = isMobile ? 'mobile' : type;
    const rectsData = rects[type];
    console.log(width);
    width = width || (rectsData ? rectsData.width : 0);
    height = height || (rectsData ? rectsData.height : 0);

    const ad = useSelector((state) => state.ad.detail);
    if (!ad || !width || !height) return null;

    const style = {};
    if (rectsData && rectsData.width !== width) style['width'] = width;
    if (rectsData && rectsData.height !== height) style['height'] = height;

    const { slots } = ad;
    if (!slots) return null;

    let slotConsort = undefined;

    slots.forEach((slot) => {
        if (slot.width <= width) {
            if (!slotConsort || slot.width > slotConsort.width) slotConsort = slot;
        }
    });
    if (!slotConsort) return null;

    const render = () => {
        if (ad.type === 'baidu') return <Baidu {...slotConsort} />;
        else if (ad.type === 'adsense') return <AdSense {...slotConsort} data_id={ad.data_id} />;
    };

    return (
        <div
            className={classNames(
                { [styles[type]]: !!type },
                { [styles['mobile']]: isMobile },
                className,
            )}
            style={style}
            {...props}
        >
            {render()}
        </div>
    );
};
