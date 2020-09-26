import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { RouteContext } from '@/context';

function Layout({ spans = 17, gutter = 10, children }) {
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
    const { isMobile } = useContext(RouteContext);
    if (isMobile) return React.Children.toArray(children)[0];
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
