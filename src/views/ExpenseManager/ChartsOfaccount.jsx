import React, { useEffect, useState } from "react";
import { Typography, Grid, Paper, TableRow, TableCell, Box } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import DescriptionIcon from "@material-ui/icons/Description";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Dialog from "components/Dialog";
import AddExpenseCategory from "./AddExpenseCategory";
import Button from "components/CustomButtons/Button.js";
import { getAllExpense, ROOT_API, getAllExpenseCategory } from "ApiService";

const ExpandedRow = ({ ExpenseData }) => {
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
    <Box flexDirection="column" display="flex" justifyContent="space-between">
      <GridContainer style={{ textTransform: "capitalize", fontSize: "16px", fontFamily: "Poppins" }}>
        <GridItem xs>
          <p className="d-flex">
            invoice : <DescriptionIcon onClick={() => window.open(`${ROOT_API}/${expenseFile}`, "_blank")} />
          </p>
          {DisplayP("Invoice no", String(_id).substr(0, 6))}
          {DisplayP("Type", type)}
          {DisplayP("Date", new Date(date).toLocaleDateString())}
          <p>Invoice Value : &#8377;{Amount}</p>
          {DisplayP("Category", category)}
          {DisplayP("Sub category", subcategory)}
          {DisplayP("GST", GST)}
          {DisplayP("Name", name)}
          {DisplayP("reference Number", referenceNumber)}
        </GridItem>
        <GridItem xs>
          {DisplayP("Paid Through", paidThrough)}
          {DisplayP("reimbursement", reimbursement)}
          {DisplayP("source Of Supply", sourceOfSupply)}
          {DisplayP("destinationOfSupply", destinationOfSupply)}
          {DisplayP("tax Rate", taxRate)}
          {DisplayP("invoice Number", invoiceNumber)}
          {DisplayP("notes", notes)}
          {DisplayP("Deposit To", DepositTo)}
          {DisplayP("tax Ddeducted", taxDdeducted)}
          {DisplayP("GST treatment", GSTtreatment)}
        </GridItem>
      </GridContainer>
    </Box>
  );
};

export default function ListUsers() {
  const [allExpense, setallExpense] = useState([]);
  const [selectedExpense, setselectedExpense] = useState([]);
  const [isDetailsDialog, setisDetailsDialog] = useState(false);
  const [isAddcategoryDialog, setisAddcategoryDialog] = useState(false);

  const [selectedData, setselectedData] = useState("");
  const [listofcategory, setlistsubcategory] = useState([]);
  const [filterData, setfilterData] = useState([]);

  useEffect(() => {
    getAllExpense().then(({ data }) => {
      setallExpense(data.success.data);
    });
    getAllExpenseCategory().then(({ data }) => {
      setlistsubcategory(data.success.data);
      setfilterData(data.success.data.map(({ subCategory }) => subCategory).flat());
    });
  }, []);

  const columns = [
    {
      name: "",
      label: "Supplier/ Customer/ Staff name",
    },
    {
      name: "date",
      label: "Date",
      options: {
        customBodyRenderLite: (index) => {
          const { date } = selectedExpense[index];
          return new Date(date).toLocaleDateString();
        },
      },
    },
    {
      name: "Amount",
      label: "Amount",
      options: {
        customBodyRenderLite: (index) => {
          const { Amount, type } = selectedExpense[index];
          return (
            <div>
              {type === "Sales" ? "+" : "-"} &#8377;{Amount}
            </div>
          );
        },
      },
    },
  ];

  const handleClick = (selectedsubcategory) => {
    setisDetailsDialog(true);
    setselectedData(selectedsubcategory);
    const data = allExpense.filter((item) => item.subcategory === selectedsubcategory);
    setselectedExpense(data);
  };

  const options = {
    filter: false,
    selectableRows: false,
    download: false,
    print: false,
    pagination: false,
    expandableRows: true,
    renderExpandableRow: (rowData, { rowIndex }) => (
      <TableRow>
        <TableCell colSpan={rowData.length}>
          <ExpandedRow ExpenseData={selectedExpense[rowIndex]} />
        </TableCell>
      </TableRow>
    ),
  };
  const baseSubcategory = listofcategory.map(({ subCategory }) => subCategory).flat();

  const searchText = (search) => {
    search = search.toLowerCase();
    if (!search || search === "") {
      setfilterData(baseSubcategory);
    } else {
      const filteredData = baseSubcategory.filter((item) => item.toLowerCase().match(search));
      setfilterData(filteredData);
    }
  };

  return (
    <div>
      <Button round color="info" onClick={() => setisAddcategoryDialog(true)}>
        Add New Account
      </Button>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <TextField placeholder="Search" label="Search" onChange={(e) => searchText(e.target.value)} fullWidth />
          <SearchIcon style={{ marginLeft: "-35px" }} />
        </div>
        <div style={{ marginLeft: "35px" }}>
          <FormControl style={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              defaultValue="all"
              onChange={(e) =>
                e.target.value === "all"
                  ? setfilterData(baseSubcategory)
                  : setfilterData(
                      listofcategory
                        .filter(({ category }) => category === e.target.value)
                        .map(({ subCategory }) => subCategory)
                        .flat()
                    )
              }
            >
              <MenuItem value="all">All</MenuItem>
              {listofcategory.map(({ category }) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <Grid container spacing={2}>
        {filterData.map((item) => (
          <Grid item xs={12} onClick={() => handleClick(item)}>
            <Paper>
              <Typography style={{ padding: "10px" }}>{item}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDetailsDialog} setOpen={setisDetailsDialog}>
        <MUIDataTable
          title={<Typography>{`${selectedData} Transactions`}</Typography>}
          data={selectedExpense}
          columns={columns}
          options={options}
        />
      </Dialog>

      <Dialog open={isAddcategoryDialog} setOpen={setisAddcategoryDialog}>
        <AddExpenseCategory hideModel={() => setisAddcategoryDialog(false)} />
      </Dialog>
    </div>
  );
}
