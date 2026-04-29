{{-- @extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Register') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('register') }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-end">{{ __('Name') }}</label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                                @error('name')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="email" class="col-md-4 col-form-label text-md-end">{{ __('Email Address') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-end">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password-confirm" class="col-md-4 col-form-label text-md-end">{{ __('Confirm Password') }}</label>

                            <div class="col-md-6">
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="phone_number" class="col-md-4 col-form-label text-md-end">{{ __('Phone Number') }}</label>

                            <div class="col-md-6">
                                <input id="phone_number" type="text" class="form-control @error('password') is-invalid @enderror" name="phone_number" required autocomplete="phone_number">

                                @error('phone_number')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="address" class="col-md-4 col-form-label text-md-end">{{ __('Address') }}</label>

                            <div class="col-md-6">
                                <input id="address" type="text" class="form-control @error('password') is-invalid @enderror" name="address" required autocomplete="address">

                                @error('address')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Register') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection --}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign Up - NFT</title>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <style>
        body {
            background: #f8f9fa;
            min-height: 100vh;
            display: flex;
            align-items: center;
        }

        .register-container {
            padding: 2rem 0;
        }

        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .card-body {
            padding: 3rem 2rem;
        }

        .title {
            color: #2c3e50;
            font-weight: 700;
            margin-bottom: 2rem;
            font-size: 2rem;
        }

        .form-group-row {
            margin-bottom: 1.5rem;
            position: relative;
        }

        .form-control {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            transition: all 0.3s;
        }

        .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.15);
            border-color: #2c3e50;
        }

        .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
        }

        .form-submit {
            padding: 0.75rem 2rem;
            font-weight: 600;
            border-radius: 10px;
            background: #2c3e50;
            border: none;
            transition: all 0.3s;
            width: 100%;
        }

        .form-submit:hover {
            background: #34495e;
            transform: translateY(-2px);
        }

        .signup-image {
            text-align: center;
            padding: 2rem;
        }

        .signup-image img {
            max-width: 100%;
            height: auto;
            margin-bottom: 2rem;
        }

        .signup-image-link {
            color: #2c3e50;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-block;
            margin-top: 1rem;
        }

        .signup-image-link:hover {
            color: #34495e;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .card-body {
                padding: 2rem 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container register-container">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h2 class="title">Create Account</h2>
                                <form method="POST" action="{{route('register')}}" class="register-form" id="register-form">
                                    @csrf

                                    <div class="form-group-row">
                                        <i class="fas fa-user input-icon"></i>
                                        <input class="form-control @error('name') is-invalid @enderror"
                                            type="text" placeholder="Full Name" name="name" id="name"
                                            value="{{ old('name') }}" required autocomplete="name"/>
                                        @error('name')
                                            <span class="invalid-feedback">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="form-group-row">
                                        <i class="fas fa-envelope input-icon"></i>
                                        <input class="form-control @error('email') is-invalid @enderror"
                                            type="email" placeholder="Email Address" name="email" id="email"
                                            value="{{ old('email') }}" required autocomplete="email"/>
                                        @error('email')
                                            <span class="invalid-feedback">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="form-group-row">
                                        <i class="fas fa-lock input-icon"></i>
                                        <input class="form-control @error('password') is-invalid @enderror"
                                            type="password" placeholder="Password" name="password" id="password"
                                            required autocomplete="new-password"/>
                                        @error('password')
                                            <span class="invalid-feedback">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="form-group-row">
                                        <i class="fas fa-lock input-icon"></i>
                                        <input class="form-control" type="password"
                                            placeholder="Confirm Password" name="password_confirmation"
                                            id="password_confirmation" required autocomplete="new-password"/>
                                    </div>

                                    <div class="form-group-row">
                                        <i class="fas fa-phone input-icon"></i>
                                        <input class="form-control @error('phone_number') is-invalid @enderror"
                                            type="text" placeholder="Phone Number" name="phone_number"
                                            id="phone_number" value="{{ old('phone_number') }}"
                                            required autocomplete="phone_number"/>
                                        @error('phone_number')
                                            <span class="invalid-feedback">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="form-group-row">
                                        <i class="fas fa-home input-icon"></i>
                                        <input class="form-control @error('address') is-invalid @enderror"
                                            type="text" placeholder="Address" name="address" id="address"
                                            value="{{ old('address') }}" required autocomplete="address"/>
                                        @error('address')
                                            <span class="invalid-feedback">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="form-group-row">
                                        <button type="submit" class="form-submit btn btn-primary">
                                            Create Account
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div class="col-md-6 signup-image">
                                <img src="{{asset('regform/images/LogoNFT5-removebg.png')}}" alt="NFT5 Logo">
                                <div>
                                    <a href="{{route('login')}}" class="signup-image-link">
                                        <i class="fas fa-sign-in-alt me-2"></i>Already have an account? Sign In
                                    </a>
                                </div>
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
