const validateQuestionnairePayload = (payload) => {
  if (!payload || typeof payload !== "object") return "Invalid payload";
  if (!payload.name || typeof payload.name !== "string")
    return "Field 'name' is required";
  return null;
};

module.exports = { validateQuestionnairePayload };
