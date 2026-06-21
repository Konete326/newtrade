import apiClient from './apiClient';

export const printService = {
  getInvoice: (id) => apiClient.get(`/print/invoice/${id}`),
  getChallan: (id) => apiClient.get(`/print/challan/${id}`),
  sendInvoiceWhatsapp: (id) => apiClient.post(`/print/whatsapp/invoice/${id}`),
  sendReminder: (customerId) => apiClient.post(`/print/whatsapp/reminder/${customerId}`),
  sendMessage: (data) => apiClient.post('/print/whatsapp/send', data),
};
