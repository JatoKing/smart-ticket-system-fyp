# Smart Ticket System — National Football Match Ticketing

Final Year Project (FYP): a web-based system for booking tickets to Malaysian national football team matches at **Bukit Jalil National Stadium**. Customers choose their gate, category, level, section and seats directly on an interactive stadium map, make a payment, and receive an e-ticket with a QR code.

The system is built with **Laravel 10** and has two user roles: **Admin** and **Customer**.

---

## Background & Objectives

National team match tickets are often sold at counters or through systems that don't clearly show where a seat is located in the stadium. This project addresses that by:

1. Providing an online platform to view the match schedule and book tickets.
2. Displaying an **interactive SVG map of Bukit Jalil Stadium** that highlights the selected gate and section, so users can see exactly where their seats are.
3. Calculating ticket prices automatically based on seat category.
4. Generating an **e-ticket with a QR code** that can be downloaded as a PDF.
5. Providing an admin panel to manage matches, ticket prices and users.

---

## Main Features

### Customer
| Feature | Description |
|---|---|
| Register & Login | New accounts are registered with the `customer` role automatically. |
| Match Fixtures | List of matches (teams, date, time, venue). |
| Seat Selection | Choose **Gate (A–E) → Category → Level → Section → Seat**. The selected section is highlighted on the stadium map. |
| Price Calculation | The total price updates live based on the number of seats and the category. |
| Booking Review | Review the selected tickets, delete the selection, or proceed to payment. |
| Payment | Enter bank, full name, IC number and address. |
| E-Ticket | Ticket details with a **QR code** and a **Download PDF** button. |
| Order History | List of past bookings with links to their e-tickets. |

### Admin
| Feature | Description |
|---|---|
| Dashboard | Total users, total matches, and a chart of user registrations over the last 12 months (Chart.js). |
| Manage Matches | Create, view, update and delete matches (CRUD). |
| Manage Tickets & Prices | Set the price and quantity for 5 ticket categories per match. |
| User List | View all registered users. |

### Ticket Categories & Prices
| Category | Price | Gate |
|---|---|---|
| Premium | RM70 | A, E (Level 2) |
| Grandstand | RM50 | A, E (Level 1) |
| Home | RM30 | A, B, C, D, E |
| Ultras Malaya | RM30 | B (Level 1) |
| Away | RM30 | E (Level 3) |

The gate → category → level → section mapping is defined in the `gateTypeMap` object in [resources/views/customer/create.blade.php](backend/resources/views/customer/create.blade.php).

---

## System Flow

```
Customer
  Login ─► Dashboard ─► Match Fixtures ─► Choose Gate/Category/Level/Section
     ─► Choose Seats (price calculated) ─► Book Tickets ─► Review Booking
     ─► Payment ─► E-Ticket (QR + PDF) ─► Order History

Admin
  Login ─► Admin Dashboard ─► Manage Matches ─► Set Tickets & Prices
                          └─► User List
```

After login, users are redirected by role (`admin` → `/admin/dashboard`, `customer` → `/customer/dashboard`). Access to each route is enforced by the `check.role` middleware ([app/Http/Middleware/CheckRole.php](backend/app/Http/Middleware/CheckRole.php)).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.1+, Laravel 10, Laravel UI (auth) |
| Database | MySQL |
| Customer Frontend | Blade, Bootstrap, *NationalFootballTicket* template ([public/NationalFootballTicket/](backend/public/NationalFootballTicket/)) |
| Admin Frontend | Blade, AdminLTE 3 ([public/admin/](backend/public/admin/)), Chart.js |
| Stadium Map | Interactive SVG + JavaScript |
| E-Ticket | QR Server API (QR code), jsPDF (PDF download) |
| Build tool | Vite |

---

## Database Structure

```
users ──┬──< bookticket >── footballmatches ──< tickets
        │        │
        │        └──< payment
```

| Table | Purpose | Key fields |
|---|---|---|
| `users` | User accounts | `name`, `email`, `password`, `role` (`admin`/`customer`), `phone_number`, `address` |
| `footballmatches` | Matches | `teams`, `date`, `time`, `location` |
| `tickets` | Ticket price & quantity per match | `match_id`, `type`, `price`, `quantity` |
| `bookticket` | Customer seat bookings | `user_id`, `match_id`, `gate`, `type`, `level`, `section`, `seat`, `totalPrice` |
| `payment` | Payment records | `bookticket_id`, `fname`, `identification` |

---

## Project Structure (key files)

The repository is split into two parts:

```
smart-ticket-system-fyp/
├── backend/     # Laravel 10 app (API, database, Blade pages, admin panel)
├── frontend/    # Next.js app (new customer UI, talks to backend at http://127.0.0.1:8000)
└── README.md
```

Inside `backend/`:

```
app/
├── Http/Controllers/
│   ├── AdminController.php         # Admin dashboard + statistics
│   ├── MatchController.php         # Match CRUD
│   ├── TicketController.php        # Ticket prices & quantities
│   ├── UserController.php          # User list
│   ├── CustomerController.php      # Customer dashboard
│   ├── BookTicketController.php    # Seat selection & booking
│   ├── PaymentController.php       # Payment & e-ticket
│   ├── OrderHistoryController.php  # Order history
│   └── Auth/LoginController.php    # Role-based redirect
├── Http/Middleware/CheckRole.php   # Admin/customer access control
└── Models/                         # User, FootballMatch, Ticket, BookTicket, Payment

database/
├── migrations/                     # Table schemas
└── seeders/                        # Sample data (users & matches)

resources/views/
├── admin/, matches/, tickets/      # Admin pages (AdminLTE)
├── customer/                       # Customer pages (create.blade.php = stadium map)
├── payment/                        # Payment form & e-ticket
└── order/history.blade.php         # Order history

routes/web.php                      # All web routes
```

---

## Installation & Setup

**Requirements:** PHP 8.1+, Composer, Node.js & npm, MySQL.

```bash
# 1. Clone the repository
git clone <repo-url> smart-ticket-system-fyp
cd smart-ticket-system-fyp/backend

# 2. Install dependencies
composer install
npm install

# 3. Set up the .env file
cp .env.example .env
php artisan key:generate
```

Update the database settings in `backend/.env`:

```env
DB_DATABASE=smart_ticket
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# 4. Create tables & seed sample data
php artisan migrate --seed

# 5. Run the application
npm run dev          # terminal 1
php artisan serve    # terminal 2
```

Open `http://localhost:8000` in your browser.

To run the new Next.js frontend as well:

```bash
cd smart-ticket-system-fyp/frontend
npm install
npm run dev          # terminal 3, opens on http://localhost:3000
```

### Sample Accounts (from seeder)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `password` |
| Customer | `izzat@gmail.com` | `password` |

The seeder also adds two sample matches: **Malaysia vs Indonesia** and **Malaysia vs Korea Republic** at Bukit Jalil Stadium.

---

## Limitations & Future Improvements

- **Payment is simulated**: there is no integration with a real payment gateway (e.g. FPX, ToyyibPay, Billplz).
- **Booked seats are not locked**: other customers can still select the same seat. Suggested fix: check the `bookticket` table and mark taken seats as *reserved* on the map.
- **Ticket quantity is not deducted** after a booking is made.
- QR codes are generated through an external API (`api.qrserver.com`), so an internet connection is required.
- The migration `2025_02_08_070341_add_user_id_to_payments_table.php` refers to a `payments` table, but the actual table is named `payment`. If `php artisan migrate` fails at this step, the table name in that migration needs to be corrected. This `user_id` field is also used by the Order History page.
- Future ideas: email notification after payment, QR scanner at stadium entrances, sales reports for admin.

---

## Developer

Developed by **Izzat** as a Final Year Project (FYP).

Built on [Laravel](https://laravel.com) (MIT license). The admin template uses [AdminLTE](https://adminlte.io).
