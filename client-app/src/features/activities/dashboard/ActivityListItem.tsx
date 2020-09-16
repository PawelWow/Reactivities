import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment, Icon } from 'semantic-ui-react';
import { format } from 'date-fns';

import { RootStoreContext } from '../../../app/stores/rootStore';
import { IActivity } from '../../../app/models/activity';
import ActivityListItemAttendees from './ActivityListItemAttendees';

interface IProps {
    activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {

    const rootStore  = useContext(RootStoreContext);
    const {deleteActivity, target, submitting} = rootStore.activityStore;

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
                <Icon name='clock' /> { format(activity.date, 'h:mm a') }
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees} />
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