import { observer } from 'mobx-react-lite';
import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {Button, Icon } from 'semantic-ui-react';

import { FACEBOOK_APP_ID } from '../../app/defs/socialConfigs';

interface IProps {
    fbCallback: (response: any) => void;
    loading: boolean;
}

const SocialLogin: React.FC<IProps> = ({fbCallback, loading}) => {
    return(
        <div>
            <FacebookLogin
                appId={FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={fbCallback}
                render={(renderProps: any) => (
                    <Button loading={loading} onClick={renderProps.onClick} type="button" fluid color="facebook">
                        <Icon name="facebook" />
                        Login with Facebook
                    </Button>
                )}
            />
        </div>
    );
}

export default observer(SocialLogin);