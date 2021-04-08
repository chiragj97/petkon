import React from "react";
import { useDispatch } from "react-redux";
import MUIDataTable from "mui-datatables";
import Button from "components/CustomButtons/Button.js";
import EditIcon from "@material-ui/icons/Edit";
import { SET_SELECTED_CUSTOMER_DATA } from "store/action";

export default function ManageSalesCustomer({ openDialog, allCustomer, _deleteCustomer }) {
  const dispatch = useDispatch();

  const _editCustomer = (id) => {
    const selectedCustomer = allCustomer.find(({ _id }) => String(_id) === String(id));
    dispatch({
      type: SET_SELECTED_CUSTOMER_DATA,
      payload: selectedCustomer,
    });
    openDialog();
  };

  const options = {
    filterType: "checkbox",
    selectableRows: false,
    // onRowClick: (_, { rowIndex }) => _viewUser(allCustomer[rowIndex]._id),
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
    {
      name: "_id",
      label: "Acions",
      options: {
        customBodyRender: (id) => <EditIcon onClick={() => _editCustomer(id)} />,
      },
    },
  ];

  return (
    <div>
      <Button className="float-r" round onClick={() => openDialog()} color="primary">
        Add Sales customer
      </Button>
      <MUIDataTable title={"Sales Customer List"} data={allCustomer} columns={columns} options={options} />
    </div>
  );
}
