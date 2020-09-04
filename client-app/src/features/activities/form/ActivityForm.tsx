import React, {useState, FormEvent} from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid} from 'uuid';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    createACtivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;

}

const ActivityForm: React.FC<IProps> = ({setEditMode, activity: initialFormState, createACtivity, editActivity}) => {

    const initializeForm = () => {
        if(initialFormState){
            return initialFormState;
        }
        else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            };
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

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

            createACtivity(newActivity);
        }else {
            editActivity(activity);
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
                <Button floated='right' positive type='submit' content='Submit' onClick={onFormSubmit} />
                <Button
                    floated='right'
                    type='submit'
                    content='Cancel'
                    onClick={() => setEditMode(false)}
                />
            </Form>
        </Segment>
    );
};

export default ActivityForm;