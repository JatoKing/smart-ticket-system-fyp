<?php

/*
|--------------------------------------------------------------------------
| Stadium Bukit Jalil — gates, seating categories and sections
|--------------------------------------------------------------------------
|
| Same data as the booking page (resources/views/customer/create.blade.php →
| `gateTypeMap` and `seatPrices`), kept here so other clients (the Next.js
| seat map via GET /api/stadium) read one server-side copy.
| If you change sections or prices, update the booking page script too.
|
| Rings: level 1 = sections 101–134, level 2 = 201–234, level 3 = 301–334.
| "A"/"B" suffixes are sections split between two gates or categories.
|
*/

return [
    'currency' => 'MYR',

    // RM per seat, by category (booking page `seatPrices`)
    'prices' => [
        'Premium' => 70,
        'Grandstand' => 50,
        'Home' => 30,
        'UltrasMalaya' => 30,
        'Away' => 30,
    ],

    'labels' => [
        'Premium' => 'FAM Premium',
        'Grandstand' => 'Grandstand',
        'Home' => 'Home',
        'UltrasMalaya' => 'Ultras Malaya',
        'Away' => 'Away fans',
    ],

    // gate => category => level => sections
    'gates' => [
        'A' => [
            'Grandstand' => [1 => ['134', '133', '132']],
            'Premium' => [2 => ['233', '232', '231', '230', '229']],
            'Home' => [3 => ['334', '333', '332', '331']],
        ],
        'B' => [
            'UltrasMalaya' => [1 => ['103', '104', '105', '106', '107', '108', '109']],
            'Home' => [
                1 => ['101', '102'],
                2 => ['234', '201B', '201A', '202', '203', '204', '205', '206', '207', '208B'],
                3 => ['301B', '301A', '302', '303', '304', '305', '306', '307', '308', '309', '310B'],
            ],
        ],
        'C' => [
            'Home' => [
                1 => ['110', '111', '112', '113', '114', '115', '116', '117', '118', '119'],
                2 => ['208A', '209', '210', '211', '212', '213', '214', '215', '216B'],
                3 => ['310A', '311', '312', '313', '314', '315', '316', '317', '318B'],
            ],
        ],
        'D' => [
            'Home' => [
                1 => ['120', '121', '122', '123', '124', '125'],
                2 => ['216A', '217', '218', '219', '220'],
                3 => ['318A', '319', '320', '321', '322', '323', '324', '325', '326', '327B'],
            ],
        ],
        'E' => [
            'Grandstand' => [1 => ['128', '129', '130', '131']],
            'Premium' => [2 => ['225', '226', '227', '228']],
            'Home' => [
                2 => ['223A', '224'],
                3 => ['327A', '328', '329', '330'],
            ],
            'Away' => [
                2 => ['221', '222', '223B'],
                1 => ['126', '127'],
            ],
        ],
    ],
];
