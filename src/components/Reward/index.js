import React from 'react';
import { Button, InputNumber, Row, Col } from 'antd';
import styles from './index.less';
class Reward extends React.PureComponent {
    state = {
        select_btn: null,
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.isCash !== nextProps.isCash) {
            this.setState({
                select_btn: null,
            });
            const { onChange } = this.props;
            if (onChange) {
                onChange(0);
            }
        }
    }

    onSetReward = value => {
        this.setState({
            select_btn: 'btn_' + value,
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    };

    onInputBlur = event => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(event.target.value);
        }
    };

    onInputFocus = () => {
        this.setState({
            select_btn: null,
        });
    };

    render() {
        const { isCash } = this.props;
        const { select_btn } = this.state;
        return (
            <div className={styles['reward-layout']}>
                {!isCash && (
                    <React.Fragment>
                        <Row gutter={4}>
                            <Col span={6}>
                                <Button
                                    className={select_btn === 'btn_5' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(5);
                                    }}
                                >
                                    5 积分
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button
                                    className={select_btn === 'btn_10' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(10);
                                    }}
                                >
                                    10 积分
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button
                                    className={select_btn === 'btn_20' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(20);
                                    }}
                                >
                                    20 积分
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button
                                    className={select_btn === 'btn_50' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(50);
                                    }}
                                >
                                    50 积分
                                </Button>
                            </Col>
                        </Row>
                        <Row gutter={4}>
                            <Col span={6}>
                                <Button
                                    className={select_btn === 'btn_100' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(100);
                                    }}
                                >
                                    100 积分
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button
                                    className={select_btn === 'btn_200' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(200);
                                    }}
                                >
                                    200 积分
                                </Button>
                            </Col>
                            <Col span={12}>
                                <div className={styles['reward-input']}>
                                    <span className={styles['input-or']}>或</span>
                                    <InputNumber
                                        defaultValue={0}
                                        precision={0}
                                        min={0}
                                        max={200}
                                        onFocus={this.onInputFocus}
                                        onBlur={this.onInputBlur}
                                    />
                                    <span className={styles['input-jifen']}>积分</span>
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                )}
                {isCash && (
                    <React.Fragment>
                        <Row gutter={4}>
                            <Col span={8}>
                                <Button
                                    className={select_btn === 'btn_1' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(1);
                                    }}
                                >
                                    1 元
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button
                                    className={select_btn === 'btn_6' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(6);
                                    }}
                                >
                                    6 元
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button
                                    className={select_btn === 'btn_10' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(10);
                                    }}
                                >
                                    10 元
                                </Button>
                            </Col>
                        </Row>
                        <Row gutter={4}>
                            <Col span={8}>
                                <Button
                                    className={select_btn === 'btn_66' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(66);
                                    }}
                                >
                                    66 元
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button
                                    className={select_btn === 'btn_100' ? styles['active'] : null}
                                    onClick={() => {
                                        this.onSetReward(100);
                                    }}
                                >
                                    100 元
                                </Button>
                            </Col>
                            <Col span={8}>
                                <div className={styles['reward-input']}>
                                    <span className={styles['input-or']}>或</span>
                                    <InputNumber
                                        defaultValue={0}
                                        precision={0}
                                        min={0}
                                        max={200}
                                        onFocus={this.onInputFocus}
                                        onBlur={this.onInputBlur}
                                    />
                                    <span className={styles['input-yuan']}>元</span>
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                )}
            </div>
        );
    }
}
export default Reward;
