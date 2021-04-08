import axios from 'axios';
import jwt_decode from 'jwt-decode';

// http://139.59.46.91:3001
export const ROOT_API =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://mybizbook.in';
export const bulk_upload_sample = `${ROOT_API}/public/bulkupload_sample.xlsx`;

const MAIN_API = `${ROOT_API}/api/v1`;
const token = localStorage.getItem('token');

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) logout();
//     return Promise.reject(error);
//   }
// );

export const logout = () => {
  localStorage.removeItem('token');
  window.location.reload();
};

export const getLoginDetails = () => {
  const token = localStorage.getItem('token');
  const decoded = jwt_decode(token);
  return decoded;
};
export const postLogin = (data) => axios.post(`${MAIN_API}/bothLogin`, data);
export const createStores = (data) =>
  axios.post(`${MAIN_API}/createStores`, data);
export const sendForgotPasswordLink = (data) =>
  axios.post(`${MAIN_API}/forgotPassword`, data);
export const verifyPassword = (data) =>
  axios.post(`${MAIN_API}/verifyPassword`, data);

export const GetdashboardData = () => axios.get(`${MAIN_API}/getAllCount`);

export const postCustomer = (data) => axios.post(`${MAIN_API}/client`, data);
export const updateCustomer = (id, data) =>
  axios.put(`${MAIN_API}/client/${id}`, data);
export const deleteCustomer = (id) => axios.delete(`${MAIN_API}/client/${id}`);
export const getAllCustomer = () => axios.get(`${MAIN_API}/getAllClients`);

export const postInventory = (data) =>
  axios.post(`${MAIN_API}/inventory`, data);
// export const updateInventory = (id, data) => axios.put(`${MAIN_API}/inventory/${id}`, data);
export const deleteInventory = (id) =>
  axios.delete(`${MAIN_API}/inventory/${id}`);
export const getAllInventory = () => axios.get(`${MAIN_API}/allInventory`);
export const bulkUpload_Inventory = (data) =>
  axios.post(`${MAIN_API}/bulkInventory`, data);

export const getAllOrders = (orderStatus) =>
  axios
    .get(`${MAIN_API}/getAllOrder`)
    .then(({ data }) =>
      data.success.data.filter((item) => item.orderStatus === orderStatus)
    );
export const update_Order = (data, id) =>
  axios.put(`${MAIN_API}/order/${id}`, { ...data });

export const generateInvoice = (data) =>
  axios.post(`${MAIN_API}/orderInvoice`, data);

export const postStaff = (data) => axios.post(`${MAIN_API}/staff`, data);
export const updateStaff = (id, data) =>
  axios.put(`${MAIN_API}/staff/${id}`, data);
export const deleteStaff = (id) => axios.delete(`${MAIN_API}/staff/${id}`);
export const getAllStaff = () => axios.get(`${MAIN_API}/getAllStaff`);

export const postSupplier = (data) => axios.post(`${MAIN_API}/Supplier`, data);
export const updateSupplier = (id, data) =>
  axios.put(`${MAIN_API}/Supplier/${id}`, data);
export const deleteSupplier = (id) =>
  axios.delete(`${MAIN_API}/Supplier/${id}`);
export const getAllSupplier = () => axios.get(`${MAIN_API}/getAllSupplier`);

export const postExpense = (data) =>
  axios.post(`${MAIN_API}/expenseManager`, data);
export const updateExpense = (id, data) =>
  axios.put(`${MAIN_API}/expenseManager/${id}`, data);
export const deleteExpense = (id) =>
  axios.delete(`${MAIN_API}/expenseManager/${id}`);
export const getAllExpense = () =>
  axios.get(`${MAIN_API}/getAllexpenseManager`);

export const postExpenseCategory = (data) =>
  axios.post(`${MAIN_API}/expenseCategory`, data);
export const updateExpenseCategory = (id, data) =>
  axios.put(`${MAIN_API}/expenseCategory/${id}`, data);
export const deleteExpenseCategory = (id) =>
  axios.delete(`${MAIN_API}/expenseCategory/${id}`);
export const getAllExpenseCategory = () =>
  axios.get(`${MAIN_API}/expenseCategorys`);
export const getExpenseCategory = (type) =>
  axios.get(`${MAIN_API}/expenseCategory/${type}`);

export const post_addtoCart = (data) => axios.post(`${MAIN_API}/cart`, data);
export const get_addtoCart = (clientId) =>
  axios.get(`${MAIN_API}/getCart/${clientId}`);
export const post_Order = (data) => axios.post(`${MAIN_API}/order/`, data);
export const delete_addtoCart = (cartIds) =>
  axios.delete(`${MAIN_API}/removeFromCart/`, {
    data: { cartId: cartIds },
  });

export const cutomer_get_getOrders = (clientId) =>
  axios.get(`${MAIN_API}/getOrder/${clientId}`);

export const API = 'http://localhost:5000';

export const postVendorLogin = (data) =>
  axios.post(`${API}/vendor/login`, data);

export const getVendorProducts = () => {
  return axios.get(`${API}/vendor/get_vendor_store`);
};

export const addProduct = (productDetails) => {
  return axios.post(`${API}/inventory/add_product`, productDetails);
};

export const updateInventory = (id, data) => {
  return axios.post(`${API}/inventory/product/update/${id}`, data);
};
