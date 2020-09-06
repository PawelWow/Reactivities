import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment, Icon } from 'semantic-ui-react';

import ActivityStore from '../../../app/stores/activityStore';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {

    const activityStore  = useContext(ActivityStore);
    const {deleteActivity, target, submitting} = activityStore;

    return(
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>Hosted by Paweł</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> { activity.date }
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
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
            </Segment>
        </Segment.Group>

    );
};

export default ActivityListItem;