import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Custome_Input from "components/MyCustomeInput/MyCustomeInput";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";

import { postExpense, getAllCustomer, getExpenseCategory } from "ApiService";
import { SET_SELECTED_EXPENSE_DATA } from "store/action";
import NestedMenu from "../../components/MyCustomeInput/NestedMenu";

export default function AddIncome({ _updateexpenseManager }) {
  const [allcategory, setallcategory] = useState([]);
  const [allCustomer, setallCustomer] = useState([]);

  const dispatch = useDispatch();
  const methods = useForm();
  const history = useHistory();
  const ExpenseData = useSelector(({ selectedData }) => selectedData.ExpenseData);
  const isUpdate = Object.keys(ExpenseData).length !== 0;

  const { handleSubmit, setValue, watch } = methods;
  const { name, category } = watch();

  useEffect(() => {
    getAllCustomer().then(({ data }) => setallCustomer(data.success.data));
    getExpenseCategory("Income").then(({ data }) => {
      setallcategory(data.success.data);
    });
    return () => {
      dispatch({
        type: SET_SELECTED_EXPENSE_DATA,
        payload: {},
      });
    };
  }, []);

  useEffect(() => {
    if (isUpdate) {
      Object.keys(ExpenseData).forEach((key) => key != "expenseFile" && setValue(key, ExpenseData[key]));
    }
  }, [ExpenseData]);

  useEffect(() => {
    if (Boolean(name)) {
      const selectedName = allCustomer.find(({ name: selectedName }) => String(selectedName) === String(name));
      if (selectedName) {
        const { GSTNumber } = selectedName;
        setValue("customerGST", GSTNumber);
      }
    }
  }, [name]);

  const selectedcategory = allcategory.find(({ category: selectcategory }) => category === selectcategory);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("type", "Income");
    Object.keys(data).forEach((key) => formData.append(key, key === "expenseFile" ? data[key][0] : data[key]));

    if (isUpdate) {
      _updateexpenseManager(ExpenseData._id, formData);
    } else {
      postExpense(formData)
        .then(({ data }) => {
          if (data.success && data.success.statusCode === 200) {
            toast.success("Added Income success");
            history.push("/app/userManagement/manage");
          } else {
            toast.warn(data.message);
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <Card>
      <CardBody>
        <h3 className="card-title">{isUpdate ? "UPDATE" : "ADD"} Income</h3>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body">
              <NestedMenu
                isrequired
                name="category"
                menu={allcategory.map(({ _id, category, subCategory }) => ({
                  value: category,
                  label: category,
                  nestedmenu: subCategory,
                }))}
                label="ACCOUNT TYPE"
              />
              <Custome_Input
                label="Sub Catagory"
                name="subcategory"
                option={
                  selectedcategory ? selectedcategory.subCategory.map((item) => ({ value: item, label: item })) : []
                }
                type="select"
                isrequired
              />
              <Custome_Input label="Date" name="date" type="date" />
              <Custome_Input
                label="Name"
                name="name"
                isAutocomplete
                option={allCustomer.map(({ name }) => ({
                  value: name,
                  label: name,
                }))}
                type="select"
                isrequired
              />
              <Custome_Input label="Invoice value" type="number" name="Amount" />
              <Custome_Input
                label="Upload Invoice (img or pdf)"
                name="expenseFile"
                accept="image/*,application/pdf"
                type="file"
              />
              <Custome_Input
                label="mode of payment"
                name="modeofpayment"
                option={[
                  { value: "cash", label: "cash" },
                  { value: "UPI", label: "UPI" },
                  { value: "Cheque", label: "Cheque" },
                  { value: "bankTransfer", label: "bank transfer" },
                  { value: "Credit Card", label: "Credit Card" },
                ]}
                type="select"
                isrequired
              />
              <Custome_Input label="reference Number" name="referenceNumber" />
              <Custome_Input label="Invoice Number" name="invoiceNumber" />

              <NestedMenu
                label="Deposit to"
                name="DepositTo"
                isrequired
                menu={allcategory.map(({ category, subCategory }) => ({
                  label: category,
                  value: category,
                  nestedmenu: subCategory.map((item) => ({ label: item, value: item })),
                }))}
              />

              <Custome_Input
                label="Tax deducted"
                name="taxDdeducted"
                option={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                type="select"
              />
              {/* <Custome_Input
            label="Tax deducted"
            name="taxDdeducted"
            option={[
              {
                value: "Yes",
                label: "Yes",
                children: [
                  "Advance Tax",
                  "Employee Advance",
                  "Input Tax credit",
                  "Input CESS",
                  "Input CGST",
                  "Input SGST",
                  "IPrepaid Expense",
                  "TDS Receivable",
                  "Reverse charge tax input but no due",
                ].map((item) => ({ value: item, label: item })),
              },
              { value: "No", label: "No", children: [{ value: "No", label: "No" }] },
            ]}
            type="select"
            ismultiSelect
          /> */}
              <Button type="submit" color="primary">
                {isUpdate ? "Update" : "Add"} Income
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
