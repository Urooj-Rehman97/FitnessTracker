const AI_CACHE_KEY = "fittrack_ai_calorie_data";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const getCachedAIData = () => {
  const cached = localStorage.getItem(AI_CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(AI_CACHE_KEY);
    return null;
  }

  return data;
};

export const setCachedAIData = (data) => {
  localStorage.setItem(AI_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
};

export const clearAIDataCache = () => {
  localStorage.removeItem(AI_CACHE_KEY);
};