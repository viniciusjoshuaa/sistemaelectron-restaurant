# User Manual — Restaurant System Prototype

## Purpose

This manual explains how to install, start and operate the restaurant system prototype in a practical restaurant workflow.

## Installation

### Requirements
- Node.js installed
- npm installed
- operating system with Electron support

### Steps
1. Download or clone the project.
2. Open the project folder in a terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

## First login

When the local data layer is empty, the system may bootstrap a default administrator user.

### Default credentials
- **User:** `admin`
- **Password:** `admin`

> Recommendation: replace this behavior with a secure credential setup before any real deployment.

## Home screen

The home screen provides access to the system modules. The main dashboard is intended to centralize the most common operational shortcuts.

### Main actions
- open customer management
- open products, dishes and ingredients
- access orders and kitchen flow
- publish the daily menu
- open reports
- open the pricing calculator
- open WhatsApp
- open tables
- switch dark mode from the top-right toggle

## Registering core data

### 1. Ingredients
Register all base ingredients and operational items used by the restaurant.

Examples:
- rice
- beans
- meat
- seasoning
- packaging

### 2. Dishes
Register dishes and relate them to their ingredients.

Goals:
- create a basic recipe sheet
- calculate dish cost
- reuse the dish in menus and orders

### 3. Customers
Register repeat customers to simplify orders and build history.

### 4. Expenses
Register monthly expenses and operating costs used by the pricing calculator.

## Building the daily menu

1. Open **Daily Menu**.
2. Select the dishes that will be available.
3. Save the menu.
4. The system can then use that menu in order-related screens and the web menu.

## Registering orders

### Local order
1. Open the **Orders** screen.
2. Select a customer or fill in the required information.
3. Add order items.
4. Save the order.
5. The order becomes available in the operational flow.

### Customer menu / web menu order
1. Publish the current menu.
2. Generate or expose the online access / QR code.
3. The customer selects items.
4. The order enters the system flow depending on the active implementation.

## Using the kitchen screen

The **Kitchen** screen is designed to support production tracking.

### What users can do
- view pending orders
- filter by status
- inspect order details
- print receipts
- mark orders as ready
- cancel orders

## Using the pricing calculator

The **Pricing Calculator** helps suggest a final dish price based on:
- dish cost
- fixed / operational expenses
- expected number of monthly orders

### Suggested flow
1. Make sure dishes and expenses are already registered.
2. Open the **Pricing Calculator**.
3. Choose a dish.
4. Enter the estimated monthly number of orders.
5. Click calculate.
6. Review the suggested price.

## Using the tables screen

The **Tables** screen was designed for dining room operations.

### Behavior
- 20 predefined tables
- color-based visual status
- click a table to open details
- customer selection
- product/dish selection
- table-linked order registration

### Table status colors
- **Gray:** neutral / no activity
- **Green:** available
- **Red:** occupied

## Using WhatsApp

The **WhatsApp** screen should currently be treated as a configuration and prototype flow area.

### Possible approaches
- local session via WhatsApp Web
- official integration through Meta APIs

### Important
For official production usage, the integration depends on:
- configured Business account
- active number
- valid token
- public webhook
- compliance with platform policies

## Thermal printer

Printing depends on the local environment and on the compatibility of the installed printer.

### Recommendations
- test from the printer settings screen
- validate USB/network connection
- check drivers and permissions

## Backups

The system includes an automatic backup routine based on local files.

### Good practice
- keep an external copy of important files
- inspect the backup folder regularly
- do not rely only on the local disk

## Dark mode

The system includes theme switching.

### How to use
- click the toggle in the top-right corner of the home screen
- the preference is stored locally
- the remaining pages follow the saved preference

## Recommended operational maintenance

### Daily
- review the daily menu
- review pending orders
- validate kitchen flow
- test the WhatsApp flow if it is in use

### Weekly
- review reports
- clean inconsistent records
- verify backups

### Monthly
- review expenses
- recalculate prices in the pricing calculator
- update dishes, stock rules and service flows

## Current prototype limitations

- local JSON persistence
- simple authentication
- no relational database
- external integrations still prototype-level
- requires hardening before real production use

## Suggestions for future evolution

### Technical
- database adoption
- strong authentication
- audit logs
- automated tests
- separated API layer

### Functional
- automatic inventory deduction
- reservations
- cash closing
- payments
- delivery
- CRM and loyalty

## Internal support guidance

For project maintenance, any change affecting:
- HTML pages
- JSON file structures
- Electron handlers
- external integrations

should also be documented in the repository technical README.
