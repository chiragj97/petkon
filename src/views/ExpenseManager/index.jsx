import React from "react";
import InboxOutlinedIcon from "@material-ui/icons/InboxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import TableChartIcon from "@material-ui/icons/TableChart";
import CustomTabs from "components/CustomTabs/CustomTabs";

import ManageExpense from "./ManageExpense";
import AddExpense from "./AddExpense";
import AddIncome from "./AddIncome";
import ChartsOfaccount from "./ChartsOfaccount";

export default function InventoryList() {
  const [activeTab, setactiveTab] = React.useState(0);

  const goHome = () => setactiveTab(0);

  return (
    <div>
      <CustomTabs
        headerColor="primary"
        handleChange={(value) => setactiveTab(value)}
        tabs={[
          {
            tabName: "Manage Payments",
            tabIcon: InboxOutlinedIcon,
            tabContent: <ManageExpense setactiveTab={setactiveTab} />,
          },
          // {
          //   tabName: "Add Expense",
          //   tabIcon: AddBoxOutlinedIcon,
          //   tabContent: <AddExpense goHome={goHome} />,
          // },
          // {
          //   tabName: "Add Income",
          //   tabIcon: AddBoxOutlinedIcon,
          //   tabContent: <AddIncome goHome={goHome} />,
          // },
          {
            tabName: "Chart of Accounts",
            tabIcon: TableChartIcon,
            tabContent: <ChartsOfaccount goHome={goHome} />,
          },
        ]}
        activeTab={activeTab}
      />
    </div>
  );
}
