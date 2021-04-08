import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Custome_Input from "components/MyCustomeInput/MyCustomeInput";
import Button from "components/CustomButtons/Button.js";
import NestedMenu from "../../components/MyCustomeInput/NestedMenu";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { postExpense, getAllSupplier, getAllStaff, getExpenseCategory } from "ApiService";
import { SET_SELECTED_EXPENSE_DATA } from "store/action";
import { stateJSON, GSTTreatmentJSON } from "helper/constant/userForm.json";
import { useHistory } from "react-router-dom";

export default function AddExpense({ _updateexpenseManager }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [allSupplier, setallSupplier] = useState([]);
  const [allStaff, setallStaff] = useState([]);
  const [allcategory, setallcategory] = useState([]);
  const [allIncomeCategory, setallIncomeCategory] = useState([]);

  const ExpenseData = useSelector(({ selectedData }) => selectedData.ExpenseData);
  const isUpdate = Object.keys(ExpenseData).length !== 0;

  const methods = useForm({
    defaultValues: {
      date: new Date(),
    },
  });
  const { handleSubmit, setValue, watch } = methods;
  const { category, name } = watch();

  useEffect(() => {
    getAllSupplier().then(({ data }) => setallSupplier(data.success.data));
    getAllStaff().then(({ data }) => setallStaff(data.success.data));
    getExpenseCategory("Expense").then(({ data }) => {
      setallcategory(data.success.data);
    });
    getExpenseCategory("Income").then(({ data }) => {
      const daat = data.success.data.map(({ category, subCategory }) => ({
        label: category,
        value: category,
        nestedmenu: subCategory,
      }));

      setallIncomeCategory(daat);
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
  }, [category, ExpenseData]);

  useEffect(() => {
    if (Boolean(name)) {
      const selectedName = [...allSupplier, ...allStaff].find(
        ({ name: selectedName }) => String(selectedName) === String(name)
      );
      if (selectedName) {
        const { GSTNumber } = selectedName;
        setValue("GST", GSTNumber);
      }
    }
  }, [name]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("type", "Expense");
    Object.keys(data).forEach((key) => formData.append(key, key === "expenseFile" ? data[key][0] : data[key]));

    if (isUpdate) {
      _updateexpenseManager(ExpenseData._id, formData);
    } else {
      postExpense(formData)
        .then(({ data }) => {
          if (data.success && data.success.statusCode === 200) {
            toast.success("Added Expense success");
            history.push("/app/userManagement/manage");
          } else {
            toast.warn(data.message);
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  const selectedcategory = allcategory.find(({ category: selectcategory }) => category === selectcategory);
  return (
    <Card>
      <CardBody>
        <h3 className="card-title">{isUpdate ? "UPDATE" : "ADD"} Expense</h3>
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
              <Custome_Input
                label="Name"
                name="name"
                isAutocomplete
                option={[...allStaff, ...allSupplier].map(({ name }) => ({
                  value: name,
                  label: name,
                }))}
                type="select"
                isrequired
              />

              <Custome_Input label="Date" name="date" type="date" />
              <Custome_Input label="Expense value" type="number" name="Amount" isrequired />
              <Custome_Input
                label="Upload Invoice (img or pdf)"
                name="expenseFile"
                type="file"
                accept="image/*,application/pdf"
              />

              <NestedMenu label="Paid Through" name="paidThrough" menu={allIncomeCategory} isrequired />
              <Custome_Input label="GST treatment" name="GSTtreatment" option={GSTTreatmentJSON} type="select" />
              <Custome_Input
                label="Reimbursement"
                name="reimbursement"
                option={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                type="select"
                isrequired
              />
              <Custome_Input name="sourceOfSupply" label="Source of supply" type="select" option={stateJSON} />
              <Custome_Input
                name="destinationOfSupply"
                label="Destination of supply"
                type="select"
                option={stateJSON}
              />
              <Custome_Input
                label="Tax rate"
                name="taxRate"
                option={[0, 5, 12, 18, 28].map((item) => ({ label: `${item}%`, value: item }))}
                type="select"
              />
              <Custome_Input label="Invoice Number" name="invoiceNumber" />
              <Custome_Input label="Notes" name="notes" />

              <Button type="submit" color="primary">
                {isUpdate ? "Update" : "Add"} Expense
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
