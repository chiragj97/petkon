import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AssignmentIcon from "@material-ui/icons/Assignment";
import StoreIcon from "@material-ui/icons/Store";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";

// import Maps from "views/Maps/Maps";
// import RTLPage from "views/RTLPage/RTLPage";

import DashboardPage from "views/Dashboard/Dashboard";
import OrdersList from "views/OrdersManagment/OrdersList";
import OrderDetails from "views/OrdersManagment/OrderDetails";
import AddInventory from "views/InventoryManament/AddInventory";
import ListInventory from "views/InventoryManament/ListInventory";
import BulkUpload from "views/InventoryManament/BulkUpload";

import ListUsers from "views/UserManagment/ListUsers";
import AddUser from "views/UserManagment/AddUser";

import AddExpense from "views/ExpenseManager/AddExpense";
import AddIncome from "views/ExpenseManager/AddIncome";
import ManageExpense from "views/ExpenseManager/index";

import Sales from "views/Sales/index";

import CustCart from "views/Customer/Cart/Cart";
import CustOrderHistory from "views/Customer/OrderHistory/OrderHistory";
import CustStore from "views/Customer/Store/Store";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    showInSide: true,
    role: "store",
  },
  {
    name: "Order Mangement",
    icon: LibraryBooks,
    showInSide: true,
    role: "store",
    subMenu: [
      {
        path: "/ordermanagement/pending",
        name: "Pending Orders",
        component: OrdersList,
      },
      {
        path: "/ordermanagement/dispatch",
        name: "Ready for Dispatch",
        component: OrdersList,
      },
      {
        path: "/ordermanagement/completed",
        name: "Completed Orders",
        component: OrdersList,
      },
    ],
  },
  {
    path: "/OrderDetails",
    showInSide: false,
    component: OrderDetails,
    role: "store",
  },
  {
    name: "Inventory",
    icon: "content_paste",
    showInSide: true,
    role: "store",
    subMenu: [
      {
        path: "/inventory/ListInventory",
        name: "Items",
        component: ListInventory,
      },
      {
        path: "/inventory/AddInventory",
        name: "Add an Item",
        component: AddInventory,
      },
      {
        path: "/inventory/BulkUpload",
        name: "Bulk Upload",
        component: BulkUpload,
      },
    ],
  },
  {
    name: "User Mangement",
    icon: Person,
    showInSide: true,
    role: "store",
    subMenu: [
      {
        path: "/userManagement/list",
        name: "User List",
        component: ListUsers,
      },
      {
        path: "/userManagement/add",
        name: "Add an User",
        component: AddUser,
      },
    ],
  },
  {
    name: "Expense Manager",
    icon: ReceiptIcon,
    showInSide: true,
    role: "store",
    subMenu: [
      {
        path: "/userManagement/manage",
        name: "Manage Expense",
        component: ManageExpense,
      },
      {
        path: "/userManagement/addExpense",
        name: "Add Expense",
        component: AddExpense,
      },
      {
        path: "/userManagement/addIncome",
        name: "Add Income",
        component: AddIncome,
      },
    ],
  },
  {
    path: "/sales",
    name: "Sales",
    icon: LocalOfferIcon,
    component: Sales,
    showInSide: true,
    role: "store",
  },
  {
    path: "/dashboard",
    name: "Store",
    icon: StoreIcon,
    component: CustStore,
    showInSide: true,
    role: "customer",
  },
  {
    path: "/Cart",
    name: "Cart",
    icon: ShoppingCartIcon,
    component: CustCart,
    showInSide: true,
    role: "customer",
  },
  {
    path: "/OrderHistory",
    name: "OrderHistory",
    icon: AssignmentIcon,
    component: CustOrderHistory,
    showInSide: true,
    role: "customer",
  },
];

export default dashboardRoutes;
