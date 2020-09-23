import React, { Fragment, useContext } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () =>{

    // reducing stringly typing
    const filter = {
        all: 'all',
        isHost: 'isHost',
        isGoing: 'isGoing',
        startDate: 'startDate'
    }

    const rootStore = useContext(RootStoreContext)
    const { predicate, setPredicate } = rootStore.activityStore;

    return (
        <Fragment>
            <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
                <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
                <Menu.Item
                    active={predicate.size === 0}
                    onClick={() => setPredicate(filter.all, 'true')}
                    color={'blue'}
                    name={'all'}
                    content={'All Activities'}
                />
                <Menu.Item
                    active={predicate.has(filter.isGoing)}
                    onClick={() => setPredicate(filter.isGoing, 'true')}
                    color={'blue'}
                    name={'username'}
                    content={'I am going'}
                />
                <Menu.Item
                    active={predicate.has(filter.isHost)}
                    onClick={() => setPredicate(filter.isHost, 'true')}
                    color={'blue'}
                    name={'host'}
                    content={'I am hosting'}
                />
            </Menu>
            <Header icon={'filter'} attached color={'teal'} content={'Select date'} />
            <Calendar
                onChange={(date) => setPredicate(filter.startDate, date!)}
                value={predicate.get(filter.startDate || new Date())}
            />
        </Fragment>
    );
};

export default observer(ActivityFilters);