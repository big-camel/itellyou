import React, { useState } from 'react';
import Container from './Container';
import Logo from './Logo';
import Navigation from './Navigation';
import User from './User';
import TopSearch from './Search';
import Burger from './Burger';

export default ({ mode, ...props }) => {
    const { location, isMobile } = props;
    const [visible, setVisible] = useState(false);
    const query = location ? location.query || {} : {};
    const render = () => {
        if (isMobile) {
            return (
                <>
                    <Burger
                        visible={visible}
                        onChange={setVisible}
                        menu={
                            <>
                                <TopSearch
                                    isMobile={isMobile}
                                    defaultValue={query.q || ''}
                                    type={query.t || ''}
                                    onSearch={() => setVisible(false)}
                                />
                                <Navigation {...props} onChange={() => setVisible(false)} />
                            </>
                        }
                    />
                    <Logo />
                    <User {...props} />
                </>
            );
        }
        return (
            <>
                <Logo />
                <Navigation {...props} />
                <TopSearch defaultValue={query.q || ''} type={query.t || ''} />
            </>
        );
    };
    return (
        <Container mode={mode} after={<User {...props} />}>
            {render()}
        </Container>
    );
};
