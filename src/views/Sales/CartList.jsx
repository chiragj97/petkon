import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import { get_addtoCart, ROOT_API, post_Order, delete_addtoCart } from "ApiService";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { toast } from "react-toastify";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  image: {
    width: 70,
    height: 70,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export default function CartList({ clientId }) {
  const classes = useStyles();
  const [finalAddtoCartData, setfinalAddtoCartData] = useState([]);
  const [addtoCartData, setAddtoCartData] = useState([]);
  const [Subtotal, setSubtotal] = useState(0);
  const [discountTotal, setdiscountTotal] = useState(0);
  const [GSTTotal, setGSTTotal] = useState(0);
  const [finalTotal, setfinalTotal] = useState(0);

  const getAlldata = () => {
    get_addtoCart(clientId).then(({ data }) => {
      setfinalAddtoCartData(data.success.data);
      setAddtoCartData(data.success.data);
    });
  };

  useEffect(() => {
    getAlldata();
  }, []);

  useEffect(() => {
    const DiscountTotal_arr = [];
    const Total_arr = [];
    const Subtotal_arr = [];
    const TAX_arr = [];
    finalAddtoCartData.forEach(({ netPrice, inventoryId, quantity }) => {
      const { GSTSleb, MOQ, discountPerUnit } = inventoryId;
      const subtotal = netPrice * quantity;
      let Discount = 0;
      let TAX = 0;
      if (quantity > MOQ) {
        Discount = Math.ceil((subtotal * discountPerUnit) / 100);
      } else {
        Discount = Math.ceil((subtotal * discountPerUnit) / 100);
      }
      if (GSTSleb > 0) TAX = Math.ceil((subtotal * GSTSleb) / 100);
      Subtotal_arr.push(subtotal);
      Total_arr.push(subtotal - Discount + TAX);
      DiscountTotal_arr.push(Discount);
      TAX_arr.push(TAX);
    });
    setGSTTotal(TAX_arr.reduce((prev, next) => Number(prev) + Number(next), 0));
    setSubtotal(Subtotal_arr.reduce((prev, next) => Number(prev) + Number(next), 0));
    setdiscountTotal(DiscountTotal_arr.reduce((prev, next) => Number(prev) + Number(next), 0));
    setfinalTotal(Total_arr.reduce((prev, next) => Number(prev) + Number(next), 0));
  }, [finalAddtoCartData]);

  const modifiyItem = (selectedId, numberofqty, isInputed) => {
    if (isInputed) {
      const temporaryarray = finalAddtoCartData.map((item) =>
        String(item._id) === String(selectedId)
          ? {
              ...item,
              netPrice: numberofqty,
            }
          : item
      );
      setfinalAddtoCartData([...temporaryarray]);
    } else {
      const index = finalAddtoCartData.findIndex((item) => String(item._id) === String(selectedId));

      if (index === -1) return;
      if (finalAddtoCartData[index].quantity <= 1 && numberofqty !== 1) return;

      const newqty = finalAddtoCartData[index].quantity + numberofqty;
      const temporaryarray = [
        ...finalAddtoCartData.slice(0, index),
        Object.assign({}, finalAddtoCartData[index], {
          quantity: newqty,
          netPrice: newqty * addtoCartData[index].netPrice,
        }),
        ...finalAddtoCartData.slice(index + 1),
      ];
      setfinalAddtoCartData([...temporaryarray]);
    }
  };

  const placeOrder = () => {
    const data = {
      clientId: clientId,
      inventory: finalAddtoCartData.map(({ netPrice, quantity, inventoryId }) => ({
        inventoryId: inventoryId._id,
        netPrice: netPrice,
        userQuantity: quantity,
      })),
      quantity: finalAddtoCartData.length,
      subTotal: Subtotal,
      finalTotal: finalTotal,
      orderStatus: "pending",
      GSTToBePaid: GSTTotal,
      orderType: "sales",
    };
    const cartIds = finalAddtoCartData.map(({ _id }) => ({ _id }));
    post_Order(data).then(({ data }) => {
      if (data.success && data.success.statusCode === 200) {
        delete_addtoCart(cartIds);
        getAlldata();
        toast.success(`Ordered Succesfully`);
      } else {
        toast.warn(data.message);
      }
    });
  };

  if (addtoCartData.length <= 0) {
    return (
      <div>
        <h1 className="text-center">No orders Found</h1>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <GridContainer spacing={3}>
        {finalAddtoCartData.map((item) => {
          const { quantity, netPrice, inventoryId, _id } = item;
          const { name, images } = inventoryId;
          return (
            <GridContainer container alignItems="center" direction="row" xs={12} key={name}>
              <GridItem xs={1}>
                <ButtonBase className={classes.image}>
                  <img className={classes.img} src={`${ROOT_API}/${images[0]}`} />
                </ButtonBase>
              </GridItem>
              <GridItem xs={4}>
                <Typography gutterBottom variant="subtitle2">
                  {name}
                </Typography>
              </GridItem>
              <GridItem xs={3} />
              <GridItem xs={4}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button justIcon color="primary" size="sm" onClick={() => modifiyItem(_id, 1)}>
                    <AddIcon />
                  </Button>
                  <p style={{ margin: "10px" }}>{quantity}</p>
                  <Button justIcon color="danger" size="sm" onClick={() => modifiyItem(_id, -1)}>
                    <RemoveIcon />
                  </Button>

                  {/* <div style={{ margin: "8px" }}>
                    <span style={{ marginRight: "5px", fontSize: "revert" }}>{"%"}</span>
                    <input
                      type="number"
                      defaultValue="0"
                      // value={netPrice}
                      onChange={(e) => modifiyItem(_id, netPrice - (netPrice * Number(e.target.value)) / 100, true)}
                      style={{ width: "40px" }}
                    />
                  </div> */}

                  <div style={{ marginTop: "8px", marginBottom: "8px", marginLeft: "7px" }}>
                    <span style={{ marginRight: "5px", fontSize: "revert" }}> = {"\u20B9"}</span>
                    <input
                      type="number"
                      value={netPrice}
                      onChange={(e) => modifiyItem(_id, Number(e.target.value), true)}
                      style={{ width: "40px" }}
                    />
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          );
        })}
      </GridContainer>
      <div
        style={{
          display: "flex",
          fontSize: "15px",
          fontWeight: "500",
          flexDirection: "column",
          alignItems: "flex-end",
          marginRight: "60px",
        }}
      >
        <p>
          Subtotal: {"\u20B9"}
          {Subtotal}
        </p>
        <p>
          GST: +{"\u20B9"}
          {GSTTotal}
        </p>
        <p>
          Discount: -{"\u20B9"}
          {discountTotal}
        </p>
        <p style={{ fontWeight: "bold" }}>
          Total: {"\u20B9"}
          {finalTotal}
        </p>
      </div>
      <Button fullWidth color="success" onClick={placeOrder}>
        Place Order
      </Button>
    </div>
  );
}
