"use client";

import React, { useState } from "react";
import "../template.css"
import { jsPDF } from "jspdf";
import f1 from "../../../../public/assets/images/menu/f1.jpg";
import f2 from "../../../../public/assets/images/menu/f2.jpg";
import f3 from "../../../../public/assets/images/menu/f3.jpg";
import f4 from "../../../../public/assets/images/menu/f4.jpg";
import f5 from "../../../../public/assets/images/menu/top1.jpg";
import map1 from "../../../../public/assets/images/menu/map1.jpg"
import map2 from "../../../../public/assets/images/menu/map2.png"


const Template2 = ({ onClose }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleGeneratePdf = () => {
        setIsModalOpen(true);
        setLoading(true);
        setTimeout(() => {
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();

            pdf.setFontSize(22);
            pdf.setFont("helvetica", "bold");
            const title =
                "HANDING OVER SOON : RARE NEWBUILDS CLOSE TO MANCHESTER CITY CENTRE";
            const wrappedTitle = pdf.splitTextToSize(title, pageWidth - 20);

            wrappedTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.text(line, x, 10 + index * 10);
            });

            pdf.addImage(f1.src, "JPEG", 10, 30, 125, 85);

            const imageHeight1 = 90;

            const textY1 = 30 + imageHeight1 + 10;

            pdf.setFontSize(18);
            pdf.setTextColor(245, 176, 65); // Color for the text
            pdf.setFont("helvetica", "bold");

            // Add the first part of the subText
            const leftOffset1 = 28;
            const subText1 = "YOUR DREAM HOME AT\nCASTLE IRWELL-SALFORD:";

            // Add the vertical line before the first subtext
            const lineHeight = 30; // Height of the vertical line
            const lineX = leftOffset1 - 17; // Position of the line (slightly to the left of the subtext)
            const lineStartY = textY1 - 10; // Starting point of the vertical line (slightly above the first subtext)
            const lineEndY = textY1 + lineHeight - 20; // Ending point of the vertical line (below the first subtext)

            pdf.setLineWidth(1.5); // Set the thickness of the line
            pdf.setDrawColor(0, 0, 0); // Color for the line (black)
            pdf.line(lineX, lineStartY, lineX, lineEndY); // Draw the vertical line

            // Add the text
            pdf.text(
                subText1.split("\n")[0],
                (pageWidth - pdf.getTextWidth(subText1.split("\n")[0])) / 2 - leftOffset1,
                textY1
            );
            pdf.text(
                subText1.split("\n")[1],
                (pageWidth - pdf.getTextWidth(subText1.split("\n")[1])) / 2 - leftOffset1,
                textY1 + 7
            );

            const textY2 = textY1 + 25;

            const subText2 = "FREEHOLD TOWNHOUSES\nWITH PARKING SPACE:";
            pdf.text(
                subText2.split("\n")[0],
                (pageWidth - pdf.getTextWidth(subText2.split("\n")[0])) / 2 - leftOffset1,
                textY2
            );
            pdf.text(
                subText2.split("\n")[1],
                (pageWidth - pdf.getTextWidth(subText2.split("\n")[1])) / 2 - leftOffset1,
                textY2 + 7
            );

            // Adjust the Y position for the third text
            const textY3 = textY2 + 25;
            const subText3 = "SECURE WITH A\n10% DEPOSIT";

            pdf.text(
                subText3.split("\n")[0],
                (pageWidth - pdf.getTextWidth(subText3.split("\n")[0])) / 2 - leftOffset1,
                textY3
            );
            pdf.text(
                subText3.split("\n")[1],
                (pageWidth - pdf.getTextWidth(subText3.split("\n")[1])) / 2 - leftOffset1,
                textY3 + 7
            );

            // Now, add the vertical line to the right side of the second line of subText2
            const lineRightX = (pageWidth - pdf.getTextWidth(subText2.split("\n")[1])) / 2 + leftOffset1 + 35; // Position of the line on the right of the second line
            const lineStartYRight = textY2 + 5; // Starting point of the vertical line at the second line's end
            const lineEndYRight = textY3; // Ending point of the vertical line at the start of the third text

            // Draw the vertical line
            pdf.line(lineRightX, lineStartYRight, lineRightX, lineEndYRight);


            const secondImageX = 140;
            const imageWidth = 60;
            const imageHeight = 80;
            const image2Height = 75;
            const imageSpacing = 10;

            pdf.addImage(f2.src, "JPEG", secondImageX, 30, imageWidth, image2Height);
            pdf.addImage(
                f3.src,
                "JPEG",
                secondImageX,
                20 + imageHeight + imageSpacing,
                imageWidth,
                imageHeight
            );

            const leftOffset = 10;
            const rightOffset = 10;
            const pageWidth4 = pdf.internal.pageSize.width;

            const imageWidth4 = 190;
            const imageHeight4 = 90;

            const adjustedLeftOffset = pageWidth4 - rightOffset - imageWidth4;

            pdf.addImage(f2.src, "JPEG", leftOffset, 200, imageWidth4, imageHeight4);

            pdf.addPage();

            pdf.setTextColor(243, 156, 18);

            pdf.setFontSize(22);

            const newTitle =
                "TOP BRANDED 5 STAR DEVELOPER IN MANCHESTER AND CLOSE TO HANDOVER";
            const wrappedNewTitle = pdf.splitTextToSize(newTitle, pageWidth - 20);

            const topSpace1 = 10;

            wrappedNewTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.setFont("helvetica", "bold");
                pdf.text(line, x, topSpace1 + 5 + index * 10);
            });

            pdf.setTextColor(0, 0, 0);

            const topSpace = 15;

            pdf.setFontSize(16);
            pdf.setFont("helvetica", "bold");
            const primeLocationTitle = "Prime Location Advantages:";
            const wrappedPrimeLocationTitle = pdf.splitTextToSize(
                primeLocationTitle,
                pageWidth - 20
            );

            wrappedPrimeLocationTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.text(
                    line,
                    x,
                    5 + wrappedNewTitle.length * 10 + topSpace + index * 10
                );
            });

            // Add bullet points below the title
            pdf.setFont("helvetica", "normal");
            const bulletPoints = [
                "15-minutes to the city centre by car or cycle",
                "15-minutes cycle to Media City",
                "25-minutes by bus to the city centre",
            ];

            let bulletY = 30 + wrappedPrimeLocationTitle.length * 10 + topSpace;

            bulletPoints.forEach((point, index) => {
                const x = 15;
                const y = bulletY + index * 10;
                pdf.text("• " + point, x, y);
            });

            const exclusiveFeaturesTitle = "Exclusive Features:";
            const wrappedExclusiveFeaturesTitle = pdf.splitTextToSize(
                exclusiveFeaturesTitle,
                pageWidth - 20
            );

            const exclusiveFeaturesTopSpace = 10;

            wrappedExclusiveFeaturesTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.setFont("helvetica", "bold");
                pdf.text(line, x, bulletY + 20 + exclusiveFeaturesTopSpace + index * 10);
            });

            // Add bullet points for the "Exclusive Features"
            pdf.setFont("helvetica", "normal");
            const exclusiveBulletPoints = [
                "Enjoy a spacious public open space",
                "Benefit from secure, allocated gated parking",
                "Relax in your private rear garden",
                "Local park for children and families to relax",
                "Maintenance fee, for the car park and local community",
                "£36 per month",
            ];

            let exclusiveBulletY =
                bulletY +
                20 +
                wrappedExclusiveFeaturesTitle.length * 10 +
                exclusiveFeaturesTopSpace;

            exclusiveBulletPoints.forEach((point, index) => {
                const x = 15;
                const y = exclusiveBulletY + index * 10;
                pdf.text("• " + point, x, y);
            });

            const spaceAfterExclusive =
                exclusiveBulletY + exclusiveBulletPoints.length * 10 + 0;

            const personalizeTitle = "Personalize Your Living Space:";
            const wrappedPersonalizeTitle = pdf.splitTextToSize(
                personalizeTitle,
                pageWidth - 20
            );

            const personalizeTopSpace = 5;

            wrappedPersonalizeTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.setFont("helvetica", "bold");
                pdf.text(line, x, spaceAfterExclusive + personalizeTopSpace + index * 10);
            });

            pdf.setFont("helvetica", "normal");
            const personalizePoints = [
                "Opt for laminate flooring downstairs and carpet upstairs for £4,560",
                "Upgrade to Amtico flooring downstairs with carpet upstairs for £6,270",
            ];

            let personalizeBulletY =
                spaceAfterExclusive +
                wrappedPersonalizeTitle.length * 10 +
                personalizeTopSpace;

            personalizePoints.forEach((point, index) => {
                const x = 15;
                const y = personalizeBulletY + index * 10;
                pdf.text("• " + point, x, y);
            });

            const spaceAfterPersonalize =
                personalizeBulletY + personalizePoints.length * 10 + 0; //  extra space

            // Add "Appliance Options" section
            const applianceTitle = "Appliance Options:";
            const wrappedApplianceTitle = pdf.splitTextToSize(
                applianceTitle,
                pageWidth - 20
            );

            //  top space
            const applianceTopSpace = 5;

            wrappedApplianceTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.setFont("helvetica", "bold"); // Title in bold
                pdf.text(line, x, spaceAfterPersonalize + applianceTopSpace + index * 10);
            });

            //  bullet points"
            pdf.setFont("helvetica", "normal");
            const appliancePoints = [
                "Choose CDA Appliances for £2,850",
                "Upgrade to Neff Appliances for £4,788",
            ];

            let applianceBulletY =
                spaceAfterPersonalize +
                wrappedApplianceTitle.length * 10 +
                applianceTopSpace;

            appliancePoints.forEach((point, index) => {
                const x = 15; // Starting X position for the bullet points
                const y = applianceBulletY + index * 10;
                pdf.text("• " + point, x, y); // Add bullet and point
            });

            // Add a space after the "Appliance Options" section before "Upcoming Handovers"
            const spaceAfterAppliance =
                applianceBulletY + appliancePoints.length * 10 + 0;
            // Add "Upcoming Handovers" section
            const handoversTitle = "Upcoming Handovers:";
            const wrappedHandoversTitle = pdf.splitTextToSize(
                handoversTitle,
                pageWidth - 20
            );

            // Add top space before the "Upcoming Handovers" section
            const handoversTopSpace = 10;

            wrappedHandoversTitle.forEach((line, index) => {
                const lineWidth = pdf.getTextWidth(line);
                const x = (pageWidth - lineWidth) / 2;
                pdf.setFont("helvetica", "bold"); // Title in bold
                pdf.text(line, x, spaceAfterAppliance + handoversTopSpace + index * 10);
            });

            pdf.setFont("helvetica", "normal");
            const handoverPoints = [
                {
                    description: "2 Beds Type E: Handover on 04.09.2024,",
                    price: "£288,400",
                },
                {
                    description: "3 Beds Type B and C: Handover on 16.10.2024,",
                    price: "£348,000",
                },
                {
                    description: "4 Beds Type F: Handover on 23.10.2024,",
                    price: "£469,000",
                },
            ];

            let handoverBulletY =
                spaceAfterAppliance +
                wrappedHandoversTitle.length * 10 +
                handoversTopSpace;

            handoverPoints.forEach((point, index) => {
                const x = 15;
                const y = handoverBulletY + index * 20;

                pdf.setTextColor(0, 0, 0);
                pdf.text("• " + point.description, x, y);

                pdf.setTextColor(0, 0, 0);
                pdf.text("Price", x + 5, y + 6); // Slightly offset for the price label

                // Add the value in orange color
                pdf.setTextColor(255, 172, 28); // Golden color for the value
                pdf.text(point.price, x + 30, y + 6); // Position the price value in orange
            });

            pdf.addPage();

            const imageWidthb = 180;
            const imageHeightb = 90;
            const imageHeight3b = 80;
            const imageSpacingb = 10;
            const topOffsetb = 10;

            // Calculate the Y positions for the images, starting from top and with space between
            const firstImageYb = topOffsetb;
            const secondImageYb = firstImageYb + imageHeightb + imageSpacingb;
            const thirdImageYb = secondImageYb + imageHeightb + imageSpacingb;

            // Add the images, each occupying full width with space in between
            pdf.addImage(f1.src, "JPEG", 15, firstImageYb, imageWidthb, imageHeightb); // First Image
            pdf.addImage(f2.src, "JPEG", 15, secondImageYb, imageWidthb, imageHeightb); // Second Image
            pdf.addImage(f3.src, "JPEG", 15, thirdImageYb, imageWidthb, imageHeight3b); // Third Image

            // ==1 nad 2 img here
            pdf.addPage();

            // Define dimensions and spacing
            const imageWidth5 = 180;
            const imageHeight5 = 90;
            const secondImageWidth5 = 85;
            const secondImageHeight5 = 80;
            const topOffset5 = 10;
            const leftOffset5 = 15;
            const imageSpacing5 = 10;
            const imageHeightb5 = 90;

            // First row (1 image)
            const firstImageX5 = leftOffset5;
            const firstImageY5 = topOffset5;
            pdf.addImage(
                map1.src,
                "JPEG",
                firstImageX5,
                firstImageY5,
                imageWidth5,
                imageHeight5
            );

            const secondRowY5 = firstImageY5 + imageHeight5 + imageSpacing5;

            // Second row (2 images)
            const secondImageX5 = leftOffset5;
            const thirdImageX5 = secondImageX5 + secondImageWidth5 + imageSpacing5;
            pdf.addImage(
                f1.src,
                "JPEG",
                secondImageX5,
                secondRowY5,
                secondImageWidth5,
                secondImageHeight5
            );
            pdf.addImage(
                f3.src,
                "JPEG",
                thirdImageX5,
                secondRowY5,
                secondImageWidth5,
                secondImageHeight5
            );

            // Space after the second row before the next row
            const thirdRowY5 = secondRowY5 + secondImageHeight5 + imageSpacing5;

            // Third row (1 image)
            const fourthImageX5 = leftOffset5;
            pdf.addImage(
                f2.src,
                "JPEG",
                fourthImageX5,
                thirdRowY5,
                imageWidth5,
                imageHeightb5
            );

            pdf.addPage();

            const imageWidthb1 = 180;
            const imageHeightb1 = 95;
            const imageHeight3b1 = 80;
            const imageSpacingb1 = 5;
            const topOffsetb1 = 5;

            // Calculate the Y positions for the images, starting from top and with space between
            const firstImageYb1 = topOffsetb1;
            const secondImageYb1 = firstImageYb1 + imageHeightb1 + imageSpacingb1;
            const thirdImageYb1 = secondImageYb1 + imageHeightb1 + imageSpacingb1;

            // Add the images, each occupying full width with space in between
            pdf.addImage(
                f3.src,
                "JPEG",
                15,
                firstImageYb1,
                imageWidthb1,
                imageHeightb1
            );
            pdf.addImage(
                f2.src,
                "JPEG",
                15,
                secondImageYb1,
                imageWidthb1,
                imageHeightb1
            );
            pdf.addImage(
                f1.src,
                "JPEG",
                15,
                thirdImageYb1,
                imageWidthb1,
                imageHeight3b1
            );

            pdf.addPage();

            const imageWidthb2 = 180;
            const imageHeight2 = 95;
            const imageHeight3b2 = 90;
            const imageSpacingb2 = 5;
            const topOffsetb2 = 5;

            // Calculate the Y positions for the images, starting from top and with space between
            const firstImageYb2 = topOffsetb2;
            const secondImageYb2 = firstImageYb1 + imageHeight2 + imageSpacingb2;
            const thirdImageYb2 = secondImageYb2 + imageHeight3b2 + imageSpacingb2;

            // Add the images, each occupying full width with space in between
            pdf.addImage(f2.src, "JPEG", 15, firstImageYb2, imageWidthb2, imageHeight2);
            pdf.addImage(
                f3.src,
                "JPEG",
                15,
                secondImageYb2,
                imageWidthb1,
                imageHeightb1
            );
            pdf.addImage(
                f1.src,
                "JPEG",
                15,
                thirdImageYb2,
                imageWidthb2,
                imageHeight3b2
            );

            pdf.addPage();

            const imageWidth3 = 180;
            const imageHeightb3 = 260;
            const topOffsetb3 = 20;
            const bottomOffsetb3 = 20;
            const leftOffsetb3 = 15;
            const rightOffsetb3 = 15;

            // Calculate the position of the image with respect to the available space
            const imageXb3 = leftOffsetb3;
            const imageYb3 = topOffsetb3;

            // Add the image named "map1" with the specified width and height
            pdf.addImage(
                map1.src,
                "JPEG",
                imageXb3,
                imageYb3,
                imageWidth3,
                imageHeightb3
            );

            pdf.addPage();

            const imageWidthb4 = 210;
            const imageHeightb4 = 240;
            const topOffsetb4 = 25;
            const bottomOffset = 20;
            const leftOffsetb4 = 0;
            const rightOffsetb4 = 15;

            // Calculate the position of the image with respect to the available space
            const imageXb4 = leftOffsetb4;
            const imageYb4 = topOffsetb4;

            // Add the image named "map1" with the specified width and height
            pdf.addImage(
                map2.src,
                "JPEG",
                imageXb4,
                imageYb4,
                imageWidthb4,
                imageHeightb4
            );


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
                Preview Template 2
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
    );
};

export default Template2;
