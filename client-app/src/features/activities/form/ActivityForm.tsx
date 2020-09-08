import React, {useState, FormEvent, useContext, useEffect} from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { IActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid} from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import {Form as FinalForm, Field} from 'react-final-form';

import ActivityStore from '../../../app/stores/activityStore';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { category } from '../../../app/common/options/categoryOptions';
import { combineDateAndTime } from '../../../app/common/util/util';

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

    const [activity, setActivity] = useState<IActivityFormValues>({
        id: undefined,
        title: '',
        category: '',
        description: '',
        date: undefined,
        time: undefined,
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(match.params.id && activity.id) {
            loadActivity(match.params.id).then(() => {
                initialFormState && setActivity(initialFormState);
            });
        }

        return () => {
            clearActivity();
        }
    }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id]);

    const onInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({...activity, [name]: value });
    }

    // const onFormSubmit = () => {
    //     if( activity.id.length === 0) {
    //         let newActivity = {
    //             ...activity,
    //             id: uuid()
    //         }

    //         createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    //     }else {
    //         editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    //     }
    // }

    const onFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;
        console.log(activity);
    }


    return(
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm onSubmit={onFinalFormSubmit} render={({handleSubmit}) => (
                        <Form onSubmit={handleSubmit}>
                            <Field
                                component={TextInput}
                                placeholder='Title'
                                name='title'
                                value={activity.title}
                            />
                            <Field
                                component={TextAreaInput}
                                rows={3}
                                placeholder='Description'
                                name='description'
                                value={activity.description}
                            />
                            <Field
                                component={SelectInput}
                                placeholder='Category'
                                name='category'
                                options={category}
                                value={activity.category}
                            />
                            <Form.Group widths='equal'>
                                <Field<Date>
                                    component={DateInput}
                                    type="datetime-local"
                                    placeholder='Date'
                                    name='date'
                                    date
                                    value={activity.date}
                                />
                                <Field<Date>
                                    component={DateInput}
                                    type="datetime-local"
                                    placeholder='Time'
                                    name='time'
                                    time
                                    value={activity.time}
                                />
                            </Form.Group>

                            <Field
                                component={TextInput}
                                placeholder='City'
                                name='city'
                                value={activity.city}
                            />
                            <Field
                                component={TextInput}
                                placeholder='Venue'
                                name='venue'
                                value={activity.venue}
                            />
                            <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                            <Button                    
                                floated='right'
                                type='submit'
                                content='Cancel'
                                onClick={() => history.push('/activities')}
                            />
                        </Form>
                    )} />

                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);