import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Button from "components/CustomButtons/Button.js";
import Custome_Input from "components/MyCustomeInput/MyCustomeInput";

import { postCustomer, updateCustomer } from "ApiService";
import { SET_SELECTED_CUSTOMER_DATA } from "store/action";
import countryJSON from "helper/constant/country.json";
import { customerTypeJSON, customerCategoryJSON, stateJSON, GSTTreatmentJSON } from "helper/constant/userForm.json";

export default function AddSaleCustomer({ closeDialog, getallData }) {
  const methods = useForm({
    defaultValues: {
      country: "India",
    },
  });
  const dispatch = useDispatch();
  const { handleSubmit, setValue, watch, getValues } = methods;
  const customerData = useSelector(({ selectedData }) => selectedData.customerData);
  const isUpdate = Object.keys(customerData).length !== 0;

  const { userFormType } = watch();

  useEffect(() => {
    return () => {
      dispatch({
        type: SET_SELECTED_CUSTOMER_DATA,
        payload: {},
      });
    };
  }, []);

  useEffect(() => {
    if (isUpdate) {
      Object.keys(customerData).forEach((key) => setValue(key, customerData[key]));
    }
  }, [customerData, userFormType]);

  const setBillingAddress = (checked) => {
    if (checked) {
      setValue("SBuilding", getValues("building"));
      setValue("SStreet", getValues("street"));
      setValue("SCity", getValues("city"));
      setValue("SState", getValues("state"));
      setValue("SCountry", getValues("country"));
      setValue("SZipCode", getValues("zipCode"));
    }
  };

  const onSubmit = (data) => {
    data.role = "sales";

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const actionMethode = isUpdate ? updateCustomer(customerData._id, formData) : postCustomer(formData);
    actionMethode
      .then(({ data }) => {
        if (data.success && data.success.statusCode === 200) {
          toast.success(`${isUpdate ? "Updated" : "Added"} success`);
          getallData();
          closeDialog();
        } else {
          toast.warn(data.message);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <h3 className="card-title text-center">{isUpdate ? "UPDATE" : "ADD"} Sales Customer </h3>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Custome_Input name="customerType" label="Customer Type" isrequired type="select" option={customerTypeJSON} />
          <Custome_Input
            name="customerCategory"
            label="Customer Category"
            isrequired
            type="select"
            option={customerCategoryJSON}
          />
          <Custome_Input name="name" label="Name" isrequired />
          <Custome_Input name="email" type="email" label="Email" isrequired />
          <Custome_Input name="phoneNumber" label="Phone Number" isrequired />
          <span style={{ fontWeight: "bold" }}>Billing Address :</span>
          <Custome_Input name="building" label="Building" isrequired />
          <Custome_Input name="street" label="Street" isrequired />
          <Custome_Input name="city" label="City" isrequired />
          <Custome_Input name="state" label="State" isrequired type="select" option={stateJSON} />
          <Custome_Input
            name="country"
            label="Country"
            isrequired
            type="select"
            option={countryJSON.map(({ name }) => ({ label: name, value: name }))}
          />
          <Custome_Input name="zipCode" label="Zip Code" isrequired />
          <div>
            <span style={{ fontWeight: "bold" }}>Shipping Address :</span>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={
                <Checkbox onChange={(e) => setBillingAddress(e.target.checked)} name="checkedB" color="primary" />
              }
              label="Same as Billing Address :"
            />
          </div>
          <Custome_Input name="SBuilding" label="Building" isrequired />
          <Custome_Input name="SStreet" label="Street" isrequired />
          <Custome_Input name="SCity" label="City" isrequired />
          <Custome_Input name="SState" label="State" isrequired type="select" option={stateJSON} />
          <Custome_Input
            name="SCountry"
            label="Country"
            type="select"
            option={countryJSON.map(({ name }) => ({ label: name, value: name }))}
            isrequired
          />
          <Custome_Input name="SZipCode" label="Zip Code" isrequired />
          <Custome_Input name="GSTTreatment" label="GST Treatment" isrequired type="select" option={GSTTreatmentJSON} />
          <Custome_Input name="Placeofsupply" label="Place of supply" isrequired type="select" option={stateJSON} />
          <Custome_Input name="GSTNumber" label="GST Number" isrequired />
          <Custome_Input tag="textarea" name="CIN" label="CIN" />
          <Custome_Input
            name="TaxPreference"
            label="Tax Preference"
            type="select"
            option={[
              {
                label: "Taxable",
                value: "Taxable",
              },
              {
                label: "Tax Exempt",
                value: "Tax Exempt",
              },
            ]}
          />

          <Custome_Input name="creditLimitTime" type="number" label="Payment Terms in days" />
          <Custome_Input name="creditLimitAmount" type="number" label="Credit Limit Amount" />
          <Custome_Input name="Currency" label="Currency" />
          <Custome_Input name="OpeningBalance" type="number" label="Opening Balance" />
          <Button type="submit" color="primary">
            {isUpdate ? "Update" : "Add"} Sales Customer
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
