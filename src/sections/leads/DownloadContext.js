import React, { createContext, useContext, useRef, useMemo } from 'react';

const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
    const invoiceRef = useRef();

    const downloadPDF = () => {
        if (invoiceRef.current) {
            invoiceRef.current.handleDownload();
        }
    };

    // Wrap the value object in useMemo to prevent it from changing on every render
    const contextValue = useMemo(() => ({ downloadPDF, invoiceRef }), [invoiceRef]);

    return (
        <DownloadContext.Provider value={contextValue}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => useContext(DownloadContext);
