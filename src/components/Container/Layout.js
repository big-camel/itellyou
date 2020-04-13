import React from 'react';
import { Row, Col } from 'antd';
import Sider from './Sider';

function Layout({ spans = 17, gutter = 24, children }) {
    const spanData = 24;

    if (!Array.isArray(spans)) spans = [spans, spanData - spans];

    const childLength = React.Children.toArray(children).length;
    if (childLength < 2) return children;
    if (childLength != spans.length) {
        spans = [];
        for (let i = 0; i < childLength; i++) {
            spans[i] = spanData / childLength;
        }
    }
    return (
        <Row gutter={gutter}>
            {React.Children.map(children, (child, index) => {
                return (
                    <Col key={index} span={spans[index]}>
                        {child}
                    </Col>
                );
            })}
        </Row>
    );
}

export default Layout;
