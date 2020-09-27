import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Space } from 'antd';
import { isBrowser } from 'umi';
import { Link } from 'rc-scroll-anim';
import { findReadingSection } from './utils';
import { Outline } from '../Async';
import styles from './index.less';

export default ({ view, config, className, ...props }) => {
    const lastScrollTop = useRef(0);
    const headings = useRef([]);
    const [contents, setContents] = useState([]);
    const [readingSection, setReadingSection] = useState(0);
    const [reachingTop, setReachingTop] = useState(true);

    const handleResize = useCallback(() => {
        listenerViewChange();
    }, []);

    const listenerViewChange = useCallback(() => {
        const index = findReadingSection(headings.current, 140);
        setReadingSection(index);
    }, []);

    const handleScroll = useCallback(() => {
        const min = 5;
        let top =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (!Math.abs(lastScrollTop.current - top) <= min) {
            setReachingTop(top < 80);
            listenerViewChange();

            lastScrollTop.current = top;
        }
    }, []);

    useEffect(() => {
        if (view && config && isBrowser()) {
            const contents =
                config && config.outline ? config.outline : Outline.extractFromDom(view);
            headings.current = contents.map(({ id }) => {
                return document.getElementById(id);
            });
            setContents(contents);
            listenerViewChange();
        }
    }, [listenerViewChange, view, config]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        listenerViewChange();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [handleScroll, listenerViewChange, handleResize]);

    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    }, [contents]);

    const onLinkClick = (id) => {
        window.location.hash = `#${id}`;
    };

    return (
        <div
            className={classNames(styles['toc'], { [styles['fixed']]: !reachingTop }, className)}
            {...props}
        >
            <Space direction="vertical" size="large">
                <ul className={styles['directory']}>
                    {contents.map(({ id, text, level, depth }, index) => (
                        <li
                            key={id}
                            className={classNames(styles['item'], {
                                [styles['active']]: index === readingSection,
                            })}
                        >
                            <Link
                                offsetTop={80}
                                onClick={() => onLinkClick(id)}
                                className={classNames(styles['link'], styles[`link-${depth}`])}
                                to={`${id}`}
                            >
                                {text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Space>
        </div>
    );
};
