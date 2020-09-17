import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Grid, Header } from 'semantic-ui-react';

const PhotoUploadWidget = () => {
    return (
        <Fragment>
            <Grid>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 1 - Add Photo' />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 2 -Resize mode' />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 3 - Preview & Upload' />
                </Grid.Column>
            </Grid>
        </Fragment>
    );
};

export default observer(PhotoUploadWidget);