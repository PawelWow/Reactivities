import React, { useContext, useState } from 'react';
import { Header, Tab, Button, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileEditForm';

const ProfileDescription = () => {

    const [editMode, setEditMode] = useState(false);

    const rootStore = useContext(RootStoreContext);
    const { isCurrentUser, profile } = rootStore.profileStore;

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated='left' icon='user' content={`About ${profile!.displayName}`} /> 
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
                        <ProfileEditForm />
                        ) : (
                        <div>
                            {profile!.bio}
                        </div>
                        )
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}

export default observer(ProfileDescription);