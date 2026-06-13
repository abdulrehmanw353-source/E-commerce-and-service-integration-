const appendFormValues = (formData, values) => {
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

export { appendFormValues };
