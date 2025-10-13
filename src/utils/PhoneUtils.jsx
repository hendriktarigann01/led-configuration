/**
 * Phone number formatting utilities
 * Handles formatting for multiple country codes with proper dash placement
 */

/**
 * Format phone number for display (with dashes)
 * Used in the UI while typing
 * @param {string} phone - Raw phone number with country code
 * @param {object} country - Country metadata from react-international-phone
 * @returns {string} Formatted phone number with dashes
 */
export const formatPhoneForDisplay = (phone, country) => {
  if (!phone) return "";
  
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return phone;
  
  // Indonesia (62): 62-8xx-xxxx-xxxx
  if (country?.iso2 === 'id' || cleaned.startsWith('62')) {
    const number = cleaned.startsWith('62') ? cleaned.substring(2) : cleaned;
    if (number.length === 0) return '+62';
    
    const parts = ['+62'];
    if (number.length > 0) parts.push(number.substring(0, 3));
    if (number.length > 3) {
      let remaining = number.substring(3);
      while (remaining.length > 0) {
        parts.push(remaining.substring(0, 4));
        remaining = remaining.substring(4);
      }
    }
    return parts.join('-');
  }
  
  // USA/Canada (1): 1-xxx-xxx-xxxx
  if (country?.iso2 === 'us' || country?.iso2 === 'ca' || cleaned.startsWith('1')) {
    const number = cleaned.startsWith('1') ? cleaned.substring(1) : cleaned;
    if (number.length === 0) return '+1';
    if (number.length <= 3) return `+1-${number}`;
    if (number.length <= 6) return `+1-${number.substring(0, 3)}-${number.substring(3)}`;
    return `+1-${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6, 10)}`;
  }
  
  // Germany (49): 49-xxxx-xxxxxxx
  if (country?.iso2 === 'de' || cleaned.startsWith('49')) {
    const number = cleaned.startsWith('49') ? cleaned.substring(2) : cleaned;
    if (number.length === 0) return '+49';
    if (number.length <= 4) return `+49-${number}`;
    return `+49-${number.substring(0, 4)}-${number.substring(4)}`;
  }
  
  // Nigeria (234): 234-xxx-xxx-xxxx
  if (country?.iso2 === 'ng' || cleaned.startsWith('234')) {
    const number = cleaned.startsWith('234') ? cleaned.substring(3) : cleaned;
    if (number.length === 0) return '+234';
    if (number.length <= 3) return `+234-${number}`;
    if (number.length <= 6) return `+234-${number.substring(0, 3)}-${number.substring(3)}`;
    return `+234-${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6)}`;
  }
  
  // Brazil (55): 55-xx-xxxxx-xxxx
  if (country?.iso2 === 'br' || cleaned.startsWith('55')) {
    const number = cleaned.startsWith('55') ? cleaned.substring(2) : cleaned;
    if (number.length === 0) return '+55';
    if (number.length <= 2) return `+55-${number}`;
    if (number.length <= 7) return `+55-${number.substring(0, 2)}-${number.substring(2)}`;
    return `+55-${number.substring(0, 2)}-${number.substring(2, 7)}-${number.substring(7)}`;
  }
  
  // Australia (61): 61-xxx-xxx-xxx
  if (country?.iso2 === 'au' || cleaned.startsWith('61')) {
    const number = cleaned.startsWith('61') ? cleaned.substring(2) : cleaned;
    if (number.length === 0) return '+61';
    if (number.length <= 3) return `+61-${number}`;
    if (number.length <= 6) return `+61-${number.substring(0, 3)}-${number.substring(3)}`;
    return `+61-${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6)}`;
  }
  
  // Default: every 4 digits with dash
  const parts = [];
  let remaining = cleaned;
  while (remaining.length > 0) {
    parts.push(remaining.substring(0, 4));
    remaining = remaining.substring(4);
  }
  return parts.join('-');
};

/**
 * Format phone number for storage/export (with dashes)
 * Used when sending to Google Sheets or storing in state
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number with dashes
 */
export const formatPhoneForStorage = (phone) => {
  if (!phone) return "";
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (!cleaned) return phone;
  
  // Format based on country code patterns
  // Indonesia: 62-8xx-xxxx-xxxx
  if (cleaned.startsWith('62')) {
    const number = cleaned.substring(2);
    if (number.length >= 9) {
      const parts = [];
      parts.push('62');
      parts.push(number.substring(0, 3));
      
      let remaining = number.substring(3);
      while (remaining.length > 0) {
        parts.push(remaining.substring(0, 4));
        remaining = remaining.substring(4);
      }
      
      return parts.join('-');
    }
  }
  
  // USA/Canada: 1-xxx-xxx-xxxx
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `1-${cleaned.substring(1, 4)}-${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }
  
  // Germany: 49-xxxx-xxxxxxx
  if (cleaned.startsWith('49')) {
    const number = cleaned.substring(2);
    if (number.length >= 8) {
      return `49-${number.substring(0, 4)}-${number.substring(4)}`;
    }
  }
  
  // Nigeria: 234-xxx-xxx-xxxx
  if (cleaned.startsWith('234') && cleaned.length >= 13) {
    return `234-${cleaned.substring(3, 6)}-${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  }
  
  // Brazil: 55-xx-xxxxx-xxxx
  if (cleaned.startsWith('55')) {
    const number = cleaned.substring(2);
    if (number.length >= 10) {
      return `55-${number.substring(0, 2)}-${number.substring(2, 7)}-${number.substring(7)}`;
    }
  }
  
  // Australia: 61-xxx-xxx-xxx
  if (cleaned.startsWith('61')) {
    const number = cleaned.substring(2);
    if (number.length >= 9) {
      return `61-${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6)}`;
    }
  }
  
  // Default: format every 4 digits with dash
  const parts = [];
  let remaining = cleaned;
  while (remaining.length > 0) {
    parts.push(remaining.substring(0, 4));
    remaining = remaining.substring(4);
  }
  
  return parts.join('-');
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, '');
  
  // Must start with a digit 1-9 and have 8-15 digits total
  const phoneRegex = /^[1-9]\d{7,14}$/;
  
  return phoneRegex.test(cleaned);
};