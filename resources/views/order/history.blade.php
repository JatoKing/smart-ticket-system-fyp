
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order History</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Copy the styles from payment/show.blade.php and modify as needed */
        /* Add this new style for the order list */
        .order-list {
            margin-top: 20px;
        }

        .order-item {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #e5e9f0;
        }

        .order-item:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="ticket-header">
            <h1>Order History</h1>
            <p>Your previous ticket purchases</p>
        </div>

        <div class="order-list">
            @foreach($orders as $order)
                <div class="order-item">
                    <div class="details-grid">
                        <div class="detail-item">
                            <strong>Match</strong>
                            <span>{{ $order->bookTicket->footballMatch->teams }}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Purchase Date</strong>
                            <span>{{ $order->created_at->format('d M Y') }}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Gate</strong>
                            <span>{{ $order->bookTicket->gate }}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Seats</strong>
                            <span>{{ implode(', ', json_decode($order->bookTicket->seat)) }}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Total Price</strong>
                            <span>RM {{ $order->bookTicket->totalPrice }}</span>
                        </div>
                        <div class="detail-item">
                            <a href="{{ route('payment.show', $order->id) }}" class="btn btn-primary">View Ticket</a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="button-container">
            <a href="{{ route('customer.dashboard') }}" class="btn btn-secondary">Back to Home</a>
        </div>
    </div>
</body>
</html>
