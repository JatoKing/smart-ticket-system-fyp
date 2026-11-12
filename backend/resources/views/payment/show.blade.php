<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your E-Ticket</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background: linear-gradient(135deg, #f6f8fb 0%, #e9eef5 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            max-width: 1000px;
            width: 100%;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
            padding: 40px;
            margin: 20px;
        }

        .ticket-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f2f5;
        }

        .ticket-header h1 {
            color: #1a1a1a;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .details {
            background: #f8fafc;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid #e5e9f0;
        }

        .details h2 {
            color: #2d3748;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .detail-item {
            margin-bottom: 15px;
        }

        .detail-item strong {
            display: block;
            color: #4a5568;
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-item span {
            color: #2d3748;
            font-size: 16px;
            font-weight: 500;
        }

        .user-info {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            background: white;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid #e5e9f0;
            align-items: center;
        }

        .qr-code {
            text-align: center;
        }

        .qr-code img {
            max-width: 200px;
            border-radius: 12px;
            padding: 15px;
            background: white;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
            border: 1px solid #e5e9f0;
        }

        .button-container {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
        }

        .btn {
            padding: 14px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 180px;
        }

        .btn-primary {
            background: #4f46e5;
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background: #4338ca;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #10b981;
            color: white;
            border: none;
        }

        .btn-secondary:hover {
            background: #059669;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }

            .details-grid {
                grid-template-columns: 1fr;
            }

            .user-info {
                grid-template-columns: 1fr;
            }

            .button-container {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }
        }

        /* Print styles */
        @media print {
            body {
                background: white;
            }

            .container {
                box-shadow: none;
                margin: 0;
                padding: 20px;
            }

            .button-container {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="ticket-header">
            <h1>E-Ticket Details</h1>
            <p>Your digital ticket for the upcoming match</p>
        </div>

        <div class="details">
            <h2>Match Information</h2>
            <div class="details-grid">
                <div class="detail-item">
                    <strong>Match</strong>
                    <span>{{ $payment->bookTicket->footballMatch->teams }}</span>
                </div>
                <div class="detail-item">
                    <strong>Gate</strong>
                    <span id="view-gate">{{ $payment->bookTicket->gate }}</span>
                </div>
                <div class="detail-item">
                    <strong>Type</strong>
                    <span id="view-type">{{ $payment->bookTicket->type }}</span>
                </div>
                <div class="detail-item">
                    <strong>Level</strong>
                    <span id="view-level">{{ $payment->bookTicket->level }}</span>
                </div>
                <div class="detail-item">
                    <strong>Seating Section</strong>
                    <span id="view-section">{{ $payment->bookTicket->section }}</span>
                </div>
                <div class="detail-item">
                    <strong>Selected Seats</strong>
                    <span id="view-seats">{{ implode(', ', json_decode($payment->bookTicket->seat)) }}</span>
                </div>
                <div class="detail-item">
                    <strong>Total Price</strong>
                    <span id="view-price">{{ $payment->bookTicket->totalPrice }}</span>
                </div>
            </div>
        </div>

        <div class="user-info">
            <div class="details-grid">
                <div class="detail-item">
                    <strong>Full Name</strong>
                    <span id="view-fullname">{{$payment->fname}}</span>
                </div>
                <div class="detail-item">
                    <strong>IC Number</strong>
                    <span id="view-ic">{{$payment->identification}}</span>
                </div>
            </div>
            <div class="qr-code">
                <img id="qr-code-img" src="" alt="QR Code">
            </div>
        </div>

        <div class="button-container">
            <button onclick="generatePDF()" class="btn btn-primary">Download PDF</button>
            <a href="{{route('customer.dashboard')}}" class="btn btn-secondary">Back to Home</a>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        // Retrieve data from sessionStorage and populate the page
        document.addEventListener("DOMContentLoaded", () => {
            const gate = document.getElementById("view-gate").textContent;
            const type =  document.getElementById("view-type").textContent;
            const level =  document.getElementById("view-level").textContent;
            const section = document.getElementById("view-section").textContent;
            const seats = document.getElementById("view-seats").textContent;
            const totalPrice = document.getElementById("view-price").textContent;
            const fullName =  document.getElementById("view-fullname").textContent;
            const icNumber = document.getElementById("view-ic").textContent;

            // // Populate ticket details
            // document.getElementById("view-gate").textContent = gate;
            // document.getElementById("view-type").textContent = type;
            // document.getElementById("view-level").textContent = level;
            // document.getElementById("view-section").textContent = section;
            // document.getElementById("view-seats").textContent = seats;
            // document.getElementById("view-price").textContent = totalPrice;

            // // Populate user details
            // document.getElementById("view-fullname").textContent = fullName;
            // document.getElementById("view-ic").textContent = icNumber;

            // Generate a QR code URL dynamically
            const qrData = `
                Ticket Details:
                Gate: ${gate}
                Type: ${type}
                Level: ${level}
                Section: ${section}
                Seats: ${seats}
                Total Price: RM${totalPrice}
                Full Name: ${fullName}
                IC Number: ${icNumber}
            `;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;

            // Set the QR code image source
            document.getElementById("qr-code-img").src = qrCodeUrl;
        });

        // Generate a PDF of the ticket details
        async function generatePDF() {
            const { jsPDF } = window.jspdf;

            // Retrieve ticket and user details
            const gate = document.getElementById("view-gate").textContent;
            const type = document.getElementById("view-type").textContent;
            const level = document.getElementById("view-level").textContent;
            const section = document.getElementById("view-section").textContent;
            const seats = document.getElementById("view-seats").textContent;
            const totalPrice = document.getElementById("view-price").textContent;
            const fullName = document.getElementById("view-fullname").textContent;
            const icNumber = document.getElementById("view-ic").textContent;
            const qrCodeImg = document.getElementById("qr-code-img").src;

            const pdf = new jsPDF();

            // Add ticket details to the PDF
            pdf.setFontSize(16);
            pdf.text("Ticket Details", 10, 10);
            pdf.setFontSize(12);
            pdf.text(`Gate: ${gate}`, 10, 30);
            pdf.text(`Type: ${type}`, 10, 40);
            pdf.text(`Level: ${level}`, 10, 50);
            pdf.text(`Seating Section: ${section}`, 10, 60);
            pdf.text(`Selected Seats: ${seats}`, 10, 70);
            pdf.text(`Total Price: RM${totalPrice}`, 10, 80);
            pdf.text(`Full Name: ${fullName}`, 10, 100);
            pdf.text(`IC Number: ${icNumber}`, 10, 110);

            // Add QR code to the PDF
            const qrImage = new Image();
            qrImage.src = qrCodeImg;
            qrImage.onload = () => {
                pdf.addImage(qrImage, "PNG", 150, 20, 40, 40);
                pdf.save("Ticket_Details.pdf");
            };
        }

        // // Redirect to Home Page
        // function goToHome() {
        //     window.location.href = "index.html"; // Change to your actual home page URL
        // }
    </script>
</body>
</html>
