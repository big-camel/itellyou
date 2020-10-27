import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import { List, Card } from 'antd';
import { StarTwoTone } from '@ant-design/icons';
import Loading from '@/components/Loading';
import { MoreList } from '@/components/List';
import { Answer } from '@/components/Content';
import { findVisibleSection } from '@/utils';
import styles from './index.less';

const fetchList = (dispatch, offset, limit, id, parmas) => {
    return dispatch({
        type: 'answer/list',
        payload: {
            question_id: id,
            offset,
            limit,
            append: offset > 0,
            ...parmas,
        },
    });
};

function AnswerList({ question_id, exclude, title, ...props }) {
    const page = parseInt(props.page || 1);
    const limit = parseInt(props.size || 20);
    const [offset, setOffset] = useState((page - 1) * limit);
    const dispatch = useDispatch();
    const list = useSelector((state) => (state.answer ? state.answer.list : null));
    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['answer/list'];

    const lastScrollTop = useRef(0);
    const timeout = useRef(null);
    const contents = useRef([]);

    const handleResize = useCallback(() => {
        listenerViewChange();
    }, []);

    const listenerViewChange = useCallback(() => {
        const indexArray = findVisibleSection(
            contents.current.map(({ element }) => {
                if (element) {
                    const elements = element.getElementsByClassName('anticon-like');
                    if (elements && elements.length > 0) {
                        return elements[0].parentNode;
                    }
                }
                return null;
            }),
        );
        // 记录回答浏览记录
        indexArray.forEach((index) => {
            dispatch({
                type: 'answer/view',
                payload: {
                    question_id,
                    id: contents.current[index].id,
                },
            });
            contents.current[index].element = undefined;
        });
    }, []);

    const handleScroll = useCallback(() => {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            const min = 5;
            const top =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;

            if (!Math.abs(lastScrollTop.current - top) <= min) {
                listenerViewChange();

                lastScrollTop.current = top;
            }
        }, 1000);
    }, []);

    useEffect(() => {
        listenerViewChange();
    }, [listenerViewChange]);

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

    if (loading) return <Loading />;

    let data = list ? list.data || [] : [];

    const adopts = [];
    const answers = [];
    data.forEach((item) => {
        if (!item || item.deleted) return;
        if (
            exclude &&
            ((Array.isArray(exclude) && exclude.indexOf(item.id) >= 0) || exclude === item.id)
        )
            return;
        if (item.adopted === true) {
            adopts.push(item);
        } else {
            answers.push(item);
        }
    });

    const renderHeader = () => {
        if (title) return <h2 className={styles['answer-title']}>{title}</h2>;
        return (
            <h2 className={styles['answer-title']}>
                {adopts.length > 0 ? '其它 ' : ''}
                {list ? list.total : 0} 个回答
            </h2>
        );
    };

    const renderItem = (item) => {
        return (
            <MoreList.Item key={item.id}>
                <Answer
                    ref={(element) => {
                        if (!contents.current.find((ele) => ele.id === item.id))
                            contents.current.push({ id: item.id, element });
                    }}
                    data={{ ...item, cover: null }}
                />
            </MoreList.Item>
        );
    };

    return (
        <div className={props.className}>
            {adopts.length > 0 && (
                <div className={styles['adopted-card']}>
                    <Card
                        title={
                            <h2 className={styles['answer-title']}>
                                <StarTwoTone /> 已采纳答案
                            </h2>
                        }
                    >
                        <List dataSource={adopts} renderItem={renderItem} />
                    </Card>
                </div>
            )}
            <Card title={renderHeader()}>
                <MoreList
                    dataSource={{ ...list, data: answers }}
                    renderItem={renderItem}
                    offset={offset}
                    limit={limit}
                    onChange={(offset) => {
                        setOffset(offset);
                        fetchList(dispatch, offset, limit, question_id);
                    }}
                    itemLayout="vertical"
                />
            </Card>
        </div>
    );
}

AnswerList.getInitialProps = async ({ isServer, id, store, params }) => {
    const { dispatch, getState } = store;

    if (id) {
        await fetchList(dispatch, 0, 20, id, params);
    }

    if (isServer) return getState();
};

export default AnswerList;
