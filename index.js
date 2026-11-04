function checkType(value, type) {
  if (type.endsWith("?")) {
    return (
      value === undefined ||
      value === null ||
      checkType(value, type.slice(0, -1))
    );
  }

  if (type.endsWith("[]")) {
    if (!Array.isArray(value)) {
      return false;
    }

    // Preserve the initial length while checking holes and indexed values.
    const { length } = value;
    for (let index = 0; index < length; index += 1) {
      if (!checkType(value[index], type.slice(0, -2))) {
        return false;
      }
    }
    return true;
  }

  if (type === "array") {
    return Array.isArray(value);
  }

  if (type === "object") {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  return typeof value === type;
}

export default function schemaGuard(schema) {
  const entries = Object.entries(schema);

  return (value) => {
    if (
      value === null ||
      value === undefined ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return false;
    }

    for (const [key, type] of entries) {
      if (!checkType(value[key], type)) {
        return false;
      }
    }

    return true;
  };
}
