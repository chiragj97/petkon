import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";

import { getAllExpense, deleteExpense, updateExpense } from "ApiService";
import { SET_SELECTED_EXPENSE_DATA } from "store/action";

import Dialog from "components/Dialog";
import AddExpense from "views/ExpenseManager/AddExpense";
import AddIncome from "views/ExpenseManager/AddIncome";
import DetailsExpense from "views/ExpenseManager/DetailsExpense";

export default function ManageExpense() {
  const dispatch = useDispatch();
  const [allExpense, setallExpense] = useState([]);
  const [isIncomeForm, setisIncomeForm] = useState(false);
  const [isExpenseForm, setisExpenseForm] = useState(false);
  const [isDetailsForm, setisDetailsForm] = useState(false);

  const getData = () => {
    getAllExpense().then(({ data }) => {
      setallExpense(data.success.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const _viewexpenseManager = (index) => {
    dispatch({
      type: SET_SELECTED_EXPENSE_DATA,
      payload: allExpense[index],
    });
    setisDetailsForm(true);
  };

  const _editexpenseManager = (type) => {
    setisDetailsForm(false);
    type === "Income" ? setisIncomeForm(true) : setisExpenseForm(true);
  };

  const _deleteexpenseManager = (id) => {
    const isdelete = window.confirm("Are you sure you want to delete ?");
    if (isdelete) {
      deleteExpense(id).then(() => {
        toast.warning("Deleted ");
        getData();
        setisDetailsForm(false);
      });
    }
  };

  const _updateexpenseManager = (id, data) => {
    updateExpense(id, data)
      .then(({ data }) => {
        if (data.success && data.success.statusCode === 200) {
          getData();
          toast.success("Updated success");
          setisIncomeForm(false);
          setisExpenseForm(false);
        } else {
          toast.warn(data.message);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const options = {
    filterType: "checkbox",
    selectableRows: false,
    onRowClick: (_, { rowIndex }) => _viewexpenseManager(rowIndex),
  };

  const columns = [
    {
      name: "_id",
      label: "Invoice no",
      options: {
        customBodyRenderLite: (index) => {
          const { _id } = allExpense[index];
          return String(_id).substr(0, 6);
        },
      },
    },
    {
      name: "name",
      label: "Supplier/ Customer/ Staff name",
    },
    {
      name: "category",
      label: "Category",
    },
    {
      name: "subcategory",
      label: "Subcategory",
    },
    {
      name: "date",
      label: "Date",
      options: {
        customBodyRenderLite: (index) => {
          const { date } = allExpense[index];
          return new Date(date).toLocaleDateString();
        },
      },
    },
    {
      name: "Amount",
      label: "Amount",
      options: {
        customBodyRenderLite: (index) => {
          const { Amount, type } = allExpense[index];
          return (
            <div>
              {type === "Income" ? "+" : "-"} &#8377;{Amount}
            </div>
          );
        },
      },
    },
  ];

  return (
    <div>
      <MUIDataTable title={"Invoice List"} data={allExpense} columns={columns} options={options} />

      <Dialog open={isExpenseForm} setOpen={setisExpenseForm}>
        <AddExpense _updateexpenseManager={_updateexpenseManager} />
      </Dialog>
      <Dialog open={isIncomeForm} setOpen={setisIncomeForm}>
        <AddIncome _updateexpenseManager={_updateexpenseManager} />
      </Dialog>

      <Dialog open={isDetailsForm} setOpen={setisDetailsForm}>
        <DetailsExpense _editexpenseManager={_editexpenseManager} _deleteexpenseManager={_deleteexpenseManager} />
      </Dialog>
    </div>
  );
}
