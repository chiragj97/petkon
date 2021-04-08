import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import LinearProgress from "@material-ui/core/LinearProgress";

import { bulkUpload_Inventory, bulk_upload_sample } from "ApiService";
import { useHistory } from "react-router-dom";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "50px 20px",
  borderWidth: 2,
  borderRadius: 10,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  outline: "none",
  transition: "border .24s ease-in-out",
  fontFamily: "Poppins",
  color: "#0b2559",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const cardIconstyle = {
  fontSize: "40px",
};

export default function MyDropzone() {
  const history = useHistory();
  const [isLoading, setisLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const fomrData = new FormData();
      fomrData.append("xlsxFile", acceptedFiles[0]);
      setisLoading(true);

      bulkUpload_Inventory(fomrData).then(() => {
        setisLoading(false);
        toast.success("Added customer success");
        // goHome();
        history.push("/app/inventory/ListInventory");
      });
    }
  }, []);

  const downloadSampleFile = () => {
    window.open(bulk_upload_sample, "_blank");
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <Card>
      <CardBody>
        <h3 className="card-title">Bulk Upload</h3>
        <div style={{ marginTop: "50px" }} className="d-flex justify-content-between align-items-center">
          <div>
            <div
              className="d-flex justify-content-between align-items-center card-icon-container"
              style={{ padding: "20px" }}
            >
              <div
                className="d-flex justify-content-center align-items-center "
                style={{
                  backgroundColor: "#CED5E1",
                  borderRadius: "60px",
                  width: "60px",
                  height: "60px",
                }}
              >
                <i className="fa fa-cube" aria-hidden="true" style={cardIconstyle} />
              </div>
              <div style={{ marginLeft: "15px" }}>
                <p style={{ fontWeight: "600" }}>1.Download the Template below</p>
                <p style={{ fontWeight: "600" }}>2.Add your Inventory data according to the columns</p>
                <p style={{ fontWeight: "600" }}>3.Upload the filled xlxs file back here</p>
              </div>
            </div>

            <br />
            <Button onClick={downloadSampleFile} color="primary">
              xlxs Template for inventory bulk upload
            </Button>
          </div>
          <div style={{ height: "230px" }}>
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the only excel files here ...</p>
              ) : (
                <p>Drag 'n' drop your filled xlxs file here, or click to select files</p>
              )}
            </div>
          </div>
        </div>

        {isLoading && <LinearProgress />}
      </CardBody>
    </Card>
  );
}
