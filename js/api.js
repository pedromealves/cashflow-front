// Communication layer that connects with Spring Boot background

// Spring Boot Base URL
const BASE_URL = 'https://cashflow-api-3zn5.onrender.com';

async function fetchAllTransactions() {
    const response = await fetch(`${BASE_URL}/transactions`);

    if(!response.ok) {
        throw new Error(`Failed the fetch transactions: ${response.status}`);
    }

    return response.json();
}

async function createTransaction(data) {
    const response = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Error ${response.status}`);
    }

    return response.json();
}

async function updateTransaction(id, data) {
    const response = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Error ${response.status}`);
    }

    return response.json();
}

async function deleteTransaction(id) {
    const response = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'DELETE'
    });

    if(!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Erro ${response.status}`);
    }
}


async function searchTransactions(params) {
    // URLSearchParams transforms an object { key: value } into a query string
    // E.g: { category: 'FOOD', type: 'EXPENSE' } -> "category=FOOD&type=EXPENSE"
    const queryString = new URLSearchParams(
        Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '' && value !== null)
        )
    ).toString();

    const url = `${BASE_URL}/transactions/search?${queryString}`;
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error(`Failed to search: ${response.status}`);
    }

    return response.json();
}

async function fetchSummary() {
    const response = await fetch(`${BASE_URL}/transactions/summary`);

    if(!response.ok) {
        throw new Error(`Failed to search for summary: ${response.status}`);
    }

    return response.json();
}

async function fetchTransactionById(id) {
    const all = await fetchAllTransactions();
    const found = all.find(t => t.id === parseInt(id));

    if(!found) {
        throw new Error(`Transaction with ID ${id} not found`);
    }

    return found;
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `cf-toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(isoDateString){
    if (!isoDateString) return "-";

    const [year, month, day] = isoDateString.split('-');
    return `${day}/${month}/${year}`;
}