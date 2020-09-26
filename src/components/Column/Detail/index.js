import React from 'react';
import { Avatar, Space } from 'antd';
import { Link } from 'umi';
import classnames from 'classnames';
import ColumnBrand from '../Brand';
import ColumnStar from '../Star';
import './index.less';

export default ({
    info: { id, path, name, avatar, description, use_star },
    size,
    extra,
    className,
    model,
    brand = true,
    type,
}) => {
    size = size || 'default';
    let avatarShape = 'circle'; //"square"
    let avatarSize = 40;
    if (size === 'small') {
        avatarShape = 'circle';
        avatarSize = 20;
        description = undefined;
    }
    if (size === 'middle') avatarSize = 34;
    const getLink = () => {
        return (
            <Link to={`/${path}`}>
                <span dangerouslySetInnerHTML={{ __html: name }} />
            </Link>
        );
    };
    const sizeClass = model ? `column-author-${model}` : '';

    const renderDetail = () => {
        return (
            <Space
                size="small"
                className={classnames(
                    'column-author',
                    `column-author-${size}`,
                    sizeClass,
                    className,
                )}
            >
                {(!model || model === 'avatar') && (
                    <div className="column-author-avatar">
                        <ColumnBrand id={id}>
                            <Avatar shape={avatarShape} size={avatarSize} src={avatar} />
                        </ColumnBrand>
                    </div>
                )}
                {(!model || model === 'name') && (
                    <div className="column-author-content">
                        <div className="column-author-name">
                            {brand && <ColumnBrand id={id}>{getLink()}</ColumnBrand>}
                            {!brand && getLink()}
                        </div>
                        {description && (
                            <p
                                className="column-author-desc"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                    </div>
                )}

                {extra}
            </Space>
        );
    };

    if (type === 'line') {
        return (
            <div className="column-full-line">
                {renderDetail()}
                <ColumnStar id={id} use_star={use_star} text="关注专栏" />
            </div>
        );
    }
    return renderDetail();
};
