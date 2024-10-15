import React, { createContext, useContext, useRef } from 'react';

const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
    const invoiceRef = useRef();

    const downloadPDF = () => {
        if (invoiceRef.current) {
            invoiceRef.current.handleDownload();
        }
    };

    return (
        <DownloadContext.Provider value={{ downloadPDF, invoiceRef }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => useContext(DownloadContext);
