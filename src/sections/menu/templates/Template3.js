"use client";
import React, { useEffect, useState } from "react";
import "../template.css"
import { jsPDF } from "jspdf";
import f1 from "../../../../public/assets/images/menu/f1.jpg";
import f2 from "../../../../public/assets/images/menu/f2.jpg";
import f3 from "../../../../public/assets/images/menu/f3.jpg";
import f4 from "../../../../public/assets/images/menu/f4.jpg";
import f5 from "../../../../public/assets/images/menu/top1.jpg";
import phone from "../../../../public/assets/images/menu/bg-removed-phone.png";
import male from "../../../../public/assets/images/menu/male.png";

const Template3 = ({ onClose }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleGeneratePdf = () => {
        setIsModalOpen(true);
        setLoading(true);
        setTimeout(() => {
            const pdf = new jsPDF("p", "mm", "a4");

            // Define PDF dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Set black color for the row
            pdf.setFillColor(0, 0, 0); // Set black color for the row
            pdf.rect(0, 0, pdfWidth, 20, "F"); // Draw a black rectangle (row height 20px)


            const img2 = f3.src;

            const imgWidthSide = 210;
            const imgHeightSide = 160;
            const imgHeightSide2 = 125;

            const imagesYPosition = 20; // Just below the black row (the y-position starts after the black row)

            // Add the first image on the left side
            pdf.addImage(img2, "JPEG", 0, imagesYPosition, imgWidthSide, imgHeightSide);




            // Text properties for the text on the image
            const text = "LONDON";
            const textXPosition = 165; // Adjust X position as needed6
            const textYPosition = 85; // Adjust Y position relative to the image
            const textWidth = pdf.getTextWidth(text) + 10; // Add padding to the background
            const textHeight = 10; // Height for the background rectangle

            // Draw the rounded rectangle background for the text
            pdf.setFillColor(0, 0, 0); // Black background

            // Draw rounded rectangle background (with border radius)
            pdf.roundedRect(textXPosition - 5, textYPosition - 7, textWidth, textHeight, 5, 5, "F"); // rounded corners

            // Set the text color to #FFBF00 (RGB equivalent is 255, 191, 0)
            pdf.setTextColor(255, 191, 0);

            // Add the text on top of the rounded background
            pdf.text(text, textXPosition, textYPosition);




            // Text properties for vertical arrangement
            const text1 = "dhara";
            const text2 = "dhara";
            const text3 = "dhara";

            // Positioning for the first text
            const startXPosition = 170;
            let startYPosition = 102;
            const textWidthPadding = 10;
            const textHeightPadding = 5;



            function drawTextWithRoundedBackground(text, xPosition, yPosition) {
                const textWidth = pdf.getTextWidth(text) + textWidthPadding;
                const textHeight = 10;

                pdf.setFillColor(0, 0, 0);
                pdf.roundedRect(xPosition - 5, yPosition - 7, textWidth, textHeight, 5, 5, "F");

                // Set the text color for the text
                pdf.setTextColor(255, 191, 0);  // #FFBF00
                pdf.text(text, xPosition, yPosition);

                return yPosition + textHeight + 0;
            }

            // Draw text1, text2, and text3 vertically
            startYPosition = drawTextWithRoundedBackground(text1, startXPosition, startYPosition);
            startYPosition = drawTextWithRoundedBackground(text2, startXPosition, startYPosition);
            drawTextWithRoundedBackground(text3, startXPosition, startYPosition);



            // text
            // Original text properties
            const originalText = "AVAILABLE NOW";
            const originalTextXPosition = 100;
            const originalTextYPosition = 135;
            const originalTextWidth = pdf.getTextWidth(originalText) + 10;
            const originalTextHeight = 10;

            // Draw the original black background
            pdf.setFillColor(0, 0, 0); // Black background
            pdf.rect(originalTextXPosition - 5, originalTextYPosition - 7, originalTextWidth, originalTextHeight, "F");

            // Set the text color for the original text
            pdf.setTextColor(255, 191, 0); // #FFBF00
            pdf.text(originalText, originalTextXPosition, originalTextYPosition);

            // Adjusted text properties (to the right side)
            const newText = "1.8 MILLION"; // Same or different text
            const spacing = 7; // Space between the original and new text
            const newTextXPosition = originalTextXPosition + originalTextWidth + spacing; // Adjusted X position
            const newTextYPosition = originalTextYPosition; // Same Y position as the original
            const newTextWidth = pdf.getTextWidth(newText) + 10;
            const newTextHeight = 10;

            // Draw the new black background
            pdf.setFillColor(0, 0, 0); // Black background
            pdf.rect(newTextXPosition - 5, newTextYPosition - 7, newTextWidth, newTextHeight, "F");

            // Set the text color for the new text
            pdf.setTextColor(255, 191, 0); // #FFBF00
            pdf.text(newText, newTextXPosition, newTextYPosition);


            const smallImg = f1.src;
            const smallImgWidth = 60; // Width of the small image
            const smallImgHeight = 30; // Height of the small image
            const smallImgX = (pdfWidth - smallImgWidth) / 2; // Center horizontally
            const smallImgY = imagesYPosition + (imgHeightSide - smallImgHeight) / 2 - 80;

            // Add the small image on top of the side-by-side images
            pdf.addImage(smallImg, "JPEG", smallImgX, smallImgY, smallImgWidth, smallImgHeight);

            // Images below the first set, side by side, with the right image being 7 units wider
            const img3 = f3.src; // Third image (same height as the first set)
            const img4 = f1.src; // Fourth image (same height as the first set)

            // Right image has 7 more units than left
            const img4Width = 130; // Right image width is 7 units more than left
            const img3Width = 100; // Left image has the same width as before

            const secondSetYPosition = imagesYPosition + imgHeightSide2; // Place below the first set of images

            // Add the first image of the second set (left side)
            pdf.addImage(img3, "JPEG", 0, secondSetYPosition, img3Width, imgHeightSide2);

            // Add the second image of the second set (right side)
            pdf.addImage(img4, "JPEG", img3Width, secondSetYPosition, img4Width, imgHeightSide2);


            // Add bold text "New Property" with minimal spacing
            const newPropertyY = secondSetYPosition + imgHeightSide2 + 10; // Reduced space
            pdf.setTextColor(0, 0, 0); // Set text color to black
            pdf.setFontSize(16); // Set font size for "New Property"
            pdf.setFont("helvetica", "bold"); // Set font to bold

            // Calculate dimensions for the background rectangle (after newPropertyY is defined)
            const bgX = 0; // Starting X position
            const bgY = newPropertyY - 10; // Start slightly above the "New Property" text
            const bgWidth = pdf.internal.pageSize.width; // Full width of the page
            const bgHeight = 70 + imgHeightSide2; // Adjust height to fit all elements (text + image)

            // Draw the background rectangle with the specified color
            pdf.setFillColor(216, 177, 108); // Set fill color
            pdf.rect(bgX, bgY, bgWidth, bgHeight, "F"); // Draw filled rectangle

            // Add the "New Property" text
            pdf.text("New Property", 10, newPropertyY); // Add bold text

            // Add "Now Live" with underline and URL on the same line
            const nowLiveY = newPropertyY + 8; // Minimal spacing after "New Property"
            pdf.setFont("helvetica", "normal"); // Set font to normal
            pdf.setFontSize(14); // Set font size for "Now Live"
            pdf.text("Now Live", 10, nowLiveY); // Add "Now Live" text

            // Measure text width for alignment
            const nowLiveWidth = pdf.getTextWidth("Now Live");
            const urlX = 10 + nowLiveWidth + 10; // Spacing after "Now Live"

            // Add the URL in blue on the same line
            const urlText = "https://www.google.com/"; // The URL
            pdf.setFontSize(12); // Set font size for the link text
            pdf.setTextColor(0, 0, 255); // Set link text color to blue
            pdf.text(urlText, urlX, nowLiveY); // Add URL next to "Now Live"

            // Draw underline only for "Now Live"
            const underlineStartX = 10; // Start underline from the text's X position
            const underlineEndX = underlineStartX + nowLiveWidth;
            const underlineY = nowLiveY + 2; // Slightly below the text for the underline
            pdf.setDrawColor(0, 0, 0); // Set line color to black
            pdf.line(underlineStartX, underlineY, underlineEndX, underlineY); // Draw underline

            // Add the phone image and telephone number on the right side
            const telText = "Tel:  1234 567 7890"; // The telephone text
            const telTextWidth = pdf.getTextWidth(telText); // Calculate text width
            const phoneIconWidth = 9; // Adjust this to match the width of phone.png
            const phoneIconHeight = 10; // Adjust this to match the height of phone.png

            const telX = pdf.internal.pageSize.width - telTextWidth - phoneIconWidth - 20;
            pdf.setTextColor(0, 0, 0); // Set text color to black

            // Add the phone image (replace 'phone.png' with the actual variable or path for your image source)
            pdf.addImage(phone.src, "PNG", telX, nowLiveY - phoneIconHeight / 2 - 1, phoneIconWidth, phoneIconHeight);

            // Add the telephone text next to the image
            pdf.text(telText, telX + phoneIconWidth + 2, nowLiveY);

            // Add the image (p1.src) centered between the Tel text and the URL
            const imageWidth = 50; // Adjust width as needed for your image
            const imageHeight = 40; // Adjust height as needed for your image

            // Calculate the available space between the "Tel" text and the URL
            const availableSpace = urlX - telX - telTextWidth - phoneIconWidth - 10; // 10 for some spacing

            // Position the image in the center of this space
            const imageX = telX + telTextWidth + phoneIconWidth + (availableSpace - imageWidth) / 2; // Centered X position
            const imageY = nowLiveY - 30; // Position the image vertically near the text

            // Add the image to the PDF (replace p1.src with your actual image source)
            pdf.addImage(male.src, "PNG", imageX, imageY, imageWidth, imageHeight);


            const blob = pdf.output("blob");
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setLoading(false);
        }, 3000);
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = "template.pdf";
            link.click();
            onClose()
        }
    };
    return (

        <div className="template1-container">
            <button className="generate-btn" onClick={handleGeneratePdf}>
                Preview Template 3
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
                            {loading ? (
                                <div className="loading-overlay">
                                    <div className="loading-spinner">
                                        {/* Use a spinner or a loading message */}
                                        <div className="spinner"></div>
                                        <p>Generating PDF...</p>
                                    </div>
                                </div>
                            ) : (
                                pdfUrl && <iframe src={pdfUrl} className="pdf-preview" title="PDF Preview" style={{ height: "70vh" }}></iframe>
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
        // <div className="template1-container">
        //     {loading && (
        //         <div className="loading-overlay">
        //             <div className="loading-spinner">
        //                 {/* Use a spinner or a loading message */}
        //                 <div className="spinner"></div>
        //                 <p>Generating PDF...</p>
        //             </div>
        //         </div>
        //     )}
        //     <button className="generate-btn" onClick={() => {
        //         setLoading(true)
        //         handleDownload()
        //     }} disabled={loading}>
        //         {loading ? "Wait" : "Template 3"}
        //     </button>
        // </div>
    );
};


export default Template3;
