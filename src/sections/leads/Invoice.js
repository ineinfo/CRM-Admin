import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useDownload } from './DownloadContext';
import "./Invoice.css";
import logo from "../../../public/logo/logoforpdf.png";

const Invoice = forwardRef(({ data }, ref) => {
    const captureRef = useRef();

    const { downloadPDF } = useDownload();

    useImperativeHandle(ref, () => ({
        handleDownload: () => {
            const pdf = new JsPDF('p', 'mm', 'a4');
            const imgWidth = 25;
            const imgHeight = 25;

            const logoPath = captureRef.current.querySelector('img').src;
            pdf.addImage(logoPath, 'PNG', 85, 5, imgWidth, imgHeight); // Centered

            const titleY = 40;
            pdf.setFont('arial', 'bold');
            pdf.setFontSize(12);
            pdf.text('COMMISSION OF SALE STATEMENT INVOICE:', 105, titleY, { align: 'center' });

            pdf.setTextColor(0, 0, 0);
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            const textWidth = pdf.getTextWidth('COMMISSION OF SALE STATEMENT INVOICE:');
            const textX = (210 - textWidth) / 2;
            pdf.line(textX, titleY + 1, textX + textWidth, titleY + 1);

            pdf.setFont('arial', 'normal');
            pdf.setFontSize(10);


            const dataStartY = titleY + 10;
            pdf.setFont('arial', 'italic');
            pdf.text('Sales progression Reference: Name: Jeanie- Medlock Law Society, Manchester', 105, dataStartY, { align: 'center' });


            let labelStartY = dataStartY + 10;

            pdf.setFont('arial', 'bold');
            pdf.text('Sale Date: ', 20, labelStartY);
            pdf.setFont('arial', 'normal');
            pdf.text(formatDate(data?.inv_sale_date), 21 + pdf.getTextWidth('Sale Date: '), labelStartY);

            pdf.setFont('arial', 'bold');
            pdf.text('Seller/Developer Name: ', 20, labelStartY + 10);
            pdf.setFont('arial', 'normal');
            const space = 2;
            pdf.text(data?.inv_seller_developer_name || '', 20 + pdf.getTextWidth('Seller/Developer Name: ') + space, labelStartY + 10);


            pdf.setFont('arial', 'bold');
            pdf.text('Property Address: ', 20, labelStartY + 20);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_property_address || '', 20 + pdf.getTextWidth('Property Address: ') + space, labelStartY + 20);


            pdf.setFont('arial', 'bold');
            pdf.text('Apartment Type: ', 20, labelStartY + 30);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_apartment_type || '', 20 + pdf.getTextWidth('Apartment Type: ') + space, labelStartY + 30);

            pdf.setFont('arial', 'bold');
            pdf.text('Buyers Name: ', 20, labelStartY + 40);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_buyer_name || '', 19 + pdf.getTextWidth('Buyers Name: ') + space, labelStartY + 40);


            pdf.setFont('arial', 'bold');
            pdf.text('Selling Real Estate Company: ', 20, labelStartY + 50);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_selling_real_estate_company_name || '', 21 + pdf.getTextWidth('Selling Real Estate Company: ') + space, labelStartY + 50);


            pdf.setFont('arial', 'bold');
            pdf.text('Selling Agent Name: ', 20, labelStartY + 60);
            pdf.setFont('arial', 'normal');
            pdf.text(data?.inv_selling_agent_name || '', 20 + pdf.getTextWidth('Selling Agent Name: ') + space, labelStartY + 60);


            pdf.setLineWidth(0.5);
            pdf.line(20, labelStartY + 70, 190, labelStartY + 70);


            pdf.setFont('arial', 'bold');
            pdf.text('Total Purchase Price: ', 20, labelStartY + 80);
            pdf.setFont('arial', 'normal');
            pdf.text(String(`${data?.inv_selling_brokerage_currency} ${data?.inv_total_purchase_price}` || ''), 21 + pdf.getTextWidth('Total Purchase Price: ') + space, labelStartY + 80);


            pdf.setFont('arial', 'bold');
            pdf.text('Commission (%): ', 20, labelStartY + 90); // Adding label
            pdf.setFont('arial', 'normal');
            pdf.text(String(`${data?.inv_commission}` || ''), 20 + pdf.getTextWidth('Commission (%): ') + space, labelStartY + 90); // Adding placeholder text


            pdf.setFont('arial', 'bold');
            pdf.text('Selling brokerage commission on the total sale price: ', 20, labelStartY + 100);
            pdf.setFont('arial', 'normal');
            pdf.text(String(`${data?.inv_selling_brokerage_currency} ${data?.inv_selling_brokerage_commission}` || ''), 23 + pdf.getTextWidth('Selling brokerage commission on the total sale price: ') + space, labelStartY + 100);

            labelStartY = dataStartY + 15;

            pdf.line(20, labelStartY + 100, 190, labelStartY + 100);


            pdf.setFont('arial', 'bold');
            pdf.text('Notes at the Closing stage: ', 20, labelStartY + 110); // Label
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_closing_note || ''), 23 + pdf.getTextWidth('Notes at the Closing stage: '), labelStartY + 110); // Value


            pdf.text('Prepared by: ', 20, labelStartY + 120); // Label
            pdf.setFont('arial', 'bold');
            const preparedByValue = String(data?.inv_prepared_by || '');
            const preparedByX = 19 + pdf.getTextWidth('Prepared by: '); // Calculate the X position for the value
            pdf.text(preparedByValue, preparedByX, labelStartY + 120); // Value


            const underlineY = labelStartY + 120 + 1;
            pdf.setDrawColor(0, 0, 0);
            pdf.line(preparedByX, underlineY, preparedByX + pdf.getTextWidth(preparedByValue), underlineY); // Draw the underline



            pdf.setFont('arial', 'bold');
            pdf.text('Name: ', 20, labelStartY + 130);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_name || ''), 20 + pdf.getTextWidth('Name: '), labelStartY + 130); // Name value


            pdf.setFont('arial', 'bold');
            pdf.text('Company Name: ', 140, labelStartY + 130);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_company_name || ''), 141 + pdf.getTextWidth('Company Name: '), labelStartY + 130);


            pdf.setFont('arial', 'bold');
            pdf.text('Phone: ', 20, labelStartY + 140);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_phone || ''), 20 + pdf.getTextWidth('Phone: '), labelStartY + 140);


            pdf.setFont('arial', 'bold');
            pdf.text('Email: ', 140, labelStartY + 140);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_email || ''), 140 + pdf.getTextWidth('Email: '), labelStartY + 140);

            pdf.setFont('arial', 'bold');
            pdf.text('Address: ', 20, labelStartY + 150);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_address || ''), 21 + pdf.getTextWidth('Address: '), labelStartY + 150);

            pdf.text('Bank Details:', 20, labelStartY + 160);

            pdf.setFont('arial', 'bold');
            pdf.text('Bank Name: ', 20, labelStartY + 170);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_name || ''), 21 + pdf.getTextWidth('Bank Name: '), labelStartY + 170); // Bank Name value

            pdf.setFont('arial', 'bold');
            pdf.text('Account Name: ', 20, labelStartY + 180);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_account_name || ''), 22 + pdf.getTextWidth('Account Name: '), labelStartY + 180); // Account Name value

            pdf.setFont('arial', 'bold');
            pdf.text('Account No: ', 20, labelStartY + 190);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_account_number || ''), 22 + pdf.getTextWidth('Account No: '), labelStartY + 190); // Account No value

            pdf.setFont('arial', 'bold');
            pdf.text('Sort Code: ', 20, labelStartY + 200);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_sort_code || ''), 21 + pdf.getTextWidth('Sort Code: '), labelStartY + 200); // Sort Code value

            pdf.setFont('arial', 'bold');
            pdf.text('Reference: ', 20, labelStartY + 209);
            pdf.setFont('arial', 'normal');
            pdf.text(String(data?.inv_bank_reference || ''), 21 + pdf.getTextWidth('Sort Code: '), labelStartY + 209); // Sort Code value

            pdf.setFontSize(8);

            pdf.text('Please pay the above invoice within 7 working business days from exchange. Thank you', 105, labelStartY + 220, { align: 'center' });


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
Invoice.displayName = "Invoice";
export default Invoice;






