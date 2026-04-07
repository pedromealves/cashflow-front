# Cashflow - Frontend

A lightweight frontend for the [Cashflow API](https://github.com/seu-usuario/cashflow-api), built to demonstrate the backend in action with a functional user interface.


**Live:** https://pedromealves.github.io/cashflow-front/index.html

**API repository:** https://github.com/pedromealves/cashflow-api

---

## About

This frontend was scaffolded with AI assistance and manually implemented as a companion to the Cashflow API project. The primary focus of the project is the backend and this interface exists to make the API tangible and testable without programs like Postman.

---

## Tech Stack

- HTML, CSS, JavaScript
- Bootstrap 5
- Fetch API

---

## Pages

| Page             | Description                                              |
|------------------|----------------------------------------------------------|
| `index.html`     | Lists all transactions with delete and edit actions     |
| `create.html`    | Form to create a new transaction                        |
| `edit.html`      | Form to update an existing transaction       |
| `search.html`    | Search by keyword, category and type simultaneously     |
| `summary.html`   | Financial summary - income, expense and balance cards   |

## Running Locally

A static file server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or any static file server can be used. No build step required.

Make sure the Cashflow API is running on the endpoint of your choice before opening the frontend. Additionally, ensure the CORS is properly configured.

The `BASE_URL` in `js/api.js` must also be changed to point to the live API.





