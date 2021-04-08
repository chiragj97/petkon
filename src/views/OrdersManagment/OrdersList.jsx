import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";

import DescriptionIcon from "@material-ui/icons/Description";
import { getAllOrders, ROOT_API } from "ApiService";

export default function OrdersList() {
  const history = useHistory();

  const [currentOrder, setcurrentOrder] = useState([]);
  const orderstatus = history.location.pathname.split("/")[3];

  useEffect(() => {
    let status = "";
    switch (orderstatus) {
      case "pending":
        status = "pending";
        break;
      case "dispatch":
        status = "confirm";
        break;
      case "completed":
        status = "dispatch";
        break;
      default:
        break;
    }
    getAllOrders(status).then((data) => {
      setcurrentOrder(data);
    });
  }, [orderstatus]);

  const openInvoice = (invoice) => {
    const win = window.open(`${ROOT_API}/${invoice}`, "_blank");
    win.focus();
  };

  const options = {
    filterType: "checkbox",
    selectableRows: false,
  };

  const columns = [
    {
      name: "orderId",
      label: "Order ID",
    },
    {
      name: "orderStatus",
      label: "Orders Status",
    },
    {
      name: "clientId",
      label: "Customer Name",
      options: {
        customBodyRender: (clientId) => clientId?.name,
      },
    },
    {
      name: "clientId",
      label: "Phone Number",
      options: {
        customBodyRender: (clientId) => clientId?.phoneNumber,
      },
    },
    {
      name: "finalTotal",
      label: "Order Value",
      options: {
        customBodyRender: (finalTotal) => <div>&#8377;{finalTotal}</div>,
      },
    },

    {
      name: "createdAt",
      label: "Date",
      options: {
        customBodyRender: (createdAt) => new Date(createdAt).toLocaleDateString(),
      },
    },
    {
      name: "Action",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (_, { rowIndex }) => {
          const { invoice } = currentOrder[rowIndex];
          return (
            <div className="tbl-icon">
              <EditIcon
                onClick={() =>
                  history.push("/app/OrderDetails", { details: currentOrder[rowIndex], currentOrder: currentOrder })
                }
              />
              {invoice && <DescriptionIcon onClick={() => openInvoice(invoice)} />}
              {/* <DeleteIcon /> */}
            </div>
          );
        },
      },
    },
  ];

  const getTitle = () => {
    let title = "";
    switch (orderstatus) {
      case "pending":
        title = "Pending Confirmation";
        break;

      case "dispatch":
        title = "Ready For Dispatch";
        break;

      case "completed":
        title = "Completed Orders";
        break;
    }
    return title;
  };

  return <MUIDataTable title={getTitle()} data={currentOrder} columns={columns} options={options} />;
}
