import React from 'react';
import DocumentMeta from 'react-document-meta';
import { ContainerQuery } from 'react-container-query';
import classnames from 'classnames';
import Layout from './Layout';
import Sider from './Sider';

const query = {
    middle: {
        minWidth: 1200,
        maxWidth: 1999,
    },
    wider: {
        minWidth: 2000,
    },
};

export default ({ mode, title, metas, children, className, ...props }) => {
    const isContainer = (type, param) => {
        return mode ? mode === type : param === type;
    };
    return (
        <DocumentMeta
            title={title}
            meta={{
                name: {
                    ...metas,
                },
            }}
        >
            <ContainerQuery query={query}>
                {param => (
                    <div
                        className={classnames(
                            {
                                'layout-container': true,
                                'layout-container-wider': isContainer('wider', param),
                                'layout-container-middle': isContainer('middle', param),
                                'layout-container-full': isContainer('full', param),
                                clearfix: true,
                            },
                            className,
                        )}
                    >
                        {children}
                    </div>
                )}
            </ContainerQuery>
        </DocumentMeta>
    );
};

export { Layout, Sider };
