import React, { SyntheticEvent, useContext } from 'react';
import {observer} from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';

import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';

import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

const ActivityDashboard = () => {
     const activityStore = useContext(ActivityStore);
     const { editMode, selectedActivity } = activityStore;
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && <ActivityDetails /> }
                {editMode && <ActivityForm
                        key={(selectedActivity && selectedActivity.id) || 0}
                        activity={selectedActivity!}
                    />}
                
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);