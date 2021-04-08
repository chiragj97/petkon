import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import DefaultCheckbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ReceiptIcon from "@material-ui/icons/Receipt";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";

import { update_Order, generateInvoice, ROOT_API } from "ApiService";

const Checkbox = withStyles({
  root: {
    color: "#FA5D43",
    "&$checked": {
      color: "#FA5D43",
    },
  },
  checked: {},
})((props) => <DefaultCheckbox color="default" {...props} />);

const cardIconstyle = {
  fontSize: "20px",
};

const ConfirmOrder = ({ inventory, _id }) => {
  const history = useHistory();
  const [selectedItem, setselectedItem] = useState(inventory);

  const post_ConfirmOrder = () => {
    // const finalTotal = selectedItem.reduce((prev, cur) => {
    //   const total1 = cur["netPrice"] * cur["userQuantity"];
    //   return prev + total1;
    // }, 0);

    const finalTotal = selectedItem
      .map(({ netPrice, inventoryId, userQuantity }) => {
        const { GSTSleb, MOQ, discountPerUnit } = inventoryId;
        const subtotal = netPrice * userQuantity;
        let Discount = 0;
        let TAX = 0;
        if (userQuantity > MOQ) {
          Discount = Math.ceil((subtotal * discountPerUnit) / 100);
        }
        if (GSTSleb > 0) TAX = Math.ceil((subtotal * GSTSleb) / 100);

        return subtotal - Discount + TAX;
      })
      .reduce((prev, next) => Number(prev) + Number(next), 0);

    const updatedData = {
      inventory: selectedItem,
      orderStatus: "confirm",
      finalTotal,
    };
    update_Order(updatedData, _id)
      .then(() => history.push("/app/ordermanagement/dispatch"))
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <div>
        <Table
          striped
          tableHead={["Item", "Item ID", "quantity", "total", "check"]}
          tableData={inventory.map(({ _id: itemId, userQuantity, netPrice, inventoryId }) => [
            <div className="d-flex align-items-center">
              <div className="d-flex justify-content-center">
                <div style={{ boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)", padding: "3px" }}>
                  <img
                    style={{ height: "60px", width: "60px", objectFit: "contain" }}
                    src={`${ROOT_API}/${inventoryId.images[0]}`}
                  />
                </div>
              </div>
              <p style={{ marginLeft: "10px", fontSize: "12px" }}>{inventoryId.name}</p>
            </div>,
            String(itemId).substr(0, 5),
            userQuantity,
            <div>&#8377;{netPrice}</div>,
            <Checkbox
              checked={selectedItem.some((item) => String(item._id) === String(itemId))}
              onChange={(e) => {
                if (e.target.checked) {
                  const selectedData = inventory.find((item) => String(item._id) === String(itemId));
                  selectedItem.push(selectedData);
                  setselectedItem([...selectedItem]);
                } else {
                  setselectedItem(selectedItem.filter((item) => String(item._id) !== String(itemId)));
                }
              }}
            />,
          ])}
        />
      </div>
      <Box display="flex" justifyContent="space-between">
        <BackButton />
        <Button color="primary" onClick={post_ConfirmOrder}>
          CONFIRM ORDERS
        </Button>
      </Box>
    </div>
  );
};

const DispatchOrder = ({ _id, finalTotal, inventory, orderId, subTotal, clientId }) => {
  const history = useHistory();
  const [distachForm, setdistachForm] = useState({
    courier_Name: "",
    parcel_Id: "",
    courier_Phonenumber: "",
    estimated_date_arrival: new Date(),
    sendInvoice: true,
  });

  const post_ConfirmOrder = () => {
    if (
      !distachForm.courier_Name ||
      !distachForm.courier_Phonenumber ||
      !distachForm.estimated_date_arrival ||
      !distachForm.parcel_Id
    )
      return alert("Please fill All details");

    const updateData = {
      distachForm: distachForm,
      orderStatus: "dispatch",
      finalTotal,
    };

    const updatedInventory = inventory.map((item) => {
      const { discountPerUnit, priceOfSale, GSTSleb } = item.inventoryId;

      const Amount = priceOfSale * item.userQuantity;
      const DiscountAmount = (Amount * discountPerUnit) / 100;
      const TaxableValue = Amount - DiscountAmount;
      const GSTRS = (TaxableValue * GSTSleb) / 100;
      const Total = TaxableValue + GSTRS;
      return {
        ...item,
        inventoryId: {
          ...item.inventoryId,
          Amount,
          DiscountAmount,
          TaxableValue,
          GSTRS,
          Total,
        },
      };
    });

    const sunArrofObj = (arr, key) => arr.reduce((a, b) => a + b["inventoryId"][key], 0);

    const TotalAmountBeforeTax = sunArrofObj(updatedInventory, "TaxableValue");
    const TotalTax = sunArrofObj(updatedInventory, "GSTRS");
    const CGST = TotalTax / 2;
    const SGST = TotalTax / 2;
    const TotalAmountAfterTax = TotalAmountBeforeTax - TotalTax;
    const Roundoff = Math.ceil(TotalAmountAfterTax);
    const TOTAL = Math.ceil(TotalAmountAfterTax);

    const InvoiceData = {
      _id,
      TotalAmountBeforeTax,
      TotalTax,
      CGST,
      SGST,
      TotalAmountAfterTax,
      Roundoff,
      TOTAL,
      inventory: updatedInventory,
      orderId,
      subTotal,
      clientId,
      ...updateData,
    };
    generateInvoice(InvoiceData)
      .then(() => {
        update_Order(updateData, _id)
          .then(() => history.push("/app/ordermanagement/completed"))
          .catch((e) => console.log(e));
      })
      .catch((e) => alert(e));
  };

  const handleDistachForm = (value, key) => setdistachForm({ ...distachForm, [key]: value });

  return (
    <div>
      <div>
        <Table
          striped
          tableHead={["Item", "Item ID", "quantity", "total"]}
          tableData={inventory.map(({ _id: itemId, userQuantity, netPrice, inventoryId }) => [
            <div className="d-flex align-items-center">
              <div className="d-flex justify-content-center">
                <div style={{ boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)", padding: "3px" }}>
                  <img
                    style={{ height: "60px", width: "60px", objectFit: "contain" }}
                    src={`${ROOT_API}/${inventoryId.images[0]}`}
                  />
                </div>
              </div>
              <p style={{ marginLeft: "10px", fontSize: "12px" }}>{inventoryId.name}</p>
            </div>,
            String(itemId).substr(0, 5),
            userQuantity,
            <div>&#8377;{netPrice}</div>,
          ])}
        />
        <div className="text-uppercase">
          <div>
            <CustomInput
              labelText="COURIER NAME"
              inputProps={{
                placeholder: "COURIER NAME",
                onChange: (e) => handleDistachForm(e.target.value, "courier_Name"),
              }}
            />
          </div>
          <div>
            <CustomInput
              labelText="PARCEL ID"
              inputProps={{
                placeholder: "PARCEL ID",
                onChange: (e) => handleDistachForm(e.target.value, "parcel_Id"),
              }}
            />
          </div>
          <div>
            <CustomInput
              labelText="COURIER PHONE NUMBER"
              inputProps={{
                placeholder: "COURIER PHONE NUMBER",
                onChange: (e) => handleDistachForm(e.target.value, "courier_Phonenumber"),
              }}
            />
          </div>
          <div>
            <CustomInput
              type="date"
              inputProps={{
                label: "estimated date arrival",
                value: distachForm.estimated_date_arrival,
                onChange: (date) => handleDistachForm(date, "estimated_date_arrival"),
              }}
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={distachForm.sendInvoice}
                onChange={(e) => handleDistachForm(e.target.checked, "sendInvoice")}
              />
            }
            label="Send Invoice"
            style={{ color: "#0B2559" }}
          />
        </div>
      </div>
      <Box display="flex" justifyContent="space-between">
        <BackButton />
        <Button color="primary" onClick={post_ConfirmOrder}>
          CONFIRM DISPATCH
        </Button>
      </Box>
    </div>
  );
};

const CompleteOrder = ({ _id, address }) => {
  const history = useHistory();
  const [paymentForm, setpaymentForm] = useState({
    due_amount: "",
    paid_amount: "",
    mode_of_payment: "cod",
  });

  const post_Completeorder = () => {
    const finaldata = {
      due_amount: Number(paymentForm.due_amount) - Number(paymentForm.paid_amount),
      mode_of_payment: paymentForm.mode_of_payment,
      paid_amount: paymentForm.paid_amount,
      // orderStatus: "complete",
    };

    update_Order(finaldata, _id)
      .then(() => history.push("/app/ordermanagement/completed"))
      .catch((e) => console.log(e));
  };
  const handlePaymentForm = (value, key) => setpaymentForm({ ...paymentForm, [key]: value });

  return (
    <div>
      <div>
        <GridContainer>
          <GridItem xs>
            <div className="d-flex align-items-center card-icon-container">
              <div className="d-flex justify-content-center align-items-center icon-container">
                <ReceiptIcon style={cardIconstyle} />
              </div>
              <div className="d-flex" style={{ marginLeft: "25px", flexDirection: "column" }}>
                <span>
                  bill to : <span className="text-bold">{address}</span>
                </span>
              </div>
            </div>
          </GridItem>
          <GridItem xs>
            <div className="d-flex align-items-center card-icon-container">
              <div className="d-flex justify-content-center align-items-center icon-container">
                <LocalShippingIcon style={cardIconstyle} />
              </div>
              <div className="d-flex" style={{ marginLeft: "25px", flexDirection: "column" }}>
                <span>
                  ship to : <span className="text-bold">{address}</span>
                </span>
              </div>
            </div>
          </GridItem>
        </GridContainer>
        <div className="text-uppercase">
          <div>
            <CustomInput
              labelText="due amount"
              inputProps={{
                placeholder: "due amount",
                onChange: (e) => handlePaymentForm(e.target.value, "due_amount"),
              }}
            />
          </div>
          <div>
            <CustomInput
              labelText="paid amount"
              inputProps={{
                placeholder: "paid amount",
                onChange: (e) => handlePaymentForm(e.target.value, "paid_amount"),
              }}
            />
          </div>
          <div>
            <CustomInput
              type="select"
              labelText="mode of payment"
              inputProps={{
                value: paymentForm.mode_of_payment,
                onChange: (e) => handlePaymentForm(e.target.value, "mode_of_payment"),
                options: [
                  { label: "Cash on delivery", value: "cod" },
                  { label: "payment1", value: "payment1" },
                  { label: "payment2", value: "payment2" },
                ],
              }}
            />
          </div>
        </div>
      </div>
      <Box display="flex" justifyContent="space-between">
        <BackButton />
        <Button color="primary" onClick={post_Completeorder}>
          COMPLETE ORDERS
        </Button>
      </Box>
    </div>
  );
};

const BackButton = () => {
  const history = useHistory();
  return <Button onClick={() => history.goBack()}>BACK TO ORDERS</Button>;
};

const SideBar = ({ data, orderStatus, selectedOrderData }) => {
  const history = useHistory();
  const getTitle = () => {
    let title = "";
    switch (orderStatus) {
      case "pending":
        title = "Pending Confirmation";
        break;

      case "confirm":
        title = "Ready For Dispatch";
        break;

      case "dispatch":
        title = "Completed Orders";
        break;
    }
    return title;
  };
  return (
    <div>
      <p className="card-subtitle">{getTitle()}</p>
      <div>
        {data.map(({ orderStatus, finalTotal, createdAt, clientId, _id }, index) => (
          <div
            style={{
              backgroundColor: String(_id) === String(selectedOrderData._id) ? "#E2F2FF" : "#FFFFFF",
              boxShadow: "0px 2px 2px #0000000F",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "10px",
            }}
            className="d-flex"
          >
            <div>
              <Checkbox
                style={{ padding: "9px 5px" }}
                checked={String(_id) === String(selectedOrderData._id)}
                onChange={(e) => {
                  history.push("/app/OrderDetails", { details: data[index], currentOrder: data });
                }}
              />
            </div>

            <div className="w-100">
              <div
                style={{ fontSize: "12px", fontWeight: "bold" }}
                className="d-flex align-items-center justify-content-between"
              >
                <span style={{ font: "normal normal medium 18px/27px Poppins" }}>{clientId?.name}</span>
                <span>&#8377;{finalTotal}</span>
              </div>
              <div
                style={{ fontSize: "10px", fontWeight: "normal" }}
                className="d-flex align-items-center justify-content-between"
              >
                <div>
                  <span>{"0037826GF"}</span>
                  <span>
                    {"  |  "}
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span>{orderStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function OrderDetails() {
  const { state } = useLocation();
  const history = useHistory();
  const [orderData, setorderData] = useState(false);

  const { currentOrder } = state;

  useEffect(() => {
    const { details } = state;
    setorderData(details);
  }, [state]);

  if (!orderData) {
    if (orderData === undefined) {
      history.push("/app/ordermanagement");
      return <></>;
    } else {
      return <></>;
    }
  }

  const { clientId, subTotal, finalTotal, createdAt, _id, inventory, orderId } = orderData;
  const { _id: custId, email, name, phoneNumber, address } = clientId;

  const renderOrderscreen = () => {
    switch (orderData.orderStatus) {
      case "pending":
        return <ConfirmOrder _id={_id} inventory={inventory} />;

      case "confirm":
        return (
          <DispatchOrder
            _id={_id}
            finalTotal={finalTotal}
            inventory={inventory}
            orderId={orderId}
            subTotal={subTotal}
            clientId={clientId}
          />
        );
      case "dispatch":
        return <CompleteOrder _id={_id} address={address} />;
    }
  };

  return (
    <Card style={{ margin: 0 }}>
      <CardBody>
        <GridContainer style={{ color: "#0b2559" }}>
          <GridItem className="sideBar-container" xs={4}>
            <SideBar data={currentOrder} selectedOrderData={orderData} orderStatus={orderData.orderStatus} />
          </GridItem>
          <GridItem xs={8}>
            <h3 className="card-subtitle">Order Details</h3>

            <GridContainer>
              <GridItem xs>
                <div className="d-flex  align-items-center card-icon-container">
                  <div className="d-flex justify-content-center align-items-center icon-container">
                    <i className="fa fa-cube" aria-hidden="true" style={cardIconstyle} />
                  </div>
                  <div className="d-flex" style={{ marginLeft: "25px", flexDirection: "column" }}>
                    <span>
                      Order id : <span className="text-bold">{orderId}</span>
                    </span>
                    <span>
                      Order date : <span className="text-bold">{new Date(createdAt).toLocaleDateString()}</span>
                    </span>
                    <span>
                      Order value :<span className="text-bold"> &#8377;{finalTotal}</span>
                    </span>
                  </div>
                </div>
              </GridItem>
              <GridItem xs>
                <div className="d-flex align-items-center card-icon-container">
                  <div className="d-flex justify-content-center align-items-center icon-container">
                    <i className="fa fa-cube" aria-hidden="true" style={cardIconstyle} />
                  </div>
                  <div className="d-flex" style={{ marginLeft: "25px", flexDirection: "column" }}>
                    <span>
                      Customer Id : <span className="text-bold">{String(custId).substr(0, 5)}</span>
                    </span>
                    <span>
                      Customer Name : <span className="text-bold">{name}</span>
                    </span>
                    <span>
                      Phone Number : <span className="text-bold">{phoneNumber}</span>
                    </span>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <h3 className="card-subtitle">Ordered Items</h3>

            <Box flexDirection="column" display="flex" justifyContent="space-between">
              {renderOrderscreen()}
            </Box>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
}
