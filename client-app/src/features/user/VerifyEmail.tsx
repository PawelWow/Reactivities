import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';

const VerifyEmail: React.FC<RouteComponentProps> = ({location}) => {
    const rootStore = useContext(RootStoreContext);
    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success'
    }

    const [status, setStatus] = useState(Status.Verifying);
    const {openModal} = rootStore.modalStore;
    const { token, email} = queryString.parse(location.search);

    useEffect(() => {
        agent.User.verifyEmail(token as string, email as string).then(() => {
            setStatus(Status.Success);
        }).catch(() => {
            setStatus(Status.Failed);
        });
    }, [Status.Failed, Status.Success, token, email]);


    const onButtonConfirmEmailResendClick = () => {
        agent.User.resendVerifyEmailConfirm(email as string).then(() => {
            toast.success('Verification email resent - please check your inbox');
        }).catch(error => console.log(error));
    }

    const getBody = () => {
        switch(status) {
            case Status.Verifying:
                return <p>Verifying...</p>
            
            case Status.Failed: 
                return (
                    <div className="center">
                        <p>Verification failed - try resending the verification email</p>
                        <Button primary onClick={onButtonConfirmEmailResendClick} size='huge' content='Resend email' />
                    </div>
                );
                
            case Status.Success:
                return (
                    <div className="center">
                        <p>Email has been verified - please login</p>
                        <Button primary onClick={() => openModal(<LoginForm />)} size='large' content='Login' />
                    </div>
                );
        }
    }

    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='envelope' />
                Email Verification
            </Header>

            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    );
}

export default VerifyEmail;