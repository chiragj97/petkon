import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";

import { getAllCustomer, getAllStaff, getAllSupplier, deleteCustomer, deleteStaff, deleteSupplier } from "ApiService";
import { SET_SELECTED_CUSTOMER_DATA } from "store/action";

import AddCustomer from "./AddUser";
import UserDetails from "./UserDetails";

import Dialog from "components/Dialog";

export default function ListUsers() {
  const dispatch = useDispatch();
  const [allCustomer, setallCustomer] = useState([]);
  const [isDetailsDialog, setisDetailsDialog] = useState(false);
  const [isUpdateDialog, setisUpdateDialog] = useState(false);

  const getallData = () => {
    getAllCustomer().then(({ data }) => {
      let finalCustomers = data.success.data
        .filter((item) => item.role === "customer")
        .map((item) => ({
          userFormType: "Customer",
          ...item,
        }));
      getAllStaff().then(({ data }) => {
        const allStaff = data.success.data.map((item) => ({
          userFormType: "Staff",
          ...item,
        }));
        finalCustomers = [...finalCustomers, ...allStaff];

        getAllSupplier().then(({ data }) => {
          const allSupplier = data.success.data.map((item) => ({
            userFormType: "Supplier",
            ...item,
          }));
          finalCustomers = [...finalCustomers, ...allSupplier];

          setallCustomer(finalCustomers);
        });
      });
    });
  };

  useEffect(() => {
    getallData();
  }, []);

  const _editCustomer = () => {
    setisDetailsDialog(false);
    setisUpdateDialog(true);
  };

  const _viewUser = (id) => {
    const selectedCustomer = allCustomer.find(({ _id }) => String(_id) === String(id));
    dispatch({
      type: SET_SELECTED_CUSTOMER_DATA,
      payload: selectedCustomer,
    });
    setisDetailsDialog(true);
  };

  const _deleteCustomer = (id) => {
    const status = window.confirm("Are you sure ?");
    if (status === true) {
      const selectedCustomer = allCustomer.find(({ _id }) => String(_id) === String(id));
      if (selectedCustomer.userFormType === "Customer") {
        deleteCustomer(id).then(() => {
          getallData();
          setisDetailsDialog(false);
          toast.error("Deleted");
        });
      } else if (selectedCustomer.userFormType === "Staff") {
        deleteStaff(id).then(() => {
          getallData();
          setisDetailsDialog(false);
          toast.error("Deleted");
        });
      } else if (selectedCustomer.userFormType === "Supplier") {
        deleteSupplier(id).then(() => {
          getallData();
          setisDetailsDialog(false);
          toast.error("Deleted");
        });
      }
    }
  };

  const options = {
    filterType: "checkbox",
    selectableRows: false,
    onRowClick: (_, { rowIndex }) => _viewUser(allCustomer[rowIndex]._id),
  };

  const columns = [
    {
      name: "_id",
      label: "User ID",
      options: {
        customBodyRender: (id) => {
          return String(id).substr(0, 6);
        },
      },
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "userFormType",
      label: "User Type",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
    },
    {
      name: "email",
      label: "Email ID",
    },
    {
      name: "createdAt",
      label: "Added On",
      options: {
        customBodyRender: (data) => {
          return new Date(data).toLocaleDateString();
        },
      },
    },
  ];

  return (
    <div>
      <MUIDataTable title={"User List"} data={allCustomer} columns={columns} options={options} />

      <Dialog open={isDetailsDialog} setOpen={setisDetailsDialog}>
        <UserDetails _deleteCustomer={_deleteCustomer} _editCustomer={_editCustomer} />
      </Dialog>
      <Dialog open={isUpdateDialog} setOpen={setisUpdateDialog}>
        <AddCustomer setisUpdateDialog={setisUpdateDialog} getallData={getallData} />
      </Dialog>
    </div>
  );
}
