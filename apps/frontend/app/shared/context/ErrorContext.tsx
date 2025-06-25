// ErrorContext.tsx
import { createContext, useContext, useState } from "react";

const ErrorContext = createContext<{
  errors: string[];
  pushError: (msg: string) => void;
}>({ errors: [], pushError: () => {} });

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const pushError = (msg: string) => {
    const id = Date.now();
    const entry = `${id}|${msg}`;
    setErrors((prev) => [...prev, entry]);

    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e !== entry));
    }, 5000);
  };

  return (
    <ErrorContext.Provider
      value={{
        errors: errors.map((e) => e.split("|")[1]),
        pushError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorHandler = () => useContext(ErrorContext);
