import React, { useContext} from 'react';
import {observer} from 'mobx-react-lite';
import { Item, Segment } from 'semantic-ui-react';

import ActivityStore from '../../../app/stores/activityStore';
import ActivityListItem from './ActivityListItem';

const ActivityList = () => {

    const activityStore  = useContext(ActivityStore);
    const { activitiesByDate } = activityStore;

    return (

        <Segment clearing>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <ActivityListItem activity={activity} />
                ))}
 
            </Item.Group>
        </Segment>

    );
};

export default observer(ActivityList);