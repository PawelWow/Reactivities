import React, {useState, useContext, useEffect} from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid} from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import {Form as FinalForm, Field} from 'react-final-form';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';

import ActivityStore from '../../../app/stores/activityStore';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { category } from '../../../app/common/options/categoryOptions';
import { combineDateAndTime } from '../../../app/common/util/util';

const validate = combineValidators({
    title: isRequired({ message: 'The event title is required' }),
    category: isRequired('Category'),
    description: composeValidators(
      isRequired('Description'),
      hasLengthGreaterThan(4)({
        message: 'Description needs to be at least 5 characters'
      })
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

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
        loadActivity,
    } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(match.params.id) {
            setIsLoading(true);
            loadActivity(match.params.id)
                .then(activity => {
                    setActivity(new ActivityFormValues(activity));
                })
                .finally(() => setIsLoading(false));       
        }
    }, [loadActivity, match.params.id]);

    const onFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;
        if(!activity.id){
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    // TODO coś jest nie tak - przy edycji nei zczytuje values, pomimo, że value jest podane

    return(
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={onFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={isLoading}>
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
                                <Button loading={submitting} disabled={isLoading} floated='right' positive type='submit' content='Submit' />
                                <Button   
                                    disabled={isLoading || invalid || pristine}                 
                                    floated='right'
                                    type='submit'
                                    content='Cancel'
                                    onClick={
                                        activity.id 
                                        ? () => history.push(`/activities/${activity.id}`)
                                        : () => history.push('/activities')
                                    }
                                />
                            </Form>
                    )} />

                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);