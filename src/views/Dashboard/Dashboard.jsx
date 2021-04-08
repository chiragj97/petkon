import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";

import CardBody from "components/Card/CardBody.js";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DescriptionIcon from "@material-ui/icons/Description";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import Badge from "@material-ui/core/Badge";

import { dailySalesChart } from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { GetdashboardData } from "ApiService";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);
const cardIconstyle = {
  color: "#FFFF",
  fontSize: "20px",
};
const StyledFormControlLabel = withStyles({
  label: { color: "#1C7FD1", fontSize: "11px !important", fontWeight: "600 !important" },
})(FormControlLabel);

const IconCard = ({ icon, color, label, number, onClick }) => {
  const classes = useStyles();

  return (
    <Card onClick={onClick}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-center align-items-center ">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: color,
                borderRadius: "40px",
                width: "40px",
                height: "40px",
              }}
            >
              {typeof icon === "string" ? <i className={icon} aria-hidden="true" style={cardIconstyle} /> : icon}
            </div>
            <h4 style={{ marginLeft: "10px", fontSize: "13px" }} className={classes.cardTitle}>
              {label}
            </h4>
          </div>
          <span
            style={{ fontSize: label == "Last Updated" ? "16px" : "20px", color: color }}
            className={classes.cardTitle}
          >
            {number}
          </span>
        </div>
      </CardBody>
    </Card>
  );
};
export default function Dashboard() {
  const classes = useStyles();

  const history = useHistory();
  const [selectedOrderStatus, setselectedOrderStatus] = useState("week");
  const [allCountData, setallCountData] = useState({
    GSTToBePaid: 0,
    compleateOrder: 0,
    customerOrder: 0,
    dispatchOrder: 0,
    lastUpdate: "",
    orderOfThisMonth: 2,
    orderOfThisWeek: 2,
    pendingOrder: 0,
    salesOrder: 0,
    totalItem: 0,
    totalOrder: 0,
    totalSales: 0,
    unavailable: 0,
    totalCustomer: 0,
    totalSupplier: 0,
    totalStaffs: 0,
    totalUser: 0,
  });

  useEffect(() => {
    GetdashboardData()
      .then(({ data }) => {
        setallCountData(data.success.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const goToUserPage = () => history.push("/app/usermanagement");
  const goToOrderPage = () => history.push("/app/ordermanagement");
  const goToInventoryPage = () => history.push("/app/inventory");
  const goToFinancesPage = () => history.push("/app/ExpenseManager");

  return (
    <div>
      <GridContainer direction="row" alignItems="center">
        <GridItem xs>
          <p className={classes.title}>Orders</p>
          <Card>
            <CardHeader>
              <h4 className={classes.cardTitle}>Daily Orders</h4>
            </CardHeader>
            <CardBody>
              <Card onClick={goToOrderPage}>
                <ChartistGraph
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </Card>
              <IconCard
                onClick={goToOrderPage}
                label="Pending Orders"
                color="#FF4848"
                icon="fa fa-cube"
                number={allCountData.pendingOrder}
              />
              <IconCard
                label="Ready for Dispatch"
                color="#FFB63D"
                icon="fa fa-truck"
                number={allCountData.dispatchOrder}
                onClick={goToOrderPage}
              />

              <IconCard
                label="Completed Orders"
                color="#36B475"
                icon="fa fa-check-circle"
                number={allCountData.compleateOrder}
                onClick={goToOrderPage}
              />
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <RadioGroup
                        value={selectedOrderStatus}
                        onChange={(e) => setselectedOrderStatus(e.target.value)}
                        row
                      >
                        <StyledFormControlLabel
                          value="week"
                          control={<Radio style={{ color: "#1C7FD1" }} />}
                          label="This Week"
                        />
                        <StyledFormControlLabel
                          value="month"
                          control={<Radio style={{ color: "#1C7FD1" }} />}
                          label="This Month"
                        />
                      </RadioGroup>
                    </div>
                    <span style={{ fontSize: "20px", color: "#1C7FD1" }} className={classes.cardTitle}>
                      {selectedOrderStatus === "week" ? allCountData.orderOfThisWeek : allCountData.orderOfThisMonth}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs>
          <p className={classes.title}>Inventory</p>
          <Card>
            <CardHeader>
              <h4 className={classes.cardTitle}>Daily Stock Flow</h4>
            </CardHeader>
            <CardBody onClick={goToInventoryPage}>
              <Card>
                <ChartistGraph
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </Card>
              <IconCard
                label="Total Items in Inventory"
                color="#32A2FF"
                icon="fa fa-cube"
                number={allCountData.pendingOrder}
              />
              <IconCard
                label="Out of Stock"
                color="#FF4848"
                icon="fa fa-cart-arrow-down"
                number={allCountData.totalItem}
              />
              <IconCard label="Low Stock" color="#FFB63D" icon="fa fa-cart-plus" number={allCountData.totalItem} />
              <IconCard
                label="Last Updated"
                color="#C1C1C1"
                icon="fa fa-calendar-o"
                number={new Date(allCountData.lastUpdate).toLocaleDateString()}
              />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs>
          <p className={classes.title}>Finances</p>
          <Card>
            <CardHeader>
              <h4 className={classes.cardTitle}>Daily Cash Flow</h4>
            </CardHeader>
            <CardBody onClick={goToFinancesPage}>
              <Card>
                <ChartistGraph
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </Card>
              <IconCard
                label="Total Income"
                color="#36B475"
                icon={<AccountBalanceWalletIcon style={cardIconstyle} />}
                number="&#8377; 0"
              />
              <IconCard
                label="Pending Income"
                color="#FF4848"
                icon={<AccountBalanceWalletIcon style={cardIconstyle} />}
                number="- &#8377;0"
              />
              <IconCard
                label="Total Expense"
                color="#FF4848"
                icon={<DescriptionIcon style={cardIconstyle} />}
                number="- &#8377;0"
              />
              <IconCard
                label="Pending Expense"
                color="#FFB63D"
                icon={
                  <Badge badgeContent={"i"} color="white">
                    <DescriptionIcon style={cardIconstyle} />
                  </Badge>
                }
                number="- &#8377;0"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <div>
        <p className={classes.title}>Users</p>
        <Card>
          <CardBody onClick={goToUserPage}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="dashbord-user-card">
                <span class="material-icons" style={{ color: "#1C7FD1", fontSize: "50px" }}>
                  groups
                </span>
                <h4 style={{ fontSize: "15px", color: "#1C7FD1" }} className={classes.cardTitle}>
                  Total Users
                </h4>
                <h4 style={{ fontSize: "30px", color: "#0B2559" }} className={classes.cardTitle}>
                  {allCountData.totalUser}
                </h4>
              </div>
              <div className=" dashbord-user-card">
                <span class="material-icons" style={{ color: "#1C7FD1", fontSize: "50px" }}>
                  <LocalMallOutlinedIcon style={{ position: "absolute", marginLeft: "38px", marginTop: "10px" }} />
                  person_outline
                </span>
                <h4 style={{ fontSize: "15px", color: "#1C7FD1" }} className={classes.cardTitle}>
                  Customers
                </h4>
                <h4 style={{ fontSize: "30px", color: "#0B2559" }} className={classes.cardTitle}>
                  {allCountData.totalCustomer}
                </h4>
              </div>
              <div className="dashbord-user-card">
                <span class="material-icons" style={{ color: "#1C7FD1", fontSize: "50px" }}>
                  person_outline
                </span>
                <h4 style={{ fontSize: "15px", color: "#1C7FD1" }} className={classes.cardTitle}>
                  Staff
                </h4>
                <h4 style={{ fontSize: "30px", color: "#0B2559" }} className={classes.cardTitle}>
                  {allCountData.totalStaffs}
                </h4>
              </div>
              <div style={{ borderRight: "none" }} className="dashbord-user-card">
                <span class="material-icons" style={{ color: "#1C7FD1", fontSize: "50px" }}>
                  <i
                    className="fa fa-cube"
                    style={{ position: "absolute", fontSize: "20px", marginLeft: "38px", marginTop: "10px" }}
                  />
                  person_outline
                </span>
                <h4 style={{ fontSize: "15px", color: "#1C7FD1" }} className={classes.cardTitle}>
                  Supplier
                </h4>
                <h4 style={{ fontSize: "30px", color: "#0B2559" }} className={classes.cardTitle}>
                  {allCountData.totalSupplier}
                </h4>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
