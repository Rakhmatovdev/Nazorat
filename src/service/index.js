import axios, { endpoints } from 'src/utils/axios';
// export const getInvoice = (id) => axios.get(`${endpoints.invoice.get}/${id}`);

export const createInvoice = (data) => axios.post(endpoints.invoice.create, data);

export const updateInvoice = (id, data) => axios.put(`${endpoints.invoice.update}/${id}`, data);

export const findInvoice = (id) => axios.get(`${endpoints.invoice.find}/${id}`);
export const deleteInvoice = (id) => axios.delete(`${endpoints.invoice.delete}/${id}`);

export const resList = () => axios.get(endpoints.invoice.list);
