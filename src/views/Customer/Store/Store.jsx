import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Card from "components/Card/Card.js";
import { getAllInventory, ROOT_API, post_addtoCart, getLoginDetails } from "ApiService";

const useStyles = makeStyles(() => ({
  root: {
    paddingBottom: "20px",
  },
  image: {
    width: 128,
    height: 128,
  },
}));

export default function InventoryList() {
  const classes = useStyles();
  const [allInventory, setallInventory] = useState([]);
  const [selectedItem, setselectedItem] = useState([]);
  const [filterData, setfilterData] = useState([]);

  const { customerId: clientId } = getLoginDetails();

  useEffect(() => {
    getAllInventory().then(({ data }) => {
      setallInventory(data.success.data);
      setfilterData(data.success.data);
    });
  }, []);

  const addtoCart = (id, priceOfSale) => {
    const item = selectedItem.find((e) => e.id === id);
    if (!item || item.qty <= 0) return alert("please add some quantity");
    post_addtoCart({
      clientId,
      inventoryId: id,
      quantity: item.qty,
      netPrice: priceOfSale,
    })
      .then(({ data }) => {
        if (data.success && data.success.statusCode === 200) {
          toast.success(`Item Added successfully`);
          const updatedData = selectedItem.map((x) => (x.id === id ? { ...x, qty: 0 } : x));
          setselectedItem(updatedData);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleQtychnage = (id, value, action) => {
    let updatedData = [];
    if (selectedItem.some((e) => e.id === id)) {
      switch (action) {
        case "input":
          updatedData = selectedItem.map((x) => (x.id === id ? { ...x, qty: value } : x));
          break;
        case "add":
          updatedData = selectedItem.map((x) => (x.id === id ? { ...x, qty: x.qty + value } : x));
          break;
        case "remove":
          updatedData = selectedItem.map((x) =>
            x.id == id ? { ...x, qty: x.qty - value <= 0 ? 0 : x.qty - value } : x
          );
          break;
      }
    } else {
      updatedData = [...selectedItem, { id: id, qty: value }];
    }
    setselectedItem(updatedData);
  };

  const searchText = (search, keys) => {
    search = search.toLowerCase();
    if (!search || search === "") {
      setfilterData(allInventory);
    } else {
      const filteredName = allInventory.filter((item) =>
        keys.find((inneritem) => String(item[inneritem]).toLowerCase().match(search))
      );
      setfilterData(filteredName);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", marginBottom: "20px", justifyContent: "center", alignItems: "center" }}>
        <TextField
          placeholder="Search (SKU or Name)"
          label="Search (SKU or Name)"
          onChange={(e) => searchText(e.target.value, ["name", "SKUNumber"])}
          fullWidth
        />
        <SearchIcon style={{ marginLeft: "-35px" }} />
      </div>
      <Card className={classes.root}>
        <GridContainer spacing={3}>
          {filterData.map(({ images, name, SKUNumber, priceOfSale, _id }) => (
            <GridItem style={{ marginTop: "20px" }} xs key={_id}>
              <GridItem xs>
                <img className={classes.image} src={`${ROOT_API}/${images[0]}`} />
              </GridItem>
              <GridItem xs>
                <GridItem>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                </GridItem>
                <GridItem>
                  <Typography variant="subtitle3">{SKUNumber}</Typography>
                </GridItem>
                <GridItem>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button justIcon color="danger" size="sm" onClick={() => handleQtychnage(_id, 1, "remove")}>
                      <RemoveIcon />
                    </Button>
                    <div style={{ margin: "10px" }}>
                      <input
                        type="number"
                        defaultValue={0}
                        value={selectedItem.find((item) => item.id == _id)?.qty}
                        onChange={(e) => handleQtychnage(_id, Number(e.target.value), "input")}
                        style={{ width: "25px" }}
                      />
                    </div>
                    <Button justIcon color="primary" size="sm" onClick={() => handleQtychnage(_id, 1, "add")}>
                      <AddIcon />
                    </Button>
                    <Typography style={{ margin: "8px" }} variant="subtitle1">
                      {"\u20B9"}
                      {priceOfSale}
                    </Typography>
                  </div>
                  <Button color="success" onClick={() => addtoCart(_id, priceOfSale)}>
                    Add to cart
                  </Button>
                </GridItem>
              </GridItem>
            </GridItem>
          ))}
        </GridContainer>
      </Card>
    </div>
  );
}
