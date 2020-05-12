import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'umi';
import QrCode from 'qrcode.react';
import Loading from '@/components/Loading';
import styles from './index.less';

export default ({ visible, amount = 0.0, type = 'alipay', onClose }) => {
    onClose = onClose || function() {};
    const dispatch = useDispatch();
    const timeout = useRef();
    const [error, setError] = useState();
    const pay = useSelector(state => state.pay[type]);

    const { id, qr } = pay || {};
    let { status } = pay || {};
    useEffect(() => {
        dispatch({
            type: `pay/${type}Precreate`,
            payload: {
                amount,
            },
        }).then(({ result, ...res }) => {
            if (!result) {
                setError(res.message);
            }
        });
    }, [amount, type, dispatch]);

    useEffect(() => {
        if (id) {
            const query = () => {
                dispatch({
                    type: `pay/${type}Query`,
                    payload: {
                        id,
                    },
                }).then(({ result, ...res }) => {
                    if (!result) {
                        clearInterval(timeout.current);
                        setError(res.message);
                    }
                });
            };
            timeout.current = setInterval(query, 3000);
        }
        return () => {
            clearInterval(timeout.current);
        };
    }, [id, dispatch]);
    status = status ? status.toLowerCase() : null;

    useEffect(() => {
        if (status === 'succeed' && timeout.current) {
            clearInterval(timeout.current);
            timeout.current = null;
            // 清除支付状态
            dispatch({
                type: `pay/set${type.charAt(0).toUpperCase() + type.slice(1)}`,
                payload: {
                    status: 'default',
                },
            });
            onClose('succeed');
        }
    }, [dispatch, type, status, onClose]);

    const render = () => {
        if (error) return <p>出错了,{error}</p>;
        if (!qr) return <Loading />;
        if (status === 'faild') return <p>支付失败</p>;
        return (
            <>
                <div className={styles['title']}>
                    <p className={styles['desc']}>扫一扫付款(元)</p>
                    <p className={styles['amount']}>{amount}</p>
                </div>
                <div className={styles['qr-code']}>
                    <QrCode
                        value={qr}
                        renderAs="svg"
                        includeMargin={true}
                        size={258}
                        level="Q"
                        imageSettings={{
                            src:
                                'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg3NzIwMjcwNDk2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ2MjIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTAxNC45NDU2ODQgODIxLjU3MTM2OEM5MDUuNDMxNTc5IDc3Ny4xNjIxMDUgNzk3LjY0MjEwNSA3MzIuOTY4NDIxIDY4OS44NTI2MzIgNjg2LjYxODk0N2EyNjMuODY4NjMyIDI2My44Njg2MzIgMCAwIDEtMjguMDI1MjY0LTE2LjU5OTU3OWMtMTUuMzA2MTA1IDE3LjQ2MTg5NS0yOS41MzQzMTYgMzUuNTcwNTI2LTQ1LjcwMjczNiA1MS45NTQ1MjctODcuMzA5NDc0IDg4LjYwMjk0Ny0xODkuMDYyNzM3IDE0MS42MzUzNjgtMzE3Ljc2MzM2OSAxMzIuNTgxMDUyYTMzMS4zNDQ4NDIgMzMxLjM0NDg0MiAwIDAgMS0xMDEuMTA2NTI2LTIzLjkyOTI2MyAxODcuNzY5MjYzIDE4Ny43NjkyNjMgMCAwIDEtMTAzLjQ3Nzg5NS0yMjMuOTg2NTI2IDE1OS41Mjg0MjEgMTU5LjUyODQyMSAwIDAgMSAxMTEuNjY5ODk1LTEwNy43ODk0NzQgNDA1LjkzNTE1OCA0MDUuOTM1MTU4IDAgMCAxIDIxMC42MjA2MzEtNS42MDUwNTJjNjkuMjAwODQyIDE0LjQ0Mzc4OSAxMzcuNzU0OTQ3IDMyLjk4MzU3OSAyMTAuNjIwNjMyIDUwLjY2MTA1Mmw1OS40OTk3ODktMTQzLjM2SDI2NS4xNjIxMDV2LTYyLjUxNzg5NWgyMTEuMjY3MzY5di01MS4wOTIyMUgyMjQuNjMzMjYzdi01MS41MjMzNjhoMjUyLjY1ODUyNlYxMDkuNzI5Njg0aDEzMi4zNjU0NzR2MTI1LjAzNTc5aDI0OS4yMDkyNjN2NTEuMDkyMjFINjEwLjczNTE1OHY1Mi4xNzAxMDVoMTk5LjE5NDk0N2E4MDAuNjYwMjExIDgwMC42NjAyMTEgMCAwIDEtODYuMjMxNTc5IDIzMS4xMDA2MzJjNDcuMjExNzg5IDE0Ljg3NDk0NyA5My4zNDU2ODQgMjguNjcyIDEzOS4yNjQgNDMuMTE1NzlxODAuMTk1MzY4IDI3LjU5NDEwNSAxNjEuMDM3NDc0IDU2LjA1MDUyNlYyMTkuNjc0OTQ3QTIxOS42NzQ5NDcgMjE5LjY3NDk0NyAwIDAgMCA4MDQuMzI1MDUzIDBIMjE5LjY3NDk0N0EyMTkuNjc0OTQ3IDIxOS42NzQ5NDcgMCAwIDAgMCAyMTkuNjc0OTQ3djU4NC42NTAxMDZBMjE5LjY3NDk0NyAyMTkuNjc0OTQ3IDAgMCAwIDIxOS42NzQ5NDcgMTAyNGg1ODQuNjUwMTA2YTIxOS40NTkzNjggMjE5LjQ1OTM2OCAwIDAgMCAyMTguNTk3MDUyLTE5OS4xOTQ5NDdjLTIuNTg2OTQ3LTEuMDc3ODk1LTUuMzg5NDc0LTEuOTQwMjExLTcuOTc2NDIxLTMuMjMzNjg1eiIgZmlsbD0iIzEyOTZkYiIgcC1pZD0iNDYyMyI+PC9wYXRoPjxwYXRoIGQ9Ik0yMzUuNjI3Nzg5IDU0OC44NjRhMTA3Ljc4OTQ3NCAxMDcuNzg5NDc0IDAgMCAwIDAgMjE1LjU3ODk0NyAzMDQuMTgxODk1IDMwNC4xODE4OTUgMCAwIDAgMTY1LjU2NDYzMi0xOC45NzA5NDcgMzM2LjUxODczNyAzMzYuNTE4NzM3IDAgMCAwIDE2NC40ODY3MzctMTI0LjgyMDIxMWMtNzEuMzU2NjMyLTM5LjY2NjUyNi0xNDMuMTQ0NDIxLTc1LjAyMTQ3NC0yMjYuMTQyMzE2LTc2LjUzMDUyNmE0NTkuMzk4NzM3IDQ1OS4zOTg3MzcgMCAwIDAtMTAzLjkwOTA1MyA0Ljc0MjczN3oiIGZpbGw9IiMxMjk2ZGIiIHAtaWQ9IjQ2MjQiPjwvcGF0aD48L3N2Zz4=',
                            x: null,
                            y: null,
                            height: 42,
                            width: 42,
                            excavate: true,
                        }}
                    />
                </div>
                <div className={styles['footer']}>打开手机支付宝，扫一扫付款</div>
            </>
        );
    };

    return (
        <Modal
            wrapClassName={styles['warpper']}
            title="扫码支付"
            visible={visible}
            footer={null}
            width={500}
            onCancel={onClose}
        >
            {render()}
        </Modal>
    );
};
