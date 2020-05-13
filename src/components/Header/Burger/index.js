import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import './index.less';

export default ({ children, menu, visible, onChange, className, ...props }) => {
    onChange = onChange || function() {};
    const [render, setRender] = useState(false);
    const maskRef = useRef();
    const menuRef = useRef();

    useEffect(() => {
        const root = document.getElementById('root');
        const destroy = () => {
            setRender(false);
            if (maskRef.current) {
                maskRef.current.remove();
                maskRef.current = null;
            }
            if (menuRef.current) {
                menuRef.current.remove();
                menuRef.current = null;
            }
            document.body.removeAttribute('style');
        };

        if (visible) {
            maskRef.current = document.createElement('div');
            maskRef.current.setAttribute('class', 'burger-mask');
            root.appendChild(maskRef.current);

            menuRef.current = document.createElement('div');
            menuRef.current.setAttribute('class', 'burger-menu');
            menuRef.current.setAttribute('style', 'top:50px;opacity:1;');
            root.appendChild(menuRef.current);

            document.body.setAttribute('style', 'overflow: hidden; position: fixed;');

            setRender(true);
        } else {
            destroy();
        }

        return () => destroy();
    }, [visible]);

    return (
        <>
            <div
                className={classNames('nav-burger', className)}
                onClick={() => onChange(!visible)}
                {...props}
            >
                <div className="btn-burger">
                    {visible ? <CloseOutlined /> : children || <MenuOutlined />}
                </div>
            </div>
            {render &&
                ReactDOM.createPortal(
                    <div className="nav-burger-body">{menu}</div>,
                    menuRef.current,
                )}
        </>
    );
};
