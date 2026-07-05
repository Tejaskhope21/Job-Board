export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

export const validateSalary = (value) => {
  return !isNaN(value) && value >= 0;
};

export const validateDate = (value) => {
  return !isNaN(Date.parse(value));
};

export const validateSkills = (skills) => {
  return Array.isArray(skills) && skills.every(skill => typeof skill === 'string' && skill.trim().length > 0);
};

export const validateExperience = (experience) => {
  if (!Array.isArray(experience)) return false;
  return experience.every(exp => 
    exp.title && exp.title.trim().length > 0 &&
    exp.company && exp.company.trim().length > 0
  );
};

export const validateEducation = (education) => {
  if (!Array.isArray(education)) return false;
  return education.every(edu =>
    edu.school && edu.school.trim().length > 0 &&
    edu.degree && edu.degree.trim().length > 0
  );
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
    }
    
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    }
    
    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum ${fieldRules.minLength} characters required`;
    }
    
    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Maximum ${fieldRules.maxLength} characters allowed`;
    }
    
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Invalid phone number format';
    }
    
    if (fieldRules.url && !validateUrl(value)) {
      errors[field] = 'Invalid URL format';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};