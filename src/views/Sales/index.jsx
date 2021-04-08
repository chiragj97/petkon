import React, { useState, useEffect } from "react";
import StoreIcon from "@material-ui/icons/Store";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Dialog from "components/Dialog";
import { toast } from "react-toastify";

import InventoryList from "./InventoryList";
import CartList from "./CartList";
import ManageSalesCustomer from "./ManageSalesCustomer";
import AddSaleCustomer from "./AddSaleCustomer";
import SelectSales from "./SelectSales";

import { getAllCustomer, deleteCustomer } from "ApiService";

export default function Index() {
  const [activeTab, setactiveTab] = useState(0);
  const [isDialog, setisDialog] = useState(false);
  const [allCustomer, setallCustomer] = useState([]);
  const [clientId, setclientId] = useState("");
  const [isSalesSelect, setisSalesSelect] = useState(true);

  const getallData = () => {
    getAllCustomer().then(({ data }) => {
      setallCustomer(data.success.data.filter((item) => item.role === "sales"));
    });
  };

  useEffect(() => {
    getallData();
  }, []);

  useEffect(() => {
    if (Boolean(clientId)) {
      setisSalesSelect(false);
    } else {
      setisSalesSelect(true);
    }
  }, [clientId, closeDialog]);

  const _deleteCustomer = (id) => {
    const status = window.confirm("Are you sure ?");
    if (status === true) {
      deleteCustomer(id).then(() => {
        getallData();
        toast.success("Deleted");
      });
    }
  };

  const closeDialog = () => {
    setisDialog(false);
    setisSalesSelect(false);
  };

  const openDialog = () => {
    setisDialog(true);
  };

  return (
    <div>
      <CustomTabs
        headerColor="primary"
        activeTab={activeTab}
        handleChange={(value) => setactiveTab(value)}
        tabs={[
          {
            tabName: "Inventory List",
            tabIcon: StoreIcon,
            tabContent: (
              <div>
                <SelectSales
                  allCustomer={allCustomer}
                  setclientId={setclientId}
                  openDialog={openDialog}
                  closeDialog={closeDialog}
                  clientId={clientId}
                  isSalesSelect={isSalesSelect}
                  setisSalesSelect={setisSalesSelect}
                />
                <InventoryList clientId={clientId} />
              </div>
            ),
          },
          {
            tabName: "Cart",
            tabIcon: ShoppingCartIcon,
            tabContent: (
              <div>
                <SelectSales
                  allCustomer={allCustomer}
                  setclientId={setclientId}
                  openDialog={openDialog}
                  closeDialog={closeDialog}
                  clientId={clientId}
                  isSalesSelect={isSalesSelect}
                  setisSalesSelect={setisSalesSelect}
                />
                <CartList clientId={clientId} />
              </div>
            ),
          },
          {
            tabName: "Manage Sales Customer",
            tabIcon: StoreIcon,
            tabContent: (
              <ManageSalesCustomer
                closeDialog={closeDialog}
                openDialog={openDialog}
                _deleteCustomer={_deleteCustomer}
                allCustomer={allCustomer}
              />
            ),
          },
        ]}
      />
      <Dialog open={isDialog} setOpen={setisDialog}>
        <AddSaleCustomer closeDialog={closeDialog} getallData={getallData} />
      </Dialog>
    </div>
  );
}
