import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import jsPDF from 'jspdf';
import { useDownload } from './DownloadContext';
import "./Invoice.css";
import logo from "../../../public/logo/logoforpdf.png";
import Image from 'next/image';
import dayjs from 'dayjs';

const Invoice = forwardRef(({ data }, ref) => {
    const captureRef = useRef();

    // Only use this if you are using the context for something else, otherwise this can be removed.
    const { downloadPDF } = useDownload();

    useImperativeHandle(ref, () => ({
        handleDownload: () => {
            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page
            const imgWidth = 25; // Image width in mm
            const imgHeight = 25; // Image height in mm

            // Add the logo (replace with logo file path or dataURL if needed)
            const logoPath = captureRef.current.querySelector('img').src;
            pdf.addImage(logoPath, 'PNG', 85, 5, imgWidth, imgHeight); // Centered

            // Adjust the text y-coordinate to place it below the logo
            const titleY = 40; // Y position for the title
            pdf.setFont('arial', 'bold');
            pdf.setFontSize(12);
            pdf.text('COMMISSION OF SALE STATEMENT INVOICE:', 105, titleY, { align: 'center' });

            // Draw the underline
            pdf.setTextColor(0, 0, 0);
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            const textWidth = pdf.getTextWidth('COMMISSION OF SALE STATEMENT INVOICE:');
            const textX = (210 - textWidth) / 2; // Center the underline
            pdf.line(textX, titleY + 1, textX + textWidth, titleY + 1); // Line below the title

            // Set font back to normal for the rest of the text
            pdf.setFont('arial', 'normal');
            pdf.setFontSize(10);

            // Update the Y position for the rest of the text
            const dataStartY = titleY + 10; // Start adding data below the title and underline
            pdf.setFont('arial', 'italic');
            pdf.text('Sales progression Reference: Name: Jeanie- Medlock Law Society, Manchester', 105, dataStartY, { align: 'center' });

            // Set font for labels and values
            let labelStartY = dataStartY + 10; // Start position for labels

            pdf.setFont('arial', 'bold');
            pdf.text('Sale Date: ', 20, labelStartY); // Bold label
            pdf.setFont('arial', 'normal');
            pdf.text(formatDate(data?.inv_sale_date), 21 + pdf.getTextWidth('Sale Date: '), labelStartY);

            pdf.setFont('arial', 'bold');
            pdf.text('Seller/Developer Name: ', 20, labelStartY + 10);
            pdf.setFont('arial', 'normal');
            const space = 2; // Small space for better layout
            pdf.text(data?.inv_seller_developer_name || '', 20 + pdf.getTextWidth('Seller/Developer Name: ') + space, labelStartY + 10);

            // Set the font for the label
            pdf.setFont('arial', 'bold');
            pdf.text('Property Address: ', 20, labelStartY + 20);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_property_address || '', 20 + pdf.getTextWidth('Property Address: ') + space, labelStartY + 20);

            // Apartment Type
            pdf.setFont('arial', 'bold');
            pdf.text('Apartment Type: ', 20, labelStartY + 30);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_apartment_type || '', 20 + pdf.getTextWidth('Apartment Type: ') + space, labelStartY + 30);

            // Buyer Name
            pdf.setFont('arial', 'bold');
            pdf.text('Buyers Name: ', 20, labelStartY + 40);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_buyer_name || '', 19 + pdf.getTextWidth('Buyers Name: ') + space, labelStartY + 40);

            // Selling Company
            pdf.setFont('arial', 'bold');
            pdf.text('Selling Real Estate Company: ', 20, labelStartY + 50);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_selling_real_estate_company_name || '', 21 + pdf.getTextWidth('Selling Real Estate Company: ') + space, labelStartY + 50);

            // Selling Agent Name
            pdf.setFont('arial', 'bold');
            pdf.text('Selling Agent Name: ', 20, labelStartY + 60);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_selling_agent_name || '', 20 + pdf.getTextWidth('Selling Agent Name: ') + space, labelStartY + 60);


            // Line break separator
            pdf.setLineWidth(0.5);
            pdf.line(20, labelStartY + 70, 190, labelStartY + 70);

            // Price section
            // Total Purchase Price
            pdf.setFont('arial', 'bold');
            pdf.text('Total Purchase Price: ', 20, labelStartY + 80);
            pdf.setFont('arial', 'normal');
            pdf.text(String(`${data?.inv_selling_brokerage_currency} ${data?.inv_total_purchase_price}` || ''), 21 + pdf.getTextWidth('Total Purchase Price: ') + space, labelStartY + 80);

            // Commission (%)
            pdf.setFont('arial', 'bold');
            pdf.text('Commission (%): ', 20, labelStartY + 90); // Adding label
            pdf.setFont('arial', 'normal');
            pdf.text(String(`${data?.inv_commission}` || ''), 20 + pdf.getTextWidth('Commission (%): ') + space, labelStartY + 90); // Adding placeholder text

            // Selling Brokerage Commission
            pdf.setFont('arial', 'bold');
            pdf.text('Selling brokerage commission on the total sale price: ', 20, labelStartY + 100);
            pdf.setFont('arial', 'normal');
            pdf.text(String(`${data?.inv_selling_brokerage_currency} ${data?.inv_selling_brokerage_commission}` || ''), 23 + pdf.getTextWidth('Selling brokerage commission on the total sale price: ') + space, labelStartY + 100);

            labelStartY = dataStartY + 15;
            // Another line break separator
            pdf.line(20, labelStartY + 100, 190, labelStartY + 100);

            // Notes section
            // Notes at the Closing stage
            pdf.setFont('arial', 'bold');
            pdf.text('Notes at the Closing stage: ', 20, labelStartY + 110); // Label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_closing_note || ''), 23 + pdf.getTextWidth('Notes at the Closing stage: '), labelStartY + 110); // Value

            // Prepared by
            pdf.text('Prepared by: ', 20, labelStartY + 120); // Label
            pdf.setFont('arial', 'bold');
            const preparedByValue = String(data?.inv_prepared_by || '');
            const preparedByX = 19 + pdf.getTextWidth('Prepared by: '); // Calculate the X position for the value
            pdf.text(preparedByValue, preparedByX, labelStartY + 120); // Value

            // Underline the prepared by value
            const underlineY = labelStartY + 120 + 1; // Y position for the underline (adjust for space)
            pdf.setDrawColor(0, 0, 0); // Set color to black
            pdf.line(preparedByX, underlineY, preparedByX + pdf.getTextWidth(preparedByValue), underlineY); // Draw the underline



            // Contact Information
            // Name
            pdf.setFont('arial', 'bold');
            pdf.text('Name: ', 20, labelStartY + 130); // Name label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_name || ''), 20 + pdf.getTextWidth('Name: '), labelStartY + 130); // Name value

            // Company Name
            pdf.setFont('arial', 'bold');
            pdf.text('Company Name: ', 140, labelStartY + 130); // Company Name label (adjusted to start at 140)
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_company_name || ''), 141 + pdf.getTextWidth('Company Name: '), labelStartY + 130); // Company Name value

            // Phone
            pdf.setFont('arial', 'bold');
            pdf.text('Phone: ', 20, labelStartY + 140); // Phone label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_phone || ''), 20 + pdf.getTextWidth('Phone: '), labelStartY + 140); // Phone value

            // Email
            pdf.setFont('arial', 'bold');
            pdf.text('Email: ', 140, labelStartY + 140); // Email label (adjusted to start at 140)
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_email || ''), 140 + pdf.getTextWidth('Email: '), labelStartY + 140); // Email value

            pdf.setFont('arial', 'bold');
            pdf.text('Address: ', 20, labelStartY + 150);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_address || ''), 21 + pdf.getTextWidth('Address: '), labelStartY + 150);

            // Bank details
            pdf.text('Bank Details:', 20, labelStartY + 160);
            // Bank Details
            pdf.setFont('arial', 'bold');
            pdf.text('Bank Name: ', 20, labelStartY + 170); // Bank Name label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_name || ''), 21 + pdf.getTextWidth('Bank Name: '), labelStartY + 170); // Bank Name value

            pdf.setFont('arial', 'bold');
            pdf.text('Account Name: ', 20, labelStartY + 180); // Account Name label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_account_name || ''), 22 + pdf.getTextWidth('Account Name: '), labelStartY + 180); // Account Name value

            pdf.setFont('arial', 'bold');
            pdf.text('Account No: ', 20, labelStartY + 190); // Account No label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_account_number || ''), 22 + pdf.getTextWidth('Account No: '), labelStartY + 190); // Account No value

            pdf.setFont('arial', 'bold');
            pdf.text('Sort Code: ', 20, labelStartY + 200); // Sort Code label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_sort_code || ''), 21 + pdf.getTextWidth('Sort Code: '), labelStartY + 200); // Sort Code value

            pdf.setFont('arial', 'bold');
            pdf.text('Reference: ', 20, labelStartY + 209); // Sort Code label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_reference || ''), 21 + pdf.getTextWidth('Sort Code: '), labelStartY + 209); // Sort Code value
            // Footer message
            pdf.setFontSize(8);

            pdf.text('Please pay the above invoice within 7 working business days from exchange. Thank you', 105, labelStartY + 220, { align: 'center' });

            // Save the PDF
            pdf.save('Invoice.pdf');
        },
    }));

    const formatDate = (date) => {
        const parsedDate = dayjs(date);
        return parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : date;
    };

    return (
        <div ref={captureRef} style={{ display: 'none' }}>
            <Image src={logo} alt="logo" width={100} height={50} />
        </div>
    );
});

export default Invoice;
