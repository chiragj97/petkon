import React, { useState, useEffect } from "react";
import CustomTabs from "components/CustomTabs/CustomTabs";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { RadioGroup, Radio, FormControlLabel } from "@material-ui/core";
import { postExpenseCategory, updateExpenseCategory, getAllExpenseCategory } from "ApiService";
import { toast } from "react-toastify";
import Select from "react-select";

const NewCategory = ({ hideModel }) => {
  const [category, setcategory] = useState("");
  const [type, settype] = useState("Expense");

  const submitData = () => {
    postExpenseCategory({ category, type })
      .then(({ data }) => {
        if (data.success && data.success.statusCode === 200) {
          hideModel();
          toast.success("Added Category success");
        } else {
          toast.warn(data.message);
        }
      })
      .catch((error) => toast.warn("error", error));
  };
  return (
    <div>
      Asset Account
      <div>
        <CustomInput
          labelText="Category Name"
          inputProps={{
            value: category,
            onChange: (e) => setcategory(e.target.value),
          }}
        />
      </div>
      <div style={{ marginTop: "10px", display: "flex" }}>
        <p>Type of Category :</p>
        <RadioGroup
          value={type}
          onChange={(e) => settype(e.target.value)}
          style={{ flexDirection: "row", marginLeft: "15px" }}
        >
          <FormControlLabel value="Expense" control={<Radio />} label="Expense" />
          <FormControlLabel value="Income" control={<Radio />} label="Income" />
        </RadioGroup>
      </div>
      <Button block color="primary" onClick={submitData}>
        Save Category
      </Button>
    </div>
  );
};

const NewSubCategory = ({ hideModel }) => {
  const [subCategory, setsubCategory] = useState("");
  const [allcategory, setallcategory] = useState([]);
  const [selectedcategory, setselectedcategory] = useState("");

  useEffect(() => {
    getAllExpenseCategory().then(({ data }) => {
      setallcategory(data.success.data.map(({ _id, category }) => ({ value: _id, label: category })));
    });
  }, []);

  const submitData = () => {
    updateExpenseCategory(selectedcategory.value, { subCategory })
      .then(({ data }) => {
        if (data.success && data.success.statusCode === 200) {
          hideModel();
          toast.success("Added Sub Category success");
        } else {
          toast.warn(data.message);
        }
      })
      .catch((error) => toast.warn("error", error));
  };

  return (
    <div>
      <div>
        <p>Select Category :</p>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          options={allcategory}
          isSearchable
          onChange={(selectedOption) => setselectedcategory(selectedOption)}
          value={selectedcategory}
        />
      </div>
      <div>
        <CustomInput
          labelText="Sub Category Name"
          inputProps={{
            value: subCategory,
            onChange: (e) => setsubCategory(e.target.value),
          }}
        />
      </div>

      <Button block color="primary" onClick={submitData}>
        Save Sub Category
      </Button>
    </div>
  );
};

function AddExpenseCategory({ hideModel }) {
  return (
    <CustomTabs
      headerColor="primary"
      plainTabs
      tabs={[
        {
          tabName: "Add New Category",
          tabContent: <NewCategory hideModel={hideModel} />,
        },
        {
          tabName: "Add New Sub Category",
          tabContent: <NewSubCategory hideModel={hideModel} />,
        },
      ]}
    />
  );
}

export default AddExpenseCategory;
