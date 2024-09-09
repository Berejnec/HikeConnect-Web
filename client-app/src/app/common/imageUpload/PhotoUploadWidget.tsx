import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { PreviewFile } from "../../models/previewFile";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}
export default function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          uploadPhoto(blob);
        }
      });
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);
  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={2} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize image" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview ?? ""} />
        )}
      </Grid.Column>
      <Grid.Column width={2} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3 - Preview & Upload" />
        {files && files.length > 0 && (
          <>
            <div className="img-preview" style={{ minHeight: 200, overflow: "hidden" }}></div>

            <Button.Group widths={2}>
              <Button onClick={onCrop} positive icon="check" loading={loading}></Button>
              <Button onClick={() => setFiles([])} icon="close" disabled={loading}></Button>
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
