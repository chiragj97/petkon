import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import EditIcon from "@material-ui/icons/Edit";
import Pagination from "material-ui-flat-pagination";
import GridItem from "components/Grid/GridItem.js";
import MUIDataTable from "mui-datatables";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { SET_SELECTED_INVENTORY_DATA } from "store/action";
import { getVendorProducts } from "ApiService";
import { useHistory } from "react-router-dom";

const GridView = ({ data, editInventory }) =>
  data.map(({ productImage, productName, availableQuantity, sellingPrice, unit, subUnit, _id }, index) => (
    <GridItem sm={12} md={6} lg={4} key={index}>
      <Card className="text-color">
        {/* style={{ minHeight: "300px" }} */}
        <CardBody>
          <div className="d-flex justify-content-center">
            <div style={{ boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)", padding: "5px" }}>
              <img style={{ height: "100px", width: "100px", objectFit: "contain" }} src={productImage} />
            </div>
          </div>
          <p style={{ fontWeight: "bold" }}>{productName}</p>
          <p className="m-0">
            {subUnit} {unit}
          </p>
          <p className="m-0">Price : &#8377;{sellingPrice}</p>
          <div className="d-flex justify-content-between align-items-center ">
            <p className="m-0">Available Quantity : {availableQuantity}</p>
            <EditIcon
              onClick={() => editInventory(index)}
              style={{ background: "#FA5D43", color: " #FFFF", padding: "6px", borderRadius: "50px", fontSize: "20px", cursor: 'pointer' }}
            />
            {/* <Button color="danger" onClick={() => performDeletion(_id)} round>
             Delete
            </Button> */}
          </div>
        </CardBody>
      </Card>
    </GridItem>
  ));

const ListView = ({ data, editInventory }) => {
  const columns = [
    {
      name: "",
      label: "Name",
      options: {
        customBodyRender: (_, { rowIndex }) => {
          const { productImage, productName } = data[rowIndex];
          return (
            <div className="d-flex align-items-center">
              <div className="d-flex justify-content-center">
                <div style={{ boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)", padding: "3px" }}>
                  <img
                    style={{ height: "60px", width: "60px", objectFit: "contain" }}
                    src={productImage}
                  />
                </div>
              </div>
              <p style={{ fontWeight: "bold", marginLeft: "10px" }}>{productName}</p>
            </div>
          );
        },
      },
    },
    {
      name: "",
      label: "Weight",
      options: {
        customBodyRender: (_, { rowIndex }) => {
          const { unitPerQuantity, quantityType } = data[rowIndex];
          return (
            <p>
              {unitPerQuantity} {quantityType}
            </p>
          );
        },
      },
    },
    {
      name: "priceOfSale",
      label: "Price",
      options: {
        customBodyRender: (sellingPrice) => <p>&#8377;{sellingPrice}</p>,
      },
    },
    {
      name: "availableQuantity",
      label: "Avail Quantitiy",
    },
    {
      name: "Action",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (_, { rowIndex }) => {
          return (
            <EditIcon
              onClick={() => editInventory(rowIndex)}
              style={{ background: "#FA5D43", color: " #FFFF", padding: "6px", borderRadius: "50px" }}
            />
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: false,
    filter: false,
    pagination: false,
    print: false,
    search: false,
    selectableRowsHeader: false,
    viewColumns: false,
    download: false,
  };
  return (
    <div className="w-100">
      <MUIDataTable title={""} data={data} columns={columns} options={options} />
    </div>
  );
};
export default function ListInventory() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allInventory, setallInventory] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [currentPage, setcurrentPage] = useState(0);
  const [isGridView, setisGridView] = useState(true);

  const getData = () => {
    getVendorProducts().then(({ data }) => {
      setallInventory(data.products);
      setfilterData(data.products);
    });
  };

  useEffect(() => {
    getData();
  }, []);

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

  const editInventory = (index) => {
    dispatch({
      type: SET_SELECTED_INVENTORY_DATA,
      payload: filterData[index],
    });
    // setactiveTab(1);
    history.push("/app/inventory/AddInventory");
  };

  // const performDeletion = (_id) => {
  //   const isdelete = window.confirm("Are you sure you want to delete ?");
  //   if (isdelete) {
  //     deleteInventory(_id).then(() => {
  //       toast.warning("Deleted Inventory");
  //       getData();
  //     });
  //   }
  // };

  return (
    <Card>
      <CardBody>
        <div style={{ display: "flex", marginBottom: "20px", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="card-title">Item</h3>
          <div className="d-flex" style={{ color: "#fa5d43" }}>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                backgroundColor: "#FEEDEA",
                marginRight: "15px",
                borderRadius: "30px",
              }}
              onClick={() => setisGridView(!isGridView)}
            >
              <div
                style={{
                  backgroundColor: isGridView ? "#FA5D43" : "#FEEDEA",
                  padding: "7px 13px",
                  borderRadius: "30px 0px 0px 30px",
                  color: isGridView ? "#FEEDEA" : "#FA5D43",
                }}
                className="d-flex align-items-center w-50"
              >
                <FormatListBulletedIcon />
              </div>
              <div
                style={{
                  backgroundColor: !isGridView ? "#FA5D43" : "#FEEDEA",
                  padding: "7px 13px",
                  borderRadius: "0px 30px 30px 0px",
                  color: !isGridView ? "#FEEDEA" : "#FA5D43",
                }}
                className="d-flex align-items-center w-50"
              >
                <span className="material-icons">grid_view</span>
              </div>
            </div>
            <div className="inventory-Searchbox-container">
              <SearchIcon style={{ position: "absolute", padding: "4px 6px" }} />
              <input
                type="text"
                placeholder="Search Products"
                onChange={(e) => searchText(e.target.value, ["productName"])}
                className="inventory-Searchbox"
              />
            </div>
          </div>
        </div>

        <GridContainer style={{ backgroundColor: "#F1F4F9" }}>
          {isGridView ? (
            <GridView data={filterData.slice(currentPage, currentPage + 6)} editInventory={editInventory} />
          ) : (
            <ListView data={filterData.slice(currentPage, currentPage + 6)} editInventory={editInventory} />
          )}
        </GridContainer>
        <div style={{ marginTop: "40px", display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            limit={6}
            offset={currentPage}
            size="large"
            total={filterData.length}
            onClick={(e, offset) => setcurrentPage(currentPage + offset)}
            nextPageLabel={<SkipNextIcon />}
            previousPageLabel={<SkipPreviousIcon />}
          />
        </div>
      </CardBody>
    </Card>
  );
}
