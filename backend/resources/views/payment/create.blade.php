<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Payment - NFT5</title>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <style>
        body {
            background: #f8f9fa;
            min-height: 100vh;
            padding-top: 2rem;
            padding-bottom: 2rem;
        }

        .payment-container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 2rem;
        }

        .card-header {
            background-color: #2c3e50;
            color: white;
            padding: 1.5rem;
            border-bottom: none;
        }

        .card-body {
            padding: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
            position: relative;
        }

        .form-control {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            transition: all 0.3s;
            height: 48px;
            line-height: 1.5;
        }

        .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.15);
            border-color: #2c3e50;
        }

        .input-icon {
            position: absolute;
            left: 1rem;
            top: calc(50% + 10px);
            transform: translateY(-50%);
            color: #6c757d;
            font-size: 1rem;
            z-index: 2;
            pointer-events: none;
        }

        .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            display: block;
        }

        .form-group:has(select) .input-icon {
            top: calc(50% + 10px);
        }

        .order-summary {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
        }

        .order-summary h3 {
            color: #2c3e50;
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e0e0e0;
        }

        .summary-item:last-child {
            border-bottom: none;
            font-weight: 700;
        }

        .btn-payment {
            background-color: #2c3e50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            border: none;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s;
        }

        .btn-payment:hover {
            background-color: #34495e;
            transform: translateY(-2px);
        }

        select.form-control {
            padding-left: 2.5rem;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 16px;
            height: 48px;
        }
    </style>
</head>
<body>
    <div class="container payment-container">
        <div class="card">
            <div class="card-header">
                <h2 class="m-0"><i class="fas fa-credit-card me-2"></i>Payment Details</h2>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <form action="{{ route('payment.store', ['fmatch' => $bookticket->footballMatch->id, 'bookticket' => $bookticket->id]) }}" method="POST">
                            @csrf

                            <div class="form-group">
                                <label class="form-label">Bank Type</label>
                                {{-- <i class="fas fa-university input-icon"></i> --}}
                                <select name="order_method" class="form-control @error('order_method') is-invalid @enderror" required>
                                    <option value="">Select Bank</option>
                                    <option value="Maybank">Maybank</option>
                                    <option value="RHB">RHB Bank</option>
                                    <option value="CIMB">CIMB Bank</option>
                                    <option value="AM-BANK">AM Bank</option>
                                    <option value="Bank Islam">Bank Islam</option>
                                </select>
                                @error('order_method')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                {{-- <i class="fas fa-user input-icon"></i> --}}
                                <input type="text" class="form-control @error('fullname') is-invalid @enderror"
                                    name="fullname" placeholder="Enter your full name" required>
                                @error('fullname')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label class="form-label">IC Number</label>
                                {{-- <i class="fas fa-id-card input-icon"></i> --}}
                                <input type="text" class="form-control @error('identification') is-invalid @enderror"
                                    name="identification" placeholder="000000-00-0000" required>
                                @error('identification')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label class="form-label">Address</label>
                                {{-- <i class="fas fa-home input-icon"></i> --}}
                                <input type="text" class="form-control @error('address') is-invalid @enderror"
                                    name="address" placeholder="Enter your address" required>
                                @error('address')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>

                            <input type="hidden" name="ticket_id" value="{{ $bookticket->id }}">
                            <input type="hidden" name="fmatch" value="{{ $fmatch }}">

                            <button type="submit" class="btn btn-payment">
                                <i class="fas fa-lock me-2"></i>Proceed to Pay
                            </button>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <div class="order-summary">
                            <h3><i class="fas fa-receipt me-2"></i>Order Summary</h3>
                            <div class="summary-item">
                                <span>Match</span>
                                <span>{{ $fmatch->teams }}</span>
                            </div>
                            <div class="summary-item">
                                <span>Total Amount</span>
                                <span class="text-primary">RM{{ number_format($bookticket->totalPrice, 2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
