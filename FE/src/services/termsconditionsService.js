import apiClient from "./apiClient";

// GET /terms-conditions — all versions
export const getTermsConditions = async () => {
  const response = await apiClient.get("/terms-conditions");
  return response.data;
};

// GET /terms-conditions/current — current (latest) version
// Note: BE only has /current, NOT /active
export const getCurrentTermsCondition = async () => {
  const response = await apiClient.get("/terms-conditions/current");
  return response.data;
};

// GET /terms-conditions/:id
export const getTermsConditionById = async (id) => {
  const response = await apiClient.get(`/terms-conditions/${id}`);
  return response.data;
};

// POST /terms-conditions  { content, effectiveDate }
export const createTermsCondition = async (payload) => {
  const response = await apiClient.post("/terms-conditions", payload);
  return response.data;
};