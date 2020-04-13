import React, { useState } from 'react';
import { AdoptButton } from '@/components/Button';
import { useDispatch } from 'umi';
import { StarTwoTone } from '@ant-design/icons';

export default ({ id, question_id, allow_adopt, adopted }) => {
    const [adopting, setAdopting] = useState(false);
    const dispatch = useDispatch();

    const doAdopt = () => {
        if (adopting || adopted) return;
        setAdopting(true);
        dispatch({
            type: 'question/adopt',
            payload: {
                id: question_id,
                answer_id: id,
            },
        }).then(() => {
            setAdopting(false);
        });
    };

    if (!allow_adopt && !adopted) return null;

    return (
        <AdoptButton onClick={doAdopt} loading={adopting} active={adopted} type="primary">
            {adopted ? '已采纳' : '采纳答案'}
        </AdoptButton>
    );
};
