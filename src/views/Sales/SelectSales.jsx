import React from "react";
import Select from "react-select";
import Button from "components/CustomButtons/Button.js";
import Dialog from "components/Dialog";
import { useHistory } from "react-router";

export default function SelectSales({
  allCustomer,
  setclientId,
  openDialog,
  closeDialog,
  clientId,
  isSalesSelect,
  setisSalesSelect,
}) {
  const history = useHistory();
  return (
    <div>
      <div className="d-flex justify-content-between">
        {clientId && (
          <p style={{ fontSize: "15px", fontWeight: "500" }}>
            Selected Sales Customer : {allCustomer.find((item) => item._id === clientId).name}
          </p>
        )}
        <Button size="sm" round color="primary" onClick={() => setisSalesSelect(true)}>
          Change sales cutsomer
        </Button>
      </div>

      <Dialog open={isSalesSelect} setOpen={setisSalesSelect} onClose={() => history.push("/app/dashboard")}>
        <div style={{ minHeight: "300px" }}>
          <h2 className="text-center">Select Customer Sales Name</h2>
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => {
                closeDialog();
                openDialog();
              }}
              round
              color="primary"
            >
              Add Sales customer
            </Button>
          </div>

          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select Customer Sales Name"
            options={allCustomer.map(({ name, _id }) => ({ label: name, value: _id }))}
            isSearchable
            isClearable
            onChange={({ value }) => setclientId(value)}
          />
        </div>
      </Dialog>
    </div>
  );
}
