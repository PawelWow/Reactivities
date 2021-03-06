import { SyntheticEvent } from 'react';
import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { IActivity, IAttendee } from '../models/activity';
import { history } from '../..';
import { RootStore } from './rootStore';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { setActivityProps, createAttendee } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const LIMIT = 2;

export default class ActivityStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            }
        );
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target: string = '';
    @observable loading = false;

    @observable.ref hubConnection: HubConnection | null = null;

    @observable activityCount = 0;
    @observable page = 0;

    @observable predicate = new Map();

    @action setPredicate = (predicate: string, value: string | Date) => {
        this.predicate.clear();
        if(predicate !== 'all'){
            this.predicate.set(predicate, value);
        }
    }

    @computed get axiosParams(){
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value, key) => {
            if(key === 'startDate') {
                params.append(key, value.toISOString());
            }else {
                params.append(key, value);
            };
        });

        return params;
    }

    @computed get totalPages(){
        return Math.ceil(this.activityCount / LIMIT);
    }

    @action setPage = (page: number) => {
        this.page = page
    }

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {
                
                if(this.hubConnection!.state !== 'Connected'){
                    // REV: quick fix - not shure it is ok but works
                    // for some reason invokes are done too fast and errors occur because of 'Connecting' state
                    // repro: choose activity, leave activity page, choose activity again
                    // seems like start().then() does not means the connection is established
                    // check ActivityDetailedChats useEffects and its dependencies 

                    console.log('No actions because of invalid state.');
                    return;
                }

                console.log('Join group attempt');
                this.hubConnection!.invoke('AddToGroup', activityId).catch(error => {
                    // REV: handling error is the solution too, but I know the state is incorrect so I return earlier
                    // just for case leave this handler because there may be another error
                    console.log('Join group attempt failed');
                    console.log(error);
                });

            })
            .catch(error => console.log('Error establishing connection: ', error));

            this.hubConnection.on('ReceiveComment', comment => {
                runInAction(() => {
                    this.activity!.comments.push(comment);
                });
            });
    
            this.hubConnection?.on('Send', message => {
                toast.info(message);
            });

    };

    @action stopHubConnection = () => {
        // REV Error: Cannot send data if the connection is not in the 'Connected' State
        // repro: choose activity, leave activity page, choose activity again
        // handle error here

        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id).then(() => {
            this.hubConnection!.stop();
        }).then(() => console.log('Connection stopped...'))
        .catch(error => {
            console.log("Could not stop connection");
            console.log(error);
        });


    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;

        try {
            // SendComment is the name of method of Reactivities\API\SignalR\ChatHub.cs class.
            await this.hubConnection!.invoke('SendComment', values);
        } catch (error) {
            runInAction(() => {
                console.log(error);
                toast.error('Could not send the comment...');
            });

        }
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    };

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort( (a, b) => a.date.getTime() - b.date.getTime());

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;

        }, {} as {[key: string]: IActivity[]}));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        
        try {
            const activitiesEnvelop = await agent.Activities.list(this.axiosParams);
            const { activities, activitiesCount: activityCount } = activitiesEnvelop;

            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!)
                    this.activityRegistry.set(activity.id, activity);
                });

                this.activityCount = activityCount;
            });

        } catch (error) {
            runInAction(() => {
                console.log(error);
            });

        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            });

        }
    };

    @action loadActivity = async(id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.activity = activity;

            // toJS - deep clone to have observable
            return  toJS(activity);
        }

        this.loadingInitial = true;
        try {
            activity = await agent.Activities.details(id);
            runInAction('getting activity', () =>{
                setActivityProps(activity, this.rootStore.userStore.user!);
                this.activity = activity;
                this.activityRegistry.set(activity.id, activity);
            });

            return activity;
        } catch (error) {
            runInAction(() =>{
                console.log(error);
            });
            
        } finally {
            runInAction(() =>{
                this.loadingInitial = false;
            });
        } 

    };

    @action clearActivity = () => {
        this.activity = null;
    };

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    createAttendeesForNewActivity = () : IAttendee[] => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        attendee.isHost = true;
        let attendees = [];
        attendees.push(attendee);

        return attendees;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const attendees = this.createAttendeesForNewActivity();
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction('creating new activity', () => {
                this.activityRegistry.set(activity.id, activity);
            });

            history.push(`/activities/${activity.id}`);
         
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });

            toast.error('Could not create actvity');
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action editActivity = async(activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });


        } catch (error) {
            runInAction(() => {
                console.log(error);
            });

            toast.error('Could not edit actvity');

        }finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
            });

        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        } finally {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            });
        }
    };

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if( this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
            });
        } catch (error) {
            toast.error('Problem signing up to activity');
        } finally {
            runInAction(() => {
                this.loading = false;
            });            
        }


    }

    @action cancelAttendance = async () => {

        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if( this.activity) {
                    this.activity.attendees = this.activity.attendees.filter( 
                        a => a.username !== this.rootStore.userStore.user?.username
                    );
                    
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
            });
            
        } catch (error) {
            toast.error('Problem cancell attendance of activity');
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}