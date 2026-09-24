export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-+()]/g, '');
  return /^\d{10,12}$/.test(cleaned);
}

export function isValidPincode(pincode) {
  if (!pincode) return false;
  return /^\d{6}$/.test(String(pincode).trim());
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

export default {
  isValidEmail,
  isValidPhone,
  isValidPincode,
  sanitizeString
};
