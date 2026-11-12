<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Selections</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Global styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: #f0f2f5;
            color: #1a1a1a;
            line-height: 1.6;
        }

        /* Container styling */
        .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        /* Header styling */
        .header {
            margin-bottom: 32px;
            text-align: center;
        }

        .header h1 {
            font-size: 32px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
        }

        .header p {
            color: #718096;
            font-size: 18px;
        }

        /* Selection card styling */
        .selection-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            transition: transform 0.2s ease;
        }

        .selection-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .selection-card span {
            display: block;
            margin-bottom: 12px;
            font-size: 16px;
            color: #4a5568;
        }

        .selection-card strong {
            color: #2d3748;
            font-weight: 600;
            min-width: 140px;
            display: inline-block;
        }

        /* Price display */
        .selection-card span:last-child {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 18px;
        }

        .selection-card span:last-child strong {
            color: #2d3748;
        }

        /* Footer and buttons */
        .footer {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 32px;
        }

        .btn-style {
            padding: 12px 28px;
            font-size: 16px;
            font-weight: 500;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .go-back {
            background-color: #64748b;
            color: white;
        }

        .go-back:hover {
            background-color: #475569;
            transform: translateY(-2px);
        }

        .payment {
            background-color: #3b82f6;
            color: white;
        }

        .payment:hover {
            background-color: #2563eb;
            transform: translateY(-2px);
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .container {
                margin: 20px;
                padding: 20px;
            }

            .header h1 {
                font-size: 28px;
            }

            .footer {
                flex-direction: column;
            }

            .btn-style {
                width: 100%;
                margin: 5px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Ticket Selections</h1>
            <p>Review the details of your selections below.</p>
        </div>

        <!-- Display all tickets -->
        @foreach($bookTicket as $tickets)
        <div class="selection-card">
            <span><strong>Match:</strong> {{ $tickets->footballMatch->teams }}</span>
            <span><strong>Gate:</strong> {{ $tickets->gate }}</span>
            <span><strong>Type:</strong> {{ $tickets->type }}</span>
            <span><strong>Level:</strong> {{ $tickets->level }}</span>
            <span><strong>Seating Section:</strong> {{ $tickets->section }}</span>
            <span><strong>Selected Seats:</strong> {{ implode(', ', json_decode($tickets->seat)) }}</span>
            <span><strong>Total Price:</strong> RM{{ $tickets->totalPrice }}</span>
        </div>

        <!-- Form for deleting the ticket -->
        <form action="{{ route('customer.destroy', ['fmatch' => $tickets->footballMatch->id, 'bookticket' => $tickets->id]) }}" method="POST">
         @csrf
         @method('DELETE')
        <!-- Form for deleting the ticket -->
        <div class="footer">
            {{-- <a href="{{ route('customer.create', ['fmatch' => $tickets->footballMatch->id, 'bookticket' => $tickets->id]) }}" class="btn-style go-back">Go Back to Selection</a> --}}
            <input type="number" hidden name="fmatch" value="{{$tickets->footballMatch->id}}">
            <input type="submit" class="btn-style go-back" value="Go Back to Selection">
            <a class="btn-style payment" href="{{ route('payment.create', ['fmatch' => $tickets->footballMatch->id, 'bookticket' => $tickets->id]) }}">Payment</a>
        </div>
        @endforeach
        </form>
    </div>
</body>


    <script>
//         // Retrieve data from sessionStorage and populate the page
//         document.addEventListener("DOMContentLoaded", () => {
//             const gate = sessionStorage.getItem("gate") || "-";
//             const type = sessionStorage.getItem("type") || "-";
//             const level = sessionStorage.getItem("level") || "-";
//             const section = sessionStorage.getItem("section") || "-";
//             const seats = sessionStorage.getItem("seats") || "-";
//             const totalPrice = sessionStorage.getItem("totalPrice") || "0";

//             // Populate the fields
//             document.getElementById("view-gate").textContent = gate;
//             document.getElementById("view-type").textContent = type;
//             document.getElementById("view-level").textContent = level;
//             document.getElementById("view-section").textContent = section;
//             document.getElementById("view-seats").textContent = seats;
//             document.getElementById("view-price").textContent = totalPrice;
//         });

//         // Navigate back to the selection page
//         function returnToSelection() {
//             window.location.href = "stadium.html"; // Change to the actual selection page URL
//         }

//         function validateAndShowPopup() {
//         const gate = document.getElementById("gate").value;
//         const type = document.getElementById("type").value;
//         const level = document.getElementById("level").value;
//         const section = document.getElementById("section").value;
//         const selectedSeats = Array.from(document.querySelectorAll('.seat.selected')).map(seat => seat.dataset.seat);

//     if (gate && type && level && section && selectedSeats.length > 0 && totalPrice > 0) {
//         // Save data to sessionStorage
//         sessionStorage.setItem("gate", gate);
//         sessionStorage.setItem("type", type);
//         sessionStorage.setItem("level", level);
//         sessionStorage.setItem("section", section);
//         sessionStorage.setItem("seats", selectedSeats.join(", "));
//         sessionStorage.setItem("totalPrice", totalPrice);

//         // Redirect to the view page
//         window.location.href = "view.html"; // Change to the actual view page URL
//     } else {
//         alert("Please complete all selections (Gate, Type, Level, Section, Seat) and ensure the total price is calculated.");
//     }
// }

//     </script>
</body>
</html>
