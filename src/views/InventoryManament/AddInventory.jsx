import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Button from 'components/CustomButtons/Button';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';

import { SET_SELECTED_INVENTORY_DATA } from 'store/action';

import { addProduct, updateInventory, ROOT_API } from 'ApiService';
import catogaryData from 'helper/constant/catogary.json';
import countryData from 'helper/constant/country.json';
import Custome_Input from 'components/MyCustomeInput/MyCustomeInput';

export default function AddInventry({}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const methods = useForm();

  const { handleSubmit, setValue, watch } = methods;
  const inventoryData = useSelector(
    ({ selectedData }) => selectedData.inventoryData
  );
  const image = watch('image');
  const [dataValue, setDatavalue] = useState('Food');
  const options = catogaryData[dataValue];
  const productCategory = watch('productCategory');
  const isUpdate = Object.keys(inventoryData).length !== 0;

  useEffect(() => {
    setDatavalue(productCategory);
  }, [productCategory]);

  useEffect(() => {
    if (inventoryData) {
      Object.keys(inventoryData).forEach((key) =>
        setValue(key, inventoryData[key])
      );
    }
  }, [inventoryData]);

  useEffect(() => {
    return () => {
      dispatch({
        type: SET_SELECTED_INVENTORY_DATA,
        payload: {},
      });
    };
  }, []);
  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) =>
      formData.append(key, key === 'image' ? data[key][0] : data[key])
    );
    if (!isUpdate) {
      addProduct(formData)
        .then(({ data }) => {
          if (data.status) {
            toast.success(data.message);
            history.push('/app/inventory/ListInventory');
          } else {
            toast.warn(data.message);
          }
        })
        .catch((error) => console.log('error', error));
    } else {
      updateInventory(inventoryData.id, formData)
        .then(({ data }) => {
          if (data.status) {
            toast.success(data.message);
            history.push('/app/inventory/ListInventory');
          } else {
            toast.warn(data.message);
          }
        })
        .catch((error) => console.log('error', error));
    }
  };

  console.log('Invenotry', inventoryData.productImage);

  return (
    <Card>
      <CardBody>
        <h3 className="card-title">{isUpdate ? 'Update' : 'Add'} Item</h3>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <GridContainer>
              <GridItem item xs={6}>
                <Custome_Input
                  style={{ width: '100%' }}
                  name="productName"
                  label="Product Name"
                  isrequired
                />
                <Custome_Input
                  style={{ width: '100%' }}
                  name="productBrand"
                  label="Product Brand"
                  isrequired
                />
                <Custome_Input
                  name="petType"
                  label="Pet Type"
                  type="select"
                  option={[
                    {
                      label: 'Cat',
                      value: 'Cat',
                    },
                    {
                      label: 'Dog',
                      value: 'Dog',
                    },
                    {
                      label: 'Rabbit',
                      value: 'Rabbit',
                    },
                    {
                      label: 'Birds',
                      value: 'Birds',
                    },
                    {
                      label: 'Rat',
                      value: 'Rat',
                    },
                    {
                      label: 'Fish',
                      value: 'Fish',
                    },
                    {
                      label: 'Other',
                      value: 'Other',
                    },
                    {
                      label: 'Not Applicable',
                      value: 'N/A',
                    },
                  ]}
                  isrequired
                />
                <Custome_Input
                  name="productCategory"
                  label="Category"
                  isrequired
                  type="select"
                  option={[
                    {
                      label: 'Food',
                      value: 'Food',
                    },
                    {
                      label: 'Treats',
                      value: 'Treats',
                    },
                  ]}
                />
                <Custome_Input
                  name="productSubcategory"
                  label="Sub Category"
                  type="select"
                  option={
                    options !== undefined
                      ? options.map(({ title }) => ({
                          label: title,
                          value: title,
                        }))
                      : [{ label: 'Select', value: 'Select' }]
                  }
                />
                <Custome_Input
                  name="productDescription"
                  label="Product description"
                  isrequired
                />
                <Custome_Input
                  name="shelfLife"
                  label="Shelf Life in number of days"
                  type="number"
                  isrequired
                />
                <Custome_Input
                  name="unit"
                  label="Unit"
                  isrequired
                  type="select"
                  option={[
                    { label: 'Pieces', value: 'Pieces' },
                    { label: 'Sheets', value: 'Sheets' },
                    { label: 'Bottle', value: 'Bottle' },
                    { label: 'Kgs', value: 'Kgs' },
                    { label: 'gms', value: 'gms' },
                    { label: 'Ltr', value: 'Ltr' },
                    { label: 'ml', value: 'ml' },
                    { label: 'Dozen', value: 'Dozen' },
                    { label: 'Set', value: 'Set' },
                    { label: 'ft', value: 'ft' },
                    { label: 'meter', value: 'meter' },
                    { label: 'Sq.ft', value: 'Sq.ft' },
                    { label: 'Sq.meter', value: 'Sq.meter' },
                    { label: 'Box', value: 'Box' },
                  ]}
                />
                <Custome_Input
                  name="availableQuantity"
                  label="Quanity available"
                  type="number"
                  isrequired
                />

                <Custome_Input
                  name="sellingPrice"
                  type="number"
                  label="Selling Price for Retail Customer"
                  isrequired
                />
                {/* <Custome_Input
                  name="priceOfRetailDistributor"
                  type="number"
                  label="Selling Price for Retail Distributor"
                /> */}
                {/* <Custome_Input
                  name="priceOfWholesaleDistributor"
                  type="number"
                  label="Selling Price for Wholesale Distributor"
                /> */}
                {/* <Custome_Input name="priceOfSuperStockist" type="number" label="Selling Price for Super Stockist" /> */}
              </GridItem>
              <GridItem item xs={6}>
                <Custome_Input
                  name="image"
                  type="file"
                  label={isUpdate ? 'Change Image' : 'Upload Image'}
                  isPreview={
                    image !== undefined && image.length !== 0
                      ? window.URL.createObjectURL(image[0])
                      : isUpdate
                      ? inventoryData.productImage[0]
                      : 'https://i.imgur.com/sZ64r9p.png'
                  }
                />

                <Custome_Input
                  name="vegNonVeg"
                  label="Veg / Non-Veg"
                  isrequired
                  type="select"
                  option={[
                    {
                      label: 'Veg',
                      value: 'Veg',
                    },
                    {
                      label: 'Non-veg',
                      value: 'Non-veg',
                    },
                    {
                      label: 'Not Applicable',
                      value: 'Not Applicable',
                    },
                  ]}
                />
                <Custome_Input
                  name="country"
                  label="Country Of Orgin"
                  isrequired
                  type="select"
                  option={countryData.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                />
                <Custome_Input
                  name="mrp"
                  type="number"
                  label="MRP"
                  isrequired
                />
                <Custome_Input
                  name="gst"
                  label="GST"
                  isrequired
                  type="select"
                  option={[
                    {
                      label: '0%',
                      value: '0%',
                    },
                    {
                      label: '5%',
                      value: '5%',
                    },
                    {
                      label: '12%',
                      value: '12%',
                    },
                    {
                      label: '18%',
                      value: '18%',
                    },
                    {
                      label: '28%',
                      value: '28%',
                    },
                  ]}
                />
                <Custome_Input name="igst" label="IGST" />
                <Custome_Input name="cgst" label="CGST" />

                {/* <Custome_Input name="customTaxName" label="Custom Tax Name" /> */}
                <Custome_Input
                  name="subUnit"
                  type="number"
                  label="Subunits Per Unit"
                />
                <Custome_Input
                  name="perishable"
                  type="select"
                  label="Perishable / Non-Perishable"
                  option={[
                    { label: 'Perishable', value: 'Perishable' },
                    { label: 'Non-Perishable', value: 'Non-Perishable' },
                    { label: 'Not Applicable', value: 'N/A' },
                  ]}
                  isrequired
                />

                {/* <Custome_Input name="MOQ" type="number" label="Minimum Order Quantity" /> */}
                <Custome_Input name="discount" type="number" label="Discount" />
                {/* <Custome_Input name="customTaxRate" type="number" label="Custom Tax Rate" /> */}
              </GridItem>
            </GridContainer>

            {/*<Custome_Input name="discountPerMOQ" type="number" label="Discount in Percentage per Unit" isrequired />
            <Custome_Input name="purchasePriceWithGST" type="number" label="Purchase Price With GST" isrequired />
            <Custome_Input name="BOQ" type="number" label="Min Order Quantity (Bulk Orders)" isrequired />*/}
            <Button type="submit" color="primary">
              {isUpdate ? 'Update' : 'Add'} Item
            </Button>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
