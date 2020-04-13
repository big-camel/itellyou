import React, { useEffect, useState } from 'react';
import { Popover, Avatar } from 'antd';
import { Link, useDispatch, useSelector } from 'umi';
import Loading from '@/components/Loading';
import styles from './index.less';
import Star from '../Star';

export default ({ id, placement, children }) => {
    placement = placement || 'bottomLeft';
    const dispatch = useDispatch();
    const detail = useSelector(state => state.tag.detail[id]);
    const loadingState = useSelector(state => state.loading);
    const loading = loadingState.effects['tag/find'];

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible && !detail && id) {
            dispatch({
                type: 'tag/find',
                payload: {
                    id,
                },
            });
        }
    }, [id, visible, detail, dispatch]);

    const renderContent = () => {
        if (!detail || loading) {
            return <Loading />;
        }
        const {
            id,
            name,
            description,
            avatar,
            use_star,
            question_count,
            article_count,
            star_count,
        } = detail;

        return (
            <div className={styles['tag-card']}>
                <h2 className={styles['title']}>
                    <Link to={`/tag/${id}`}>{name}</Link>
                </h2>
                <div className={styles['body']}>
                    {description && description !== '' ? description : '暂无介绍'}
                </div>
                <div className={styles['footer']}>
                    <div className={styles['follow']}>
                        <div className={styles['item']}>
                            问题<span className={styles['count']}>{question_count}</span>
                        </div>
                        <div className={styles['item']}>
                            文章<span className={styles['count']}>{article_count}</span>
                        </div>
                        <div className={styles['item']}>
                            关注者<span className={styles['count']}>{star_count}</span>
                        </div>
                    </div>
                    <Star id={id} name={name} use_star={use_star} />
                </div>
            </div>
        );
    };

    return (
        <Popover
            target="hover"
            arrowPointAtCenter
            mouseEnterDelay={1}
            onVisibleChange={visible => setVisible(visible)}
            content={renderContent()}
            placement={placement}
        >
            {children}
        </Popover>
    );
};
