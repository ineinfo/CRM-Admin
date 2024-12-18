"use client";

import React, { useState } from "react";
import "../template.css"
import { jsPDF } from "jspdf";
import f1 from "../../../../public/assets/images/menu/f1.jpg";
import f2 from "../../../../public/assets/images/menu/f2.jpg";
import f3 from "../../../../public/assets/images/menu/f3.jpg";
import f4 from "../../../../public/assets/images/menu/f4.jpg";
import f5 from "../../../../public/assets/images/menu/top1.jpg";


const Template1 = () => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGeneratePdf = () => {
        setIsLoading(true);
        const pdf = new jsPDF("p", "mm", "a4");

        // PDF Page Dimensions (No Margin)
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // 1. Add Images (No Space Between Rows)
        const images = [f1, f2, f3, f4, f5];
        const imgHeight = 110; // Height to fit without gaps
        const imgHeight2 = 90;
        const imgWidth = pageWidth / 2; // Two images in a row

        // First Row: 2 Images
        pdf.addImage(images[0].src, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.addImage(images[1].src, "JPEG", imgWidth, 0, imgWidth, imgHeight);

        // Second Row: 3 Images
        const secondRowY = imgHeight;
        const secondRowImgWidth = pageWidth / 3;
        for (let i = 2; i < 5; i++) {
            const x = (i - 2) * secondRowImgWidth;
            pdf.addImage(images[i].src, "JPEG", x, secondRowY, secondRowImgWidth, imgHeight2);
        }

        // 2. Add Text Section (Box and Inner Border)
        const textSectionY = secondRowY + imgHeight2;
        const textBoxHeight = 98;
        const textBoxPadding = 5;
        const innerPadding = 15;

        pdf.setFillColor(247, 220, 143);
        pdf.roundedRect(
            0,
            textSectionY,
            pageWidth,
            textBoxHeight,
            1,
            1,
            "F"
        );


        pdf.setLineWidth(2.5);
        pdf.setDrawColor(0, 0, 0);
        pdf.roundedRect(
            textBoxPadding,
            textSectionY + textBoxPadding,
            pageWidth - 2 * textBoxPadding,
            textBoxHeight - 2 * textBoxPadding,
            8,
            8,
            "S"
        );


        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        const titleX = pageWidth / 2;
        const titleY = textSectionY + textBoxPadding + innerPadding;
        pdf.text("Key Features:", titleX, titleY, { align: "center" });

        // Add Underline Below the Title
        const titleWidth = pdf.getTextWidth("Key Features:"); // Width of the title text
        const lineY = titleY + 2; // Position the line slightly below the text
        pdf.setLineWidth(0.5); // Line thickness
        pdf.line(titleX - titleWidth / 2, lineY, titleX + titleWidth / 2, lineY);

        const leftTextY = textSectionY + textBoxPadding + innerPadding + 10;
        const leftTextX = textBoxPadding + innerPadding;
        pdf.setFontSize(14);
        const leftTexts = [
            "- Distraction-free reading. No ads.",
            "- Organize your knowledge with lists.",
            "- Easy-to-use tools.",
            "- Easy-to-use tools.",
            "- Easy-to-use tools.",

        ];
        leftTexts.forEach((text, index) => {
            pdf.text(text, leftTextX, leftTextY + index * 10);
        });

        // Right Column Text
        const rightTextX = pageWidth / 2 + innerPadding; // Centered alignment
        const rightTexts = [
            "- Fast and reliable support.",
            "- Comprehensive features.",
            "- Accessible anywhere.",
            "- Comprehensive features.",
            "- Accessible anywhere.",
        ];
        rightTexts.forEach((text, index) => {
            pdf.text(text, rightTextX, leftTextY + index * 10);
        });

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsLoading(false);
        setIsModalOpen(true);
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = "template.pdf";
            link.click();
        }
    };

    return (
        <div className="template1-container">
            <button className="generate-btn" onClick={handleGeneratePdf}>
                Preview Template 1
            </button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>PDF Preview</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                pdfUrl && <iframe src={pdfUrl} className="pdf-preview" title="PDF Preview"></iframe>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="download-btn" onClick={handleDownload}>
                                Download PDF
                            </button>
                            <button className="close-btn-secondary" onClick={() => setIsModalOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Template1;
