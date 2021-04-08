import React, { useState, useEffect } from "react";
import { cutomer_get_getOrders, getLoginDetails } from "ApiService";
import MUIDataTable from "mui-datatables";

export default function OrderHistory() {
  const { customerId: clientId } = getLoginDetails();

  const [allOrderData, setallOrderData] = useState([]);

  const getAlldata = () => {
    cutomer_get_getOrders(clientId).then(({ data }) => {
      setallOrderData(data.success.data);
    });
  };

  useEffect(() => {
    getAlldata();
  }, []);

  const options = {
    filterType: "checkbox",
    selectableRows: false,
    // onRowClick: (_, { rowIndex }) => _viewUser(allCustomer[rowIndex]._id),
  };

  const columns = [
    {
      name: "_id",
      label: "Order ID",
      options: {
        customBodyRender: (id) => {
          return String(id).substr(0, 6);
        },
      },
    },
    {
      name: "createdAt",
      label: "Date",
      options: {
        customBodyRender: (data) => {
          return new Date(data).toLocaleDateString();
        },
      },
    },
    {
      name: "orderStatus",
      label: "Status",
    },
    {
      name: "finalTotal",
      label: "Order Total",
    },
  ];

  return (
    <div>
      <MUIDataTable title="All Orders" data={allOrderData} columns={columns} options={options} />
    </div>
  );
}
