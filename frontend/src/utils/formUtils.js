// Form utility functions for controlled components

/**
 * Ensures all form fields have proper initial values to prevent
 * "uncontrolled to controlled" React warnings
 */
export const createFormInitialState = (fields) => {
  const initialState = {};
  
  fields.forEach(field => {
    if (field.type === 'checkbox') {
      initialState[field.name] = field.defaultValue || false;
    } else if (field.type === 'number') {
      initialState[field.name] = field.defaultValue || 0;
    } else {
      initialState[field.name] = field.defaultValue || '';
    }
  });
  
  return initialState;
};

/**
 * Handles input changes for both text inputs and checkboxes
 */
export const handleFormInputChange = (setFormData, setErrors) => (e) => {
  const { name, value, type, checked } = e.target;
  
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
  
  // Clear error when user starts typing
  if (setErrors) {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validates password strength
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = false
  } = options;
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }
  
  if (requireUppercase && !/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumber && !/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChar && !/(?=.*[!@#$%^&*])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Clears all form errors
 */
export const clearFormErrors = (setErrors) => {
  setErrors({});
};

/**
 * Sets a specific form error
 */
export const setFormError = (setErrors, fieldName, message) => {
  setErrors(prev => ({
    ...prev,
    [fieldName]: message
  }));
};
