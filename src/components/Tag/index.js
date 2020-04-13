import React from 'react';
import classnames from 'classnames';
import Select from './Select';
import Create from './Create';
import Star from './Star';
import Selector from './Selector';
import styles from './index.less';
import { Link } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import Brand from './Brand';

function Tag({
    id,
    href,
    target,
    className,
    icon,
    title,
    onClose,
    brand = true,
    placement = 'bottomLeft',
}) {
    const renderContent = () => {
        return (
            <React.Fragment>
                {icon}
                {title}
                {onClose && (
                    <CloseOutlined
                        onClick={() => {
                            onClose(id, title);
                        }}
                    />
                )}
            </React.Fragment>
        );
    };

    const renderLink = () => {
        return (
            <Link to={href} target={target} className={classnames(className, styles.tag)}>
                {renderContent()}
            </Link>
        );
    };

    const renderSpan = () => {
        return <span className={classnames(className, styles.tag)}>{renderContent()}</span>;
    };

    const renderTag = () => {
        if (href !== undefined) {
            return renderLink();
        } else {
            return renderSpan();
        }
    };

    return brand ? (
        <Brand id={id} placement={placement}>
            {renderTag()}
        </Brand>
    ) : (
        renderTag()
    );
}

Tag.Select = Select;
Tag.Create = Create;
Tag.Brand = Brand;
Tag.Star = Star;
export default Tag;
export { Selector };
