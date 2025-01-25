import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setError(null);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      setError(error.message);
    }
  }, [key, value]);

  return [value, setValue, error];
};
