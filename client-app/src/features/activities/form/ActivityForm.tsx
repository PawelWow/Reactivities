import React, {useState, FormEvent, useContext, useEffect} from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid} from 'uuid';
import { observer } from 'mobx-react-lite';

import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps } from 'react-router-dom';

interface IDetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<IDetailParams>> = ({
    match,
    history
}) => {
    const activityStore = useContext(ActivityStore);
    const {
        createActivity,
        editActivity,
        submitting,
        activity: initialFormState,
        loadActivity,
        clearActivity
    } = activityStore;

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(() => {
                initialFormState && setActivity(initialFormState);
            });
        }

        return () => {
            clearActivity();
        }
    }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length]);

    const onInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({...activity, [name]: value });
    }

    const onFormSubmit = () => {
        if( activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }

            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        }else {
            editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }



    return(
        <Segment clearing>
            <Form>
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={onInputChange} />
                <Form.TextArea rows={2} placeholder='Description' name='description' value={activity.description} onChange={onInputChange} />
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={onInputChange} />
                <Form.Input type="datetime-local" placeholder='Date' name='date' value={activity.date} onChange={onInputChange} />
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={onInputChange} />
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={onInputChange}/>
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' onClick={onFormSubmit} />
                <Button                    
                    floated='right'
                    type='submit'
                    content='Cancel'
                    onClick={() => history.push('/activities')}
                />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);