"use client";

import React, { useEffect, useState } from "react";
import "../template.css"
import { jsPDF } from "jspdf";
import f1 from "../../../../public/assets/images/menu/f1.jpg";
import f2 from "../../../../public/assets/images/menu/f2.jpg";
import f3 from "../../../../public/assets/images/menu/first.jpeg";
import top2 from "../../../../public/assets/images/menu/top2.jpg";
import restaurant from "../../../../public/assets/images/menu/restaurant.png";
import map3 from "../../../../public/assets/images/menu/mapping-removebg-preview.png";
import f4 from "../../../../public/assets/images/menu/f4.jpg";
import f5 from "../../../../public/assets/images/menu/top1.jpg";
import profile from "../../../../public/assets/images/menu/profile(GS).jpeg";
import logo1 from "../../../../public/assets/images/menu/crown.jpeg";
import phone from "../../../../public/assets/images/menu/bg-removed-phone.png";
import location from "../../../../public/assets/images/menu/location.png";
import building1 from "../../../../public/assets/images/menu/building-1.jpg";
import { UsegetAmenities } from "src/api/amenities";

const Template4 = ({ onClose, data, currency }) => {
    console.log("datatatat", data);
    const { products: amenities } = UsegetAmenities();

    const [pdfUrl, setPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const formattedAmenities = amenities
        .filter(amenity => data?.amenities?.includes(amenity.id))
        .map(amenity => ({
            label: amenity.amenity_name,
            img: restaurant.src,
        }));


    const image = `${data.files[0]}`;
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";


    function formatCurrency(value) {
        if (value === null || value === undefined) return '-';

        const num = Number(value);

        if (num >= 1e9) {
            return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'; // Billion
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; // Million
        } else {
            return num.toLocaleString('en-US'); // Add commas for thousands
        }
    }


    // Function to convert image URL to Base64
    const getBase64ImageFromUrl = async (imageUrl) => {
        try {
            const response = await fetch(proxyUrl + imageUrl, { mode: "cors" });
            console.log("res2121", response)

            if (!response.ok) {
                throw new Error('Failed to fetch the image');
            }
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Error while fetching the image: ", error);
            throw error; // rethrow the error to handle it later
        }
    }

    const addRoundedImageToPdf = async (pdf, imgSrc, x, y, width, height, radius, resolutionMultiplier = 3) => {
        const canvas = document.createElement("canvas");
        canvas.width = width * resolutionMultiplier;
        canvas.height = height * resolutionMultiplier;
        const ctx = canvas.getContext("2d");
        ctx.scale(resolutionMultiplier, resolutionMultiplier);

        // Draw rounded rectangle
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(width - radius, 0);
        ctx.quadraticCurveTo(width, 0, width, radius);
        ctx.lineTo(width, height - radius);
        ctx.quadraticCurveTo(width, height, width - radius, height);
        ctx.lineTo(radius, height);
        ctx.quadraticCurveTo(0, height, 0, height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();

        // Load and draw the image
        const img = new Image();
        img.src = imgSrc.src;
        await new Promise((resolve) => (img.onload = resolve));
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 and add to PDF
        const roundedImage = canvas.toDataURL(imgSrc, 1.0); // High-quality image
        pdf.addImage(roundedImage, "JPEG", x, y, width, height);
    };

    const handleGeneratePdf = () => {
        setIsModalOpen(true);
        setLoading(true);
        setProgress(0); // Reset progress
        // onClose()
        setTimeout(async () => {
            const customWidth = 210; // in mm
            const customHeight = 200; // in mm

            const pdf = new jsPDF("p", "mm", [customWidth, customHeight]);

            const addBorders = (pdf, pageWidth, pageHeight) => {
                const borderHeight = 20; // Reduced height of the bottom border to allow space
                const bottomBorderOffset = -12;
                const topBorderOffset = 6;
                const leftRightMargin = 5;
                const cornerRadius = 2;

                // Set the color for the borders
                pdf.setFillColor(242, 243, 245);

                // Draw the top border

                pdf.roundedRect(
                    leftRightMargin,
                    -3,
                    pageWidth - 4 * leftRightMargin,
                    borderHeight + 2,
                    cornerRadius,
                    cornerRadius,
                    "F"
                );

                // Draw the bottom border, adjusted for space above it

                pdf.roundedRect(
                    leftRightMargin,
                    pageHeight - borderHeight - bottomBorderOffset,
                    pageWidth - 4 * leftRightMargin,
                    borderHeight,
                    cornerRadius,
                    cornerRadius,
                    "F"
                );

                // Add text to the top border
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text("Franck Muller Vanguard", 10, 10);
                // pdf.text(" Vanguard", 10, 15);

                const rightXPos = pageWidth - 50;
                pdf.text(`Bedrooms: ${data?.no_of_bedrooms.toString()}`, rightXPos, 10);
                pdf.text(`${data?.range_min} sqft`, rightXPos, 15);

                // Bottom grid layout (same logic)
                const imageWidth = 10;
                const imageHeight = 10;
                const gridX = 10;
                const gridY = pageHeight - borderHeight - bottomBorderOffset + 5; // Adjusted to account for offset
                const gridSpacing = 35;

                pdf.setFontSize(10);

                pdf.addImage(logo1.src, "JPEG", gridX, gridY, imageWidth, imageHeight);
                pdf.text("Phone", gridX - 20 + gridSpacing, gridY + 3.5);
                pdf.text("0208 050 4150", gridX - 20 + gridSpacing, gridY + 8.5);
                pdf.text("email", gridX - 20 + gridSpacing * 2, gridY + 3.5);
                pdf.text("admin@sovereigninternational.uk", gridX - 20 + gridSpacing * 2, gridY + 8.5);
                pdf.addImage(
                    logo1.src,
                    "JPEG",
                    gridX + gridSpacing * 3 + 14,
                    gridY,
                    imageWidth,
                    imageHeight
                );
                pdf.text("Company Website", gridX + gridSpacing * 4 - 7, gridY + 3.5);
                pdf.text("www.sovereigninternational.uk", gridX + gridSpacing * 4 - 7, gridY + 8.5);
            };

            /// border done

            const pageWidth = customWidth;
            const pageHeight = customHeight;

            // Add the main background image
            pdf.addImage(f3.src, "JPEG", 0, 0, pageWidth, pageHeight + 10);

            const smallImageWidth = 20;
            const smallImageHeight = 20;
            const smallImageX = 20;
            const smallImageY = 20;

            // Add the small image on the top-left corner
            // pdf.addImage(
            //     logo1.src,
            //     "JPEG",
            //     smallImageX,
            //     smallImageY,
            //     smallImageWidth,
            //     smallImageHeight
            // );

            // Define position and dimensions for the second small image
            const smallImage2X = smallImageX + smallImageWidth + 80; // 10px space to the right of the first small image
            const smallImage2Y = smallImageY; // Keep the same Y position as the first image

            // Add the second small image to the right of the first one
            // pdf.addImage(
            //     logo1.src,
            //     "JPEG",
            //     smallImage2X - 7,
            //     smallImage2Y,
            //     smallImageWidth,
            //     smallImageHeight
            // );



            const displayWidth = smallImageWidth; // Displayed image width in the PDF
            const displayHeight = smallImageHeight; // Displayed image height in the PDF
            const radius = 5; // Corner radius for rounded rectangle

            // Set canvas resolution based on device pixel ratio for higher quality
            const resolutionMultiplier = 3; // Scale up for higher quality
            const canvas = document.createElement("canvas");
            canvas.width = displayWidth * resolutionMultiplier;
            canvas.height = displayHeight * resolutionMultiplier;
            const ctx = canvas.getContext("2d");
            ctx.scale(resolutionMultiplier, resolutionMultiplier);

            // Draw rounded rectangle
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(displayWidth - radius, 0);
            ctx.quadraticCurveTo(displayWidth, 0, displayWidth, radius);
            ctx.lineTo(displayWidth, displayHeight - radius);
            ctx.quadraticCurveTo(displayWidth, displayHeight, displayWidth - radius, displayHeight);
            ctx.lineTo(radius, displayHeight);
            ctx.quadraticCurveTo(0, displayHeight, 0, displayHeight - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.clip();

            // Draw the image inside the rounded rectangle
            const img = new Image();
            img.src = logo1.src; // Pass the source of the logo as a prop
            await new Promise((resolve) => (img.onload = resolve)); // Wait for the image to load
            ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

            // Convert the canvas to a high-quality base64 image
            const roundedImage = canvas.toDataURL(logo1, 1.0); // Quality factor set to 1.0

            // Add the high-quality image to the PDF
            // pdf.addImage(roundedImage, "JPEG", x, y, displayWidth, displayHeight);




            // Define starting position for text to the right of the second small image
            const textXPosition = smallImage2X + smallImageWidth - 5; // 10px space to the right of the second image
            let textYPosition = smallImage2Y + 8; // Use `let` to allow modification of textYPosition

            // Add "Gurpreet Singh"
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 255, 255); // White color
            pdf.setFontSize(16); // Font size for the name
            // pdf.text("Gurpreet Singh", textXPosition + 10, textYPosition);

            // Adjust Y position for the next line of text
            textYPosition += 5; // Add space between lines

            // Add "Personal Manager"
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(255, 255, 255); // White color
            pdf.setFontSize(12); // Font size for the title
            // pdf.text("Property Consultant", textXPosition + 10, textYPosition);

            textYPosition += 20;

            // Add background for "Contacts" section
            const bgPadding = 5; // Padding around the text
            const bgWidth = 100; // Width of the background
            const bgHeight = 50; // Approximate height for the entire section
            const bgX = textXPosition - 18; // X position for the background
            const bgY = textYPosition - 8; // Y position for the background
            pdf.setGState(new pdf.GState({ opacity: 0.7 }));

            // Draw rounded rectangle
            pdf.setFillColor(0, 0, 0, 89); // Light black background with some transparency
            // pdf.roundedRect(bgX - 8, bgY, bgWidth - 20 + 8, bgHeight + 8, 5, 5, "F");

            // Add "Contacts" label
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            // pdf.text("Contacts", textXPosition - 20, textYPosition);

            textYPosition += 10;

            // Add "Phone" label and number
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            // pdf.text("Phone", textXPosition - 20, textYPosition + 11);

            textYPosition += 5;

            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            // pdf.text("0208 050 4150", textXPosition - 20, textYPosition + 11);

            textYPosition += 10;

            // Add "Email" label and address
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            // pdf.text("Email", textXPosition - 20, textYPosition + 11);

            textYPosition += 5;

            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            // pdf.text("admin@sovereigninternational.uk", textXPosition - 20, textYPosition + 11);

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);

            const textXt = smallImageX;
            let textYt = smallImageY + smallImageHeight + 10;

            pdf.setFont("helvetica", "bold");
            // pdf.text("test", textXt, textYt);


            // pdf.text("Agency", textXt + 95, textYt + 10);
            // pdf.text("Sovereign International REAL ESTATE", textXt + 95, textYt + 15);
            pdf.setFont("helvetica", "normal");
            pdf.setGState(new pdf.GState({ opacity: 0.7 }));

            textYt += 80;

            const boxX = textXt - 5;
            const boxY = textYt;
            const boxWidtht = 130;
            const boxHeightt = 50;
            pdf.setFillColor(0, 0, 0, 89); // Light transparent black-gray color
            pdf.roundedRect(boxX + 25, boxY, boxWidtht - 5, boxHeightt + 25, 5, 5, "F");
            pdf.setGState(new pdf.GState({ opacity: 1 }));

            pdf.addImage(
                roundedImage,
                "JPEG",
                smallImage2X + 20,
                smallImage2Y + 166,
                displayWidth - 5,
                displayHeight - 5
            );
            // Add contact details inside the box
            pdf.setTextColor(255, 255, 255); // White text color
            pdf.setFontSize(10);

            pdf.text("Agency :", textXt + 55 + 25, textYt + 8);
            pdf.setFontSize(12);

            pdf.text("Sovereign International Real Estate", textXt + 25 + 25, textYt + 14);
            // Start with smaller font size for labels
            pdf.setFontSize(8);
            let boxTextYt = boxY + 10; // Start position for text inside the box

            // Phone label and number
            pdf.text("Phone :", textXt + 25 + 5, boxTextYt + 12);
            boxTextYt += 5; // Space between label and number
            pdf.setFontSize(12); // Larger font for the actual value
            pdf.text("0208 050 4150", textXt + 5 + 25, boxTextYt + 12);

            boxTextYt += 10; // Space between fields

            // Email label and email address
            pdf.setFontSize(8); // Smaller font for label
            pdf.text("Email :", textXt + 5 + 25, boxTextYt + 12);
            boxTextYt += 5; // Space between label and email address
            pdf.setFontSize(12); // Larger font for the email
            pdf.text("admin@sovereigninternational.uk", textXt + 5 + 25, boxTextYt + 12);

            boxTextYt += 10; // Space between fields

            // Website label and URL
            pdf.setFontSize(8); // Smaller font for label
            pdf.text("Website :", textXt + 5 + 25, boxTextYt + 12);
            boxTextYt += 5; // Space between label and URL
            pdf.setFontSize(12); // Larger font for the website
            pdf.text("www.sovereigninternational.uk", textXt + 5 + 25, boxTextYt + 12);

            boxTextYt += 10; // Space between fields

            // Instagram label and URL (on right side of the phone)
            const instagramLabel = "Instagram :";
            const instagramUrl = "sovereign.international";

            // Calculate the right side position for Instagram label and URL
            const instagramLabelX =
                boxX + boxWidtht - pdf.getTextWidth(instagramLabel) - 54; // Position Instagram label on the right
            const instagramUrlX =
                boxX + boxWidtht - pdf.getTextWidth(instagramLabel) - 54;// Position Instagram URL on the far right

            boxTextYt = boxY + 10; // Reset Y to align Instagram on the same line as Phone
            pdf.setFontSize(8); // Smaller font for label
            pdf.text(instagramLabel, textXt + 5 + 25, boxTextYt + 55); // Position Instagram label

            boxTextYt += 5; // Space between label and URL
            pdf.setFontSize(12); // Larger font for the Instagram URL
            const maxWidth = boxWidtht - 60; // Adjust to fit within the box
            const wrappedText1 = pdf.splitTextToSize(instagramUrl, maxWidth);
            pdf.text(wrappedText1, textXt + 5 + 25, boxTextYt + 55);

            // new page
            pdf.addPage();

            const imgWidth = 90;
            const imgHeight = 90;
            const borderRadius = 15;

            const imgX = 10;
            const imgY = 30;

            pdf.addImage(
                f1.src,
                "JPEG",
                imgX,
                imgY,
                imgWidth,
                imgHeight,
                undefined,
                undefined,
                undefined,
                "S",
                borderRadius
            );

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            const text = [
                `Bedrooms: ${data?.no_of_bedrooms.toString()}`,
                "Complex: London Gate - Franck Muller Vanguard - Apartment",
                `Starting Price: ${formatCurrency(data?.starting_price)} ${currency}`,
            ];

            const textX = 10;
            let textY = imgY + imgHeight + 10;

            text.forEach((line) => {
                pdf.text(line, textX, textY);
                textY += 10;
            });

            pdf.addPage();

            const layoutPositionX58 = 10; // Left-aligned position
            const layoutPositionY58 = 10; // Starting Y position
            const layoutSpacing58 = 45; // Space below the main heading

            // Add main heading
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0); // Black text
            pdf.text("Franck Muller Vanguard", layoutPositionX58, layoutPositionY58);

            const city = data?.city_id || data?.state_id || "Dubai Marina"
            const cleanCity = city.trim()
            const dubaiMarinaYPosition = layoutPositionY58 + 22; // Adjust spacing as needed
            pdf.setFont("helvetica", "normal"); // Normal font style
            pdf.setFontSize(12); // Slightly smaller font size
            pdf.text(cleanCity, layoutPositionX58 + 10, dubaiMarinaYPosition);

            const textWidth11 = pdf.getTextWidth(cleanCity); // Get text width
            const padding11 = 3; // Add padding around the text
            const borderX11 = layoutPositionX58 - padding11; // Start slightly left of the text
            const borderY11 = dubaiMarinaYPosition - 8; // Adjust for the font height and padding
            const borderWidth11 = textWidth11 + padding11 * 2; // Total width with padding
            const borderHeight11 = 10 + padding11; // Approximate height with padding
            const borderRadius11 = 5; // Radius for rounded corners

            pdf.setDrawColor(100, 100, 100); // Set border color (black)
            pdf.setLineWidth(0.2); // Set border thickness
            pdf.roundedRect(borderX11, borderY11, borderWidth11 + 10, borderHeight11, borderRadius11, borderRadius11);



            pdf.addImage(location.src, "PNG", 10, 27, 7, 7);
            // Add "Type of project: Apartment" next to "Dubai Marina"
            const typeOfProjectXPosition = layoutPositionX58 + pdf.getTextWidth(cleanCity) + 10; // Add some space after "Dubai Marina"
            pdf.setFont("helvetica", "bold"); // Keep normal font style
            pdf.setFontSize(12); // Same font size as "Dubai Marina"
            pdf.setTextColor(100, 100, 100); // Black text for emphasis
            pdf.text("Type of project:", typeOfProjectXPosition + 10, dubaiMarinaYPosition);
            pdf.setTextColor(0, 0, 0); // Black text for emphasis

            pdf.text(" Apartment", typeOfProjectXPosition + 31 + 10, dubaiMarinaYPosition);
            pdf.setFont("helvetica", "normal")

            const mainImageX58 = layoutPositionX58 - 5; // Slightly left from the text
            const mainImageY58 = layoutPositionY58 + layoutSpacing58; // Below the heading
            const mainImageWidth58 = 90;
            const mainImageHeight58 = 60;

            // Add main image
            pdf.addImage(
                building1.src, // Main image source
                mainImageX58,
                mainImageY58,
                mainImageWidth58 + 30,
                mainImageHeight58 + 30
            );

            const characteristicsYPosition = mainImageY58 - 5;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text("Characteristics of the project", mainImageX58 + 125, characteristicsYPosition);

            const textBlocks58 = [
                { label: "Building", value: "Franck Muller" },
                { label: data?.city_id ? "District" : "State", value: data?.city_id || data?.state_id },
                { label: "Developer", value: data?.developer_name },
                { label: "Delivery", value: "3rd quarter" },
                { label: "Wall material", value: "Monolith" },
                { label: "Facade", value: "Combined" },
                { label: "Elevator", value: "Elevator" },
                { label: "Parking", value: data?.parking },
                { label: "Country", value: data?.location },
            ];

            let currentY58 = mainImageY58 + 7; // Start below the main image
            const circleRadius58 = 4;
            const circleOffsetX58 = mainImageX58 + mainImageWidth58 + 36;

            // Define the right margin for values
            const pageWidth2 = pdf.internal.pageSize.getWidth();
            const rightMargin2 = 20; // Adjust as needed for the right alignment

            // Iterate over text blocks to render them
            textBlocks58.forEach((block) => {
                // Add circle
                pdf.setFillColor(246, 243, 243);
                pdf.circle(
                    circleOffsetX58 + circleRadius58 - 2,
                    currentY58,
                    circleRadius58,
                    "F"
                );

                // Add smaller image inside the circle
                const smallImageX58 = circleOffsetX58 + circleRadius58 - 4;
                const smallImageY58 = currentY58 - 2;
                const smallImageWidth58 = 4;
                const smallImageHeight58 = 4;

                pdf.addImage(
                    restaurant.src, // Smaller image source
                    smallImageX58,
                    smallImageY58,
                    smallImageWidth58,
                    smallImageHeight58
                );

                // Add label text next to the circle
                const labelX58 = circleOffsetX58 + circleRadius58 * 2 + 2;
                const labelY58 = currentY58 + 1;

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(7);
                pdf.setTextColor(0, 0, 0);
                pdf.text(block.label, labelX58, labelY58);

                // Calculate value position
                pdf.setFont("helvetica", "normal");
                const valueWidth = pdf.getTextWidth(block.value);
                const valueX58 = pageWidth2 - rightMargin2 - valueWidth; // Right-align the value
                const lineStartX58 = labelX58 + pdf.getTextWidth(block.label) + 2;
                const lineEndX58 = valueX58 - 3; // Adjust line to end just before the value

                // Add line between label and value
                const lineY58 = labelY58 - 0.6;
                pdf.setDrawColor(0, 0, 0);
                pdf.setLineWidth(0.06);
                pdf.line(lineStartX58, lineY58, lineEndX58, lineY58);

                // Add value text
                pdf.text(block.value, valueX58, labelY58);

                currentY58 += 10;
            });

            const updateProgress = (value) => {
                setProgress(value);
            };

            // Simulate progress updates
            for (let i = 1; i <= 100; i++) {
                await new Promise(resolve => setTimeout(resolve, 30)); // Simulate delay
                updateProgress(i);
            }

            pdf.addPage();

            // Define position for "Layout"
            const layoutXPosition = 10; // Left-aligned position
            const layoutYPosition = 40; // Starting Y position

            // Add "Layout" text
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0); // Black text
            pdf.text("Layout", layoutXPosition, layoutYPosition);

            // Define position for "Bedrooms" text
            const bedroomDetailsText = `Bedrooms: ${data?.no_of_bedrooms.toString()}   ${data?.range_min}-${data?.range_max} sqft   ${formatCurrency(data?.starting_price)} ${currency}`;
            const bedroomTextXPosition =
                pageWidth - 10 - pdf.getTextWidth(bedroomDetailsText); // Right-aligned position
            const bedroomTextYPosition = layoutYPosition; // Same Y position as "Layout"

            // Add "Bedrooms" text
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.text(bedroomDetailsText, bedroomTextXPosition, bedroomTextYPosition);

            // Add space below "Layout"
            const roundedBoxYStart = layoutYPosition + 15; // 15px below the "Layout" text

            // Define dimensions and properties for the rounded box
            const roundedBoxXPosition = layoutXPosition; // Left margin
            const roundedBoxWidth = 90; // Width of the box
            const roundedBoxHeight = 100; // Height of the box
            const roundedBoxCornerRadius = 8; // Radius for rounded corners

            // Draw a rounded border box
            pdf.setDrawColor(0, 0, 0); // Black border color
            pdf.setLineWidth(0.1); // Border thickness
            pdf.roundedRect(
                roundedBoxXPosition,
                roundedBoxYStart,
                roundedBoxWidth,
                roundedBoxHeight,
                roundedBoxCornerRadius,
                roundedBoxCornerRadius,
                "D"
            );

            // Define position and dimensions for the image inside the rounded box
            const boxImageX = roundedBoxXPosition + 10; // Padding from the left side of the box
            const boxImageY = roundedBoxYStart + 10; // Padding from the top of the box
            const boxImageWidth = 70; // Width of the image
            const boxImageHeight = 80; // Height of the image

            // Add the image inside the rounded box
            pdf.addImage(map3.src, boxImageX, boxImageY, boxImageWidth, boxImageHeight);

            // Add space to the right of the rounded box
            const rightSectionStartX = roundedBoxXPosition + roundedBoxWidth + 3; // Space to the right of the box
            let rightSectionStartY = roundedBoxYStart + 5; // Start slightly below the top of the box

            // Define the text blocks array
            const textBlocks74 = [
                { label: "Price", value: `${formatCurrency(data?.starting_price)} ${currency}` },
                { label: "S total", value: `${data?.range_max} sqft` },
                { label: "Bedrooms", value: `${data?.no_of_bedrooms.toString()}` },
                { label: "Bathrooms", value: `${data?.no_of_bathrooms.toString()}` },
                { label: "Finishing", value: `${data?.furnished}` },
                { label: "Windows", value: "Panoramic" },
                { label: "View", value: "city" },
                { label: "Balcony", value: "Open" },
                { label: "Layout model", value: "1BR" },
            ];

            const pageWidth3 = pdf.internal.pageSize.getWidth();
            const rightMargin3 = 20; // Adjust this value as needed

            // Loop through the text blocks array to add the text dynamically
            textBlocks74.forEach((block, index) => {
                // Add a smaller light blue circle as background
                pdf.setFillColor(246, 243, 243); // Light blue color (RGB)
                const circleRadius = 4; // Smaller radius
                pdf.circle(
                    rightSectionStartX + circleRadius,
                    rightSectionStartY,
                    circleRadius,
                    "F"
                );

                // Define dimensions and position for the smaller image inside the circle
                const circleImageX = rightSectionStartX + circleRadius - 3; // Center the image in the circle horizontally
                const circleImageY = rightSectionStartY - 3; // Center the image in the circle vertically
                const circleImageWidth = 6; // Smaller width for the image
                const circleImageHeight = 6; // Smaller height for the image

                // Add the smaller image on top of the circle
                pdf.addImage(
                    restaurant.src, // Replace with the small image source
                    circleImageX,
                    circleImageY,
                    circleImageWidth,
                    circleImageHeight
                );

                // Add label text next to the circle
                const labelX = rightSectionStartX + circleRadius * 2 + 2; // Positioning right next to the circle with a small space
                const labelY = rightSectionStartY + 1; // Vertically center the text

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(8);
                pdf.setTextColor(0, 0, 0); // Black color for text
                pdf.text(block.label, labelX, labelY); // Add the label text

                // Calculate value position for right alignment
                pdf.setFont("helvetica", "normal");
                const valueWidth = pdf.getTextWidth(block.value);
                const valueX = pageWidth3 - rightMargin3 - valueWidth; // Right-align the value
                const lineStartX = labelX + pdf.getTextWidth(block.label) + 2;
                const lineEndX = valueX - 3; // End the line just before the value

                // Draw a thin line after the label text
                const lineY = labelY - 0.7;
                pdf.setDrawColor(0, 0, 0); // Black color for the line
                pdf.setLineWidth(0.1); // Thin line
                pdf.line(lineStartX, lineY, lineEndX, lineY);

                // Add the value text
                pdf.text(block.value, valueX, labelY);

                // Update the Y position for the next text block
                rightSectionStartY += 10; // Adjust this value for spacing between blocks
            });

            addBorders(pdf, pageWidth, pageHeight);

            pdf.addPage();

            const locationXPos = 20;
            const locationYPos = 40;

            const finishingXPos = pageWidth - 100;
            const finishingYPos = locationYPos;

            const lineSpacing1 = 10;

            pdf.setFontSize(14);
            pdf.text("Location", locationXPos, locationYPos);

            const locationTextHeight = 14;
            const spaceBetweenTexts = 5;
            const dubaiMarinaYPos =
                locationYPos + locationTextHeight + spaceBetweenTexts;

            pdf.setFontSize(14);
            pdf.text("Dubai Marina", locationXPos, dubaiMarinaYPos);

            const borderPadding = 2;
            const textWidth = pdf.getTextWidth("Dubai Marina");

            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            pdf.roundedRect(
                locationXPos - borderPadding,
                dubaiMarinaYPos - 8 - borderPadding,
                textWidth + 2 * borderPadding,
                locationTextHeight + 2 * borderPadding - 2,
                5,
                5
            );

            pdf.setFontSize(14);
            pdf.text("Finishing", finishingXPos + 4, finishingYPos, { align: "right" });

            const rightXPos = pageWidth - 30;

            const textYPos1 = locationYPos + 10;
            const textYPos2 = locationYPos + 20;

            pdf.setFontSize(12);
            pdf.text(
                "There are 1 finishes available in this complex:",
                rightXPos,
                textYPos1,
                { align: "right" }
            );
            pdf.text(data?.furnished === 'yes' ? "Furnished" : "Unfurnished", rightXPos - 66, textYPos2, { align: "right" });

            const imgHeight1 = 110;
            const imgWidth1 = (pageWidth - 40) / 2;
            const spaceBetweenImages = 8;
            const leftMargin = 12;
            const rightMargin = 20;

            const gridImgHeight = 50;
            const gridImgWidth = 40;

            const imageYPos1 = textYPos2 + lineSpacing1 + 10;

            pdf.addImage(f1.src, "JPEG", leftMargin, imageYPos1, imgWidth1, imgHeight1);

            const imageYPos2 = imageYPos1;
            pdf.addImage(
                f1.src,
                "JPEG",
                leftMargin + imgWidth1 + spaceBetweenImages,
                imageYPos2,
                gridImgWidth,
                gridImgHeight
            );
            pdf.addImage(
                f1.src,
                "JPEG",
                leftMargin +
                imgWidth1 +
                spaceBetweenImages +
                gridImgWidth +
                spaceBetweenImages,
                imageYPos2,
                gridImgWidth,
                gridImgHeight
            );

            const imageYPos3 = imageYPos2 + gridImgHeight + spaceBetweenImages;
            pdf.addImage(
                f1.src,
                "JPEG",
                leftMargin + imgWidth1 + spaceBetweenImages,
                imageYPos3,
                gridImgWidth,
                gridImgHeight
            );
            pdf.addImage(
                f1.src,
                "JPEG",
                leftMargin +
                imgWidth1 +
                spaceBetweenImages +
                gridImgWidth +
                spaceBetweenImages,
                imageYPos3,
                gridImgWidth,
                gridImgHeight
            );

            //new page
            addBorders(pdf, pageWidth, pageHeight);
            pdf.addPage();
            const rows = [
                { name: "Frozen yoghurt", calories: 159, protein: 4.0 },
                { name: "Ice cream sandwich", calories: 237, protein: 4.3 },
                { name: "Eclair", calories: 262, protein: 6.0 },
            ];

            const startX = 20;
            const startY = 50;
            const pageWidth1 = pdf.internal.pageSize.width;
            const tableWidth = pageWidth1 - 40;
            const rowHeight = 10;

            const colWidths = [
                0.4 * tableWidth,
                0.12 * tableWidth,
                0.12 * tableWidth,
                0.12 * tableWidth,
                0.12 * tableWidth,
            ];

            const headerBgColor = [229, 243, 253];
            const headerHeight = rowHeight;
            const headerX = startX - 5;
            const headerWidth = tableWidth + 10;

            pdf.setFillColor(...headerBgColor);
            pdf.rect(
                headerX,
                startY - headerHeight + 2,
                headerWidth,
                headerHeight,
                "F"
            );

            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0, 0, 0);
            pdf.text("Menu", startX, startY);
            pdf.text("Calories", startX + colWidths[0], startY);
            pdf.text(
                "Protein (g)",
                startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                startY
            );

            pdf.setLineWidth(0.2);
            pdf.line(headerX, startY + 2, headerX + headerWidth, startY + 2);

            pdf.setLineWidth(0.2);
            pdf.line(startX - 5, startY + 2, startX + tableWidth, startY + 2);

            pdf.setFont("helvetica", "normal");
            let currentY = startY + rowHeight;

            rows.forEach((row) => {
                pdf.text(row.name, startX, currentY);
                pdf.text(row.calories.toString(), startX + colWidths[0], currentY);
                pdf.text(
                    row.protein.toString(),
                    startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    currentY
                );

                pdf.setLineWidth(0.2);
                pdf.line(startX - 6, currentY + 2, startX + tableWidth + 6, currentY + 2);

                currentY += rowHeight;
            });

            const borderPadding1 = 6;
            const borderX = startX - borderPadding1;
            const borderY = startY - borderPadding1 - 2;
            const borderWidth = tableWidth + 2 * borderPadding1;
            const borderHeight =
                rowHeight * rows.length + rowHeight + 2 * borderPadding1;

            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.2);
            pdf.roundedRect(borderX, borderY, borderWidth, borderHeight, 5, 5);

            addBorders(pdf, pageWidth, pageHeight);
            pdf.addPage();

            // Grid Layout for Images
            const images = [f1.src, f1.src, f1.src,]; // Replace f2, f3, f4 with actual images
            const gridXStart = 10;
            const gridYStart = 105;
            const imgWidth2 = 42; // Image width in mm
            const imgHeight2 = 45; // Image height in mm
            const space = 5; // Space between images
            const imagesPerRow = 4;

            let xPos = gridXStart;
            let yPos = gridYStart;
            const textX2 = gridXStart; // Align with the starting position of the grid
            const textY2 = gridYStart - 65;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18); // Adjust font size if needed
            pdf.text("Project description", textX2, textY2);
            const wrappedText = pdf.splitTextToSize(data.description, 200);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12); // Adjust font size if needed
            pdf.text(wrappedText, textX2, textY2 + 8);
            const textX1 = gridXStart; // Align with the starting position of the grid
            const textY1 = gridYStart - 7;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18); // Adjust font size if needed
            pdf.text("Photo gallery of complex", textX1, textY1);

            // images?.forEach((image, index) => {
            //     pdf.addImage(image, "JPEG", xPos, yPos, imgWidth2, imgHeight2);

            //     // Adjust positions for the next image
            //     xPos += imgWidth2 + space;
            //     if ((index + 1) % imagesPerRow === 0) {
            //         xPos = gridXStart;
            //         yPos += imgHeight2 + space;
            //     }
            // });
            // const base64Image = getBase64ImageFromUrl(image);

            // Add image to PDF (x, y, width, height)
            // pdf.addImage(base64Image, "JPEG", 10, 10, 180, 160);

            // await addRoundedImageToPdf(pdf, base64Image, imageXPos - 5, imageYPos - 3, imageWidth, imageHeight, 5);


            // const image = 'https://38.108.127.171:3001/propertyimages/files-1733822280129-966336610.jpg'
            const image = data?.files[0]
            const proxyUrl = "https://api.allorigins.win/raw?url=";

            // Function to convert image URL to Base64
            const getBase64ImageFromUrl = async (imageUrl) => {
                try {
                    const response = await fetch(proxyUrl + encodeURIComponent(imageUrl));
                    if (!response.ok) {
                        throw new Error('Failed to fetch the image.');
                    }
                    const blob = await response.blob();
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result); // Get Base64 string
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    console.error("Error fetching image:", error);
                    throw error;
                }
            };
            try {
                // Convert the image to Base64
                const base64Image = await getBase64ImageFromUrl(image);
                // Add the image to the PDF
                pdf.addImage(image, "JPEG", xPos, yPos, imgWidth2, imgHeight2);
                // await addRoundedImageToPdf(pdf, base64Image, imageXPos - 5, imageYPos - 3, imageWidth, imageHeight, 5);
                // Trigger download
            } catch (error) {
                console.error("Error generating the PDF:", error);
            }



            addBorders(pdf, pageWidth, pageHeight);
            pdf.addPage();

            // Define new variable names for layout and spacing
            const startXb = 10; // Left margin
            const startYb = 40; // Top margin
            const imgWidthNew = 5; // Image width in mm
            const imgHeightNew = 5; // Image height in mm
            const cellWidthNew = 30; // Cell width in mm (including image and text)
            const cellHeightNew = 25; // Cell height in mm (space for image and text)
            const numColumns = 5; // Number of columns
            const numRows = 4; // Number of rows
            const cellSpacingNew = 5; // Space between rows and columns
            const pageWidthNew = 210; // A4 page width in mm
            const pageHeightNew = 297; // A4 page height in mm

            // Center the grid horizontally
            const gridWidthCalculation =
                numColumns * cellWidthNew + (numColumns - 1) * cellSpacingNew;
            const horizontalOffsetNew = (pageWidthNew - gridWidthCalculation) / 2;

            // Data for the features
            const featureDetails = formattedAmenities

            let posX = startXb + horizontalOffsetNew;
            let posY = startYb + 10;

            // Set font for the text
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);

            // Add the "Dhara Thakkar" text just above the images, slightly to the left

            pdf.text(
                "Features of the complex",
                posX +
                (numColumns * cellWidthNew + (numColumns - 1) * cellSpacingNew) / 2 -
                90,
                startYb
            );

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            // Adjust posY to start the image grid below the text
            posY += 10; // You can adjust this based on how much space you want

            // Loop through the featureDetails array and add images and text
            const numColumns1 = 4; // Number of columns in a row
            const columnSpacing = 10; // Spacing between columns

            featureDetails.forEach((feature, idx) => {
                // Set the color for the circle background
                pdf.setFillColor(245, 251, 255);

                // Circle radius adjustment
                const circleRadius = imgWidthNew * 1;

                // Draw the circle background
                pdf.circle(
                    posX + imgWidthNew / 2,
                    posY + imgHeightNew / 2,
                    circleRadius,
                    "F"
                );

                // Draw the image over the circle
                pdf.addImage(feature.img, "JPEG", posX, posY, imgWidthNew, imgHeightNew);

                // Draw the label/text below the image
                const wrappedText = pdf.splitTextToSize(feature.label, 60);
                pdf.text(wrappedText, posX + imgWidthNew / 2, posY + imgHeightNew + 8, {
                    align: "center",
                });

                // Move to the next cell with spacing for columns
                posX += cellWidthNew + cellSpacingNew;

                // Add extra spacing between columns except the last column
                if ((idx + 1) % numColumns1 !== 0) {
                    posX += columnSpacing;
                }

                // If we reach the end of a row (4 items), move to the next row
                if ((idx + 1) % numColumns1 === 0) {
                    posX = startXb + horizontalOffsetNew; // Reset X position for new row
                    posY += cellHeightNew + cellSpacingNew; // Move Y position down for the next row
                }

                // Add a new page if needed
                if (posY + cellHeightNew > pageHeightNew) {
                    pdf.addPage();
                    posY = startYb + 10;
                }
            });

            addBorders(pdf, pageWidth, pageHeight);

            pdf.addPage();

            const boxWidth = 130;
            const boxHeight = 100;

            const boxXPos = (pageWidth - boxWidth) / 2;
            const boxYPos = (pageHeight - boxHeight) / 2;

            pdf.setFillColor(242, 243, 244);
            pdf.rect(boxXPos, boxYPos, boxWidth, boxHeight, "F");

            const imageWidth = 30;
            const imageHeight = 30;

            const padding = 10;
            const imageXPos = boxXPos + padding;
            const imageYPos = boxYPos + padding;

            pdf.setFillColor(237, 237, 237);

            await addRoundedImageToPdf(pdf, logo1, imageXPos - 4, imageYPos - 4, imageWidth + 2, imageHeight + 2, 5);

            const textXPos = imageXPos + imageWidth + 30;
            const lineSpacing = 7;

            pdf.setFontSize(14);
            pdf.text("Contacts", textXPos, imageYPos + 5);

            pdf.setFontSize(10);
            pdf.text("Phone :", textXPos, imageYPos + 15);
            pdf.setFontSize(9);
            pdf.text("0208 050 4150", textXPos, imageYPos + 20);

            pdf.setFontSize(10);
            pdf.text("Email :", textXPos, imageYPos + 30);
            pdf.setFontSize(9);
            pdf.text("admin@sovereigninternational.uk", textXPos, imageYPos + 35);

            const leftTextXPos = boxXPos + padding;
            pdf.setFontSize(12);
            pdf.text("Sovereign International", leftTextXPos, imageYPos + 50);
            pdf.setFontSize(12);
            pdf.text("Real Estate", leftTextXPos, imageYPos + 55);

            pdf.setFontSize(12);
            pdf.text("Thank you for your attention and we are happy to help guide", leftTextXPos, imageYPos + 70);
            pdf.text("you on your next property investment.", leftTextXPos, imageYPos + 75);

            addBorders(pdf, pageWidth, pageHeight);

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
            URL.revokeObjectURL(pdfUrl);
            onClose()
        }
    };
    return (

        <div className="template1-container">
            <button className="generate-btn" onClick={handleGeneratePdf}>
                Preview Template
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
                                    <div className="progress-bar-container">
                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                        <p>{progress}%</p>
                                    </div>
                                </div>
                            ) : (
                                pdfUrl && <iframe src={pdfUrl} className="pdf-preview" title="PDF Preview" style={{ height: "70vh", width: "100vw" }}></iframe>
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


export default Template4;
