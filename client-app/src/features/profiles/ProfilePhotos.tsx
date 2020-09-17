import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Card, Header, Tab, Image, Button, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        profile,
        isCurrentUser,
        uploadPhoto,
        uploadingPhoto,
        setMainPhoto,
        loading,
        deletePhoto
    } = rootStore.profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [uploadTarget, setuploadTarget] = useState<string | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

    const onImageUpload = (photo: Blob) => {
        uploadPhoto(photo).then(() => setAddPhotoMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated='left' icon='image' content='Photos' />
                    { 
                        isCurrentUser && (
                            <Button
                                floated='right'
                                basic
                                content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                                onClick={() => setAddPhotoMode(!addPhotoMode)}
                            />
                        )
                    }
                </Grid.Column>

                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={onImageUpload} loading={uploadingPhoto} />
                    ): (
                        <Card.Group itemsPerRow={5}>
                        {    
                            profile && profile.photos.map( photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                                name={photo.id}
                                                onClick={(e) => {                                                    
                                                    setMainPhoto(photo);
                                                    setuploadTarget(e.currentTarget.name);
                                                }} 
                                                loading={loading && uploadTarget === photo.id}
                                                disabled={photo.isMain || loading}
                                                basic
                                                positive
                                                content='Main'
                                            />
                                            <Button
                                                name={photo.id}
                                                disabled={photo.isMain || loading}
                                                onClick={e => {
                                                    deletePhoto(photo);
                                                    setDeleteTarget(e.currentTarget.name);

                                                    // bug: jeśli ustawiłem jakiś obrazek jako main to kliknięcie delete wywoła
                                                    // loading indicator na przycisku obrazka głównego
                                                    // solutio: albo osobne loadingi, albo wyczyścić target na undefined
                                                    setuploadTarget(undefined);
                                                    // przy tak małej logice możnaby jednak rozdzielić na loadingOnDelete 
                                                    // oraz loadingOnUpload
                                                }}
                                                loading={loading && deleteTarget === photo.id}
                                                basic
                                                negative
                                                icon='trash'
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))
                        }
                    </Card.Group>
                    )}

                </Grid.Column>
            </Grid>           

        </Tab.Pane>
    );
};

export default observer(ProfilePhotos);