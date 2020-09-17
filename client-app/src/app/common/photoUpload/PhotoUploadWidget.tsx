import { observer } from 'mobx-react-lite';
import React, { Fragment, useEffect, useState } from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';

import PhotoWidgetDropzone from './PhotoWidgetDropzone';

const PhotoUploadWidget = () => {
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        // cleanup wymagany, żeby nie pozostawiać urli w pamięci. W przeciwnym wypadku będą memory leaki
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        }
    });

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={4}>
                    <PhotoWidgetDropzone setFiles={setFiles} />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 2 -Resize mode' />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 3 - Preview & Upload' />
                    {
                        files.length > 0 && <Image src={files[0].preview} />
                    }
                    
                </Grid.Column>
            </Grid>
        </Fragment>
    );
};

export default observer(PhotoUploadWidget);