import { createContext, useContext, useState } from "react";

const PageLoadingContext = createContext();

export default function PageLoadingContextProvider({ children }) {
  const [pageLoading, setPageLoading] = useState(false);

  return (
    <PageLoadingContext.Provider
      value={{
        pageLoading,
        setPageLoading,
      }}
    >
      {children}
    </PageLoadingContext.Provider>
  );
}

export function PageLoading() {
  return useContext(PageLoadingContext);
}
