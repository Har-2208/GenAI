// Custom React Hooks for API operations

import { useState, useEffect, useCallback } from "react";
import apiService from "../services/api";

/**
 * Hook to check backend health status
 * @param {boolean} checkOnMount - Whether to check health on component mount
 * @returns {Object} Health status and check function
 */
export const useHealthCheck = (checkOnMount = false) => {
  const [isHealthy, setIsHealthy] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    const result = await apiService.checkHealth();
    setIsHealthy(result.success);
    setLastChecked(new Date());
    setIsChecking(false);
    return result;
  }, []);

  useEffect(() => {
    if (checkOnMount) {
      checkHealth();
    }
  }, [checkOnMount, checkHealth]);

  return {
    isHealthy,
    isChecking,
    lastChecked,
    checkHealth,
  };
};

/**
 * Hook to save analysis results
 * @returns {Object} Save function and status
 */
export const useSaveResults = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [error, setError] = useState(null);

  const saveResults = useCallback(async (results) => {
    setIsSaving(true);
    setError(null);

    const result = await apiService.saveResults(results);

    if (result.success) {
      setSavedId(result.data.id);
    } else {
      setError(result.error);
    }

    setIsSaving(false);
    return result;
  }, []);

  return {
    saveResults,
    isSaving,
    savedId,
    error,
  };
};

/**
 * Hook to retrieve saved results
 * @param {string} id - Result ID to fetch
 * @returns {Object} Results data and loading state
 */
export const useGetResults = (id) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async (resultId) => {
    setIsLoading(true);
    setError(null);

    const result = await apiService.getResults(resultId);

    if (result.success) {
      setResults(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, []);

  useEffect(() => {
    if (id) {
      fetchResults(id);
    }
  }, [id, fetchResults]);

  return {
    results,
    isLoading,
    error,
    refetch: fetchResults,
  };
};

/**
 * Hook to submit feedback
 * @returns {Object} Submit function and status
 */
export const useSubmitFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = useCallback(async (feedbackData) => {
    setIsSubmitting(true);
    setError(null);

    const result = await apiService.submitFeedback(feedbackData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
    return result;
  }, []);

  const reset = useCallback(() => {
    setSubmitted(false);
    setError(null);
  }, []);

  return {
    submitFeedback,
    isSubmitting,
    submitted,
    error,
    reset,
  };
};

/**
 * Hook to track analytics events
 * @returns {Function} Track event function
 */
export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, eventData = {}) => {
    apiService.trackEvent({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return { trackEvent };
};
