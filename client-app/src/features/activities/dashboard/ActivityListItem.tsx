import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment } from 'semantic-ui-react';

import ActivityStore from '../../../app/stores/activityStore';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {

    const activityStore  = useContext(ActivityStore);
    const {deleteActivity, target, submitting} = activityStore;

    return(
        <Item key={activity.id}>
        <Item.Content>
            <Item.Header as='a'>{activity.title}</Item.Header>
            <Item.Meta>{activity.date}</Item.Meta>
            <Item.Description>
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
            </Item.Description>
            <Item.Extra>
                <Button 
                    as={Link} to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='blue'                                    
                />
                <Button 
                    name={activity.id}
                    floated='right'
                    content='Delete'
                    color='red'
                    loading={target === activity.id && submitting}
                    onClick={(e) => deleteActivity(e, activity.id)}
                />
                <Label basic content='Category' />
            </Item.Extra>
        </Item.Content>
    </Item>
    );
};

export default ActivityListItem;