import React, {useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
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
    const rootStore = useContext(RootStoreContext);
    const {activity, loadActivity, loadingInitial } = rootStore.activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id, history]);

    if(loadingInitial) {
        return <LoadingComponent content="Loading activity..." />;
    }

    if(!activity) {
        return <h2>Not found</h2>;
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