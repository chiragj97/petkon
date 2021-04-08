import React from "react";
import { useSelector } from "react-redux";

import Box from "@material-ui/core/Box";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { ROOT_API } from "ApiService";
import DescriptionIcon from "@material-ui/icons/Description";
import Button from "components/CustomButtons/Button.js";
import DeleteIcon from "@material-ui/icons/Delete";

export default function DetailsExpense({ _deleteexpenseManager, _editexpenseManager }) {
  const ExpenseData = useSelector(({ selectedData }) => selectedData.ExpenseData);
  const {
    _id,
    date,
    type,
    Amount,
    expenseFile,
    paidThrough,
    category,
    subcategory,
    name,
    GST,
    GSTtreatment,
    reimbursement,
    sourceOfSupply,
    destinationOfSupply,
    taxRate,
    invoiceNumber,
    notes,
    referenceNumber,
    DepositTo,
    taxDdeducted,
  } = ExpenseData;

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
            <h4 style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "inherit" }}>Details Expense Manager</h4>
          </div>
          <div>
            <Button onClick={() => _editexpenseManager(ExpenseData.type)} type="submit" color="primary">
              Update Expense
            </Button>
            <Button onClick={() => _deleteexpenseManager(_id)} color="danger" type="button" startIcon={<DeleteIcon />}>
              Delete Expense
            </Button>
          </div>
        </div>
        <Box flexDirection="column" display="flex" justifyContent="space-between">
          <GridContainer style={{ textTransform: "capitalize", fontSize: "16px", fontFamily: "Poppins" }}>
            <GridItem xs>
              <p className="d-flex">
                invoice : <DescriptionIcon onClick={() => window.open(`${ROOT_API}/${expenseFile}`, "_blank")} />
              </p>
              <p>Invoice no : {String(_id).substr(0, 6)}</p>
              <p>type : {type}</p>
              <p>Date : {new Date(date).toLocaleDateString()}</p>
              <p>Invoice Value : &#8377;{Amount}</p>
            </GridItem>
            <GridItem xs>
              {DisplayP("Category", category)}
              {DisplayP("Sub category", subcategory)}
              {DisplayP("Name", name)}
              {DisplayP("GST", GST)}
              {DisplayP("Reference Number", referenceNumber)}
              {DisplayP("Paid Through", paidThrough)}
              {DisplayP("Reimbursement", reimbursement)}
              {DisplayP("Source Of Supply", sourceOfSupply)}
              {DisplayP("Destination Of Supply", destinationOfSupply)}
              {DisplayP("Tax Rate", taxRate)}
              {DisplayP("Invoice Number", invoiceNumber)}
              {DisplayP("Notes", notes)}
              {DisplayP("Deposit To", DepositTo)}
              {DisplayP("Tax Ddeducted", taxDdeducted)}
              {DisplayP("GST treatment", GSTtreatment)}
            </GridItem>
          </GridContainer>
        </Box>
      </CardBody>
    </Card>
  );
}
