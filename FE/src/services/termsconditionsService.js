import apiClient from "./apiClient";

// GET /terms-conditions — all versions sorted by version desc
export const getTermsConditions = async () => {
  const response = await apiClient.get("/terms-conditions");
  return response.data;
};

// GET /terms-conditions/active — current (latest) version
export const getActiveTermsCondition = async () => {
  const response = await apiClient.get("/terms-conditions/active");
  return response.data;
};

// POST /terms-conditions  { content, effectiveDate }  — version auto-incremented by backend
export const createTermsCondition = async (payload) => {
  const response = await apiClient.post("/terms-conditions", payload);
  return response.data;
};