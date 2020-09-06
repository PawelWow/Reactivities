import React, {useContext} from 'react';
import { observer } from 'mobx-react-lite';
import { Menu, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import ActivityStore from '../../app/stores/activityStore';

const NavBar = () => {
    const activityStore = useContext(ActivityStore);

    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header as={Link} exact to='/'>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={Link} to='/activities' />
                <Menu.Item>
                    <Button as={Link} to='/createActivity' positive content='Create Activity' />
                </Menu.Item>

            </Container>

        </Menu>        
    );
};

export default observer(NavBar);
