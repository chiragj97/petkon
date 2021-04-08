import React from "react";
import { useSelector } from "react-redux";

import Box from "@material-ui/core/Box";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import DeleteIcon from "@material-ui/icons/Delete";

export default function UserDetails({ _deleteCustomer, _editCustomer }) {
  const customerData = useSelector(({ selectedData }) => selectedData.customerData);

  const {
    _id,
    userFormType,
    name,
    email,
    phoneNumber,
    building,
    street,
    city,
    country,
    zipCode,
    SBuilding,
    SStreet,
    SCity,
    SState,
    SCountry,
    SZipCode,
    GSTTreatment,
    Placeofsupply,
    GSTNumber,
    CIN,
    TaxPreference,
    creditLimitTime,
    creditLimitAmount,
    currency,
    openingBalance,

    customerType,
    customerCategory,

    supplierType,
    supplierCategory,

    userType,
  } = customerData;

  const DisplayP = (label, value) =>
    Boolean(value) && (
      <p>
        {label} : {value}
      </p>
    );

  return (
    <Card style={{ margin: 0 }}>
      <CardBody>
        <div className="d-flex justify-content-between" style={{ alignItems: "center" }}>
          <div>
            <h4 style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "inherit" }}>Details User</h4>
          </div>
          <div>
            <Button onClick={() => _editCustomer()} type="submit" color="primary">
              Update User
            </Button>
            <Button onClick={() => _deleteCustomer(_id)} color="danger" type="button" startIcon={<DeleteIcon />}>
              Delete User
            </Button>
          </div>
        </div>
        <Box flexDirection="column" display="flex" justifyContent="space-between">
          <GridContainer style={{ textTransform: "capitalize", fontSize: "16px", fontFamily: "Poppins" }}>
            <GridItem xs>
              {DisplayP("ID", String(_id).substr(0, 6))}
              {DisplayP("user Form Type", userFormType)}
              {DisplayP("Name", name)}
              {DisplayP("Email", email)}
              {DisplayP("phone Number", phoneNumber)}
              {userFormType === "Staff" && <p>user Type : {userType}</p>}
              {userFormType === "Customer" && (
                <>
                  {DisplayP("customer Type", customerType)}
                  {DisplayP("customer Category", customerCategory)}
                </>
              )}
              {userFormType === "Supplier" && (
                <>
                  {DisplayP("supplier Type", supplierType)}
                  {DisplayP("supplier Category", supplierCategory)}
                </>
              )}
            </GridItem>
            <GridItem xs>
              {userFormType !== "Staff" && (
                <div>
                  {DisplayP("Billing building", building)}
                  {DisplayP("Billing street", street)}
                  {DisplayP("Billing city", city)}
                  {DisplayP("Billing country", country)}
                  {DisplayP("Billing zipCode", zipCode)}
                  {DisplayP("Shipping Building", SBuilding)}
                  {DisplayP("Shipping Street", SStreet)}
                  {DisplayP("Shipping City", SCity)}
                  {DisplayP("Shipping state", SState)}
                  {DisplayP("Shipping Country", SCountry)}
                  {DisplayP("Shipping ZipCode", SZipCode)}
                  {DisplayP("GST Treatment", GSTTreatment)}
                  {DisplayP("Place of supply", Placeofsupply)}
                  {DisplayP("GST Number", GSTNumber)}
                  {DisplayP("CIN", CIN)}
                  {DisplayP("Tax Preference", TaxPreference)}
                  {DisplayP("credit Limit Time", creditLimitTime)}
                  {DisplayP("credit Limit Amount", creditLimitAmount)}
                  {DisplayP("currency", currency)}
                  {DisplayP("opening Balance", openingBalance)}
                </div>
              )}
            </GridItem>
          </GridContainer>
        </Box>
      </CardBody>
    </Card>
  );
}
