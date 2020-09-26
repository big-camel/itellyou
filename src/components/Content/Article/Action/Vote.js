import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { useDispatch } from 'umi';
import { SupportButton, OpposeButton } from '@/components/Button';

export default ({
    id,
    support,
    use_support,
    allow_support,
    oppose,
    use_oppose,
    allow_oppose,
    size,
}) => {
    const dispatch = useDispatch();
    const [voting, setVoting] = useState(false);
    const [voteType, setVoteType] = useState();

    const doVote = (type) => {
        if (voting) return;
        setVoteType(type);
        setVoting(true);
        dispatch({
            type: 'article/vote',
            payload: {
                id,
                type,
            },
        }).then(() => {
            setVoting(false);
        });
    };

    const renderSupport = () => (
        <SupportButton
            active={use_support}
            disabled={!allow_support}
            onClick={() => doVote('support')}
            loading={voting && voteType === 'support'}
            count={support}
            size={size}
        />
    );

    if (!allow_oppose) {
        return renderSupport();
    }

    return (
        <Space size="middle">
            {renderSupport()}
            {allow_oppose && (
                <OpposeButton
                    active={use_oppose}
                    onClick={() => doVote('oppose')}
                    loading={voting && voteType === 'oppose'}
                    size={size}
                />
            )}
        </Space>
    );
};
