import React, {useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChats from './ActivityDetailedChats';
import ActivityDetailedSideBar from './ActivityDetailedSideBar';
import { Grid } from 'semantic-ui-react';

interface IDetailParams {
    id: string;
};

const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {activity, loadActivity, loadingInitial } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id]);

    if(loadingInitial || !activity) {
        return <LoadingComponent content="Loading activity..." />;
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailsHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChats />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);