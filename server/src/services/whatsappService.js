const axios = require('axios');

const WHATSAPP_API = 'https://graph.facebook.com/v18.0';

const sendMessage = async (to, messageBody) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneNumberId || !token) throw new Error('WhatsApp credentials not configured.');
  const url = `${WHATSAPP_API}/${phoneNumberId}/messages`;
  const response = await axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: messageBody }
  }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  return response.data;
};

const sendTemplate = async (to, templateName, languageCode, parameters) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneNumberId || !token) throw new Error('WhatsApp credentials not configured.');
  const url = `${WHATSAPP_API}/${phoneNumberId}/messages`;
  const components = parameters ? [{
    type: 'body',
    parameters: parameters.map(p => ({ type: 'text', text: String(p) }))
  }] : [];
  const response = await axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: { name: templateName, language: { code: languageCode || 'en' }, components }
  }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  return response.data;
};

const sendInvoice = async (to, invoiceData) => {
  const lines = [
    `*Invoice: ${invoiceData.invoiceNumber}*`,
    `Date: ${new Date(invoiceData.createdAt).toLocaleDateString('en-PK')}`,
    '',
    ...invoiceData.items.map(i => `${i.name} x${i.quantity} = Rs.${i.total}`),
    '',
    `*Total: Rs.${invoiceData.totalAmount}*`,
    `Type: ${invoiceData.saleType}`
  ];
  return sendMessage(to, lines.join('\n'));
};

const sendPaymentReminder = async (to, customerName, balance) => {
  const message = `Dear ${customerName},\n\nYour current outstanding balance is Rs.${balance}.\nPlease arrange payment at your earliest convenience.\n\nThank you for your business.`;
  return sendMessage(to, message);
};

module.exports = { sendMessage, sendTemplate, sendInvoice, sendPaymentReminder };
