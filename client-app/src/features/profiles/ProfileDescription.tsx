import React, { useContext, useState } from 'react';
import { Card, Header, Tab, Image, Button, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfileDescription = () => {

    const [editMode, setEditMode] = useState(false);

    const rootStore = useContext(RootStoreContext);
    const { isCurrentUser } = rootStore.profileStore;

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated='left' icon='user'>About (user_name)</Header>
                    { 
                        isCurrentUser && (
                            <Button
                                floated='right'
                                basic
                                content={editMode ? 'Cancel' : 'Edit profile'}
                                onClick={() => setEditMode(!editMode)}
                            />
                        )
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {
                        editMode ? (
                        <div>Formularz edycji</div>
                        ) : (
                        <div>
                            BIO usera
                        </div>
                        )
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}

export default ProfileDescription;