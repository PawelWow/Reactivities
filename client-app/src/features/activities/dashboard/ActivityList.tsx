import React from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activities: IActivity[],
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
    
}

const ActivityList: React.FC<IProps> = ({
    activities,
    selectActivity,
    deleteActivity,
    submitting
 }) => {
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
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                    loading={submitting}
                                    onClick={() => deleteActivity(activity.id)}
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

export default ActivityList;