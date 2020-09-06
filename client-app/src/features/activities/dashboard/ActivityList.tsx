import React, {SyntheticEvent, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
    deleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    submitting: boolean;
    target: string;
    
}

const ActivityList: React.FC<IProps> = ({
    deleteActivity,
    submitting,
    target
 }) => {

    const activityStore  = useContext(ActivityStore);
    const {activities, selectActivity} = activityStore;
    return (

        <Segment clearing>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button 
                                    floated='right'
                                    content='View'
                                    color='blue'
                                    onClick={() => selectActivity(activity.id)}
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
                ))}
 
            </Item.Group>
        </Segment>

    );
};

export default observer(ActivityList);