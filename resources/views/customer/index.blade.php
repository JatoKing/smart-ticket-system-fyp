<!doctype html>
<html class="no-js" lang="zxx">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Soccer | Home</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="{{asset('NationalFootballTicket/apple-touch-icon.html')}}">
    <link rel="shortcut icon" type="image/x-icon" href="{{asset('NationalFootballTicket/images/fav.png')}}">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/font-awesome.min.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/animate.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/rsmenu-main.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/rsmenu-transitions.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/hover-min.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/magnific-popup.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/owl.carousel.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/time-circles.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/slick.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/style.css')}}">
    <link rel="stylesheet" href="{{asset('NationalFootballTicket/css/responsive.css')}}">

    <style>
        body {
            background-color: #f4f4f9;
            font-family: Arial, sans-serif;
        }

        .row{
            display: flex;
            justify-content: center;
        }

        .title-bg {
            color: #333;
            font-weight: bold;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }

        .match-list {
            background: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 20px;
            overflow: hidden;
            margin: 0 auto;
            max-width: 800px;
        }

        .match-table {
            width: 100%;
            border-collapse: collapse;
        }

        .match-table th,
        .match-table td {
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }

        .match-table tr:hover {
            background-color: #f9f9f9;
        }

        .match-table td a {
            text-decoration: none;
            color: #060606;
            background-color:yellow;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
        }

        .match-table td a:hover {
            background-color: yellow;
        }

        .back-button-container {
            margin-top: 20px;
            text-align: center;
        }

        .back-button {
            text-decoration: none;
            color: #fff;
            background-color: grey;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
         }

        .back-button:hover {
            background-color: gainsboro;
        }

    </style>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <h3 class="title-bg">Match Fixture</h3>
                <div class="match-list">
                    <table class="match-table">
                        <thead>
                            <tr>
                                <th>Teams</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($fmatches as $mts)
                            <tr>
                                <td>{{ $mts->teams }}</td>
                                <td>{{ $mts->date }}</td>
                                <td>{{ $mts->time }}</td>
                                <td>{{ $mts->location }}</td>
                                <td>
                                    <a href="{{ route('customer.create', ['fmatch' => $mts->id]) }}">
                                        Buy a Ticket
                                    </a>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <a href="{{route ('customer.dashboard')}}" class="back-button">Back</a>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- JS Scripts -->
    <script src="{{asset('NationalFootballTicket/js/jquery.min.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/rsmenu-main.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/jquery-ui.min.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/bootstrap.min.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/jquery.meanmenu.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/wow.min.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/slick.min.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/masonry.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/owl.carousel.min.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/time-circle.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/jquery.magnific-popup.js')}}"></script>
    <script src="{{asset('NationalFootballTicket/js/main.js')}}"></script>
</body>

</html>
