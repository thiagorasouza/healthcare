export function objectToFormData(obj: object) {
  const formData = new FormData();
  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }
    // @ts-ignore
    const value = obj[property];
    formData.append(property, value instanceof Date ? value.toISOString() : value);
  }

  return formData;
}
