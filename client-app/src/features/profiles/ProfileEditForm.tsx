import React, { useContext } from 'react';
import { Form as FinalForm, Field} from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import { combineValidators, isRequired } from 'revalidate';

import { RootStoreContext } from '../../app/stores/rootStore';
import { IProfileFormValues } from '../../app/models/profile';
import TextInput from '../../app/common/form/TextInput';
import ErrorMessage from '../../app/common/form/ErrorMessage';

const validate = combineValidators({
    displayName: isRequired('displayName'),
    bio: isRequired('bio'),
});

const ProfileEditForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, editProfile } = rootStore.profileStore;

    return (
        <FinalForm onSubmit={(values: IProfileFormValues) => editProfile(values).catch(error => ({
            [FORM_ERROR]: error
        }))}
            validate={validate}
            render={({
                handleSubmit,
                submitting,                
                submitError,
                invalid,
                pristine,
                dirtySinceLastSubmit,
            }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as ='h2' content='Edit profile' color='teal' textAlign='center' />
                    <Field 
                        name='displayName'
                        component={TextInput}
                        pceholder='Display name'
                        initialValue={profile!.displayName}
                    /> 

                    <Field 
                        name='bio'
                        component={TextInput}
                        placeholder='Bio'
                        initialValue={profile!.bio}
                    />                      
                    {submitError && <ErrorMessage error={submitError} />}
                    <br />
                    <Button 
                        floated='right' 
                        disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                        loading={submitting}
                        color='teal'
                        content='Update'   
                        
                    />     
                </Form>
            )}
        />
    );
}

export default ProfileEditForm;