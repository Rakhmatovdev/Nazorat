import axios, { endpoints } from 'src/utils/axios';

export const createInvoice = (data) => axios.post(endpoints.invoice.create, data);

export const updateInvoice = (id, data) => axios.put(`${endpoints.invoice.update}/${id}`, data);

export const findInvoice = (id) => axios.get(`${endpoints.invoice.find}/${id}`);

export const deleteInvoice = (id) => axios.delete(`${endpoints.invoice.delete}/${id}`);

export const statusInvoice = (id) => axios.put(`${endpoints.invoice.status}/${id}`);

export const resList = () => axios.get(endpoints.invoice.list);

export const getUserList = () => axios.get(endpoints.invoice.getuserlist);

export const addUserToDocument = (id, data) => axios.post(`${endpoints.invoice.addUserToDocument}/${id}`, data);


export const resListUser = () => axios.get(endpoints.users.list);

export const resListRole = () => axios.get(endpoints.users.roles);