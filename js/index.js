// DOM elements to be manipulated
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const tableWrapper = document.getElementById('table-wrapper');
const tbody = document.getElementById('transactions-tbody');
const modalDescText = document.getElementById('modal-description-text');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Bootstrap modal instances 
const descriptionModal = new bootstrap.Modal(document.getElementById('descriptionModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// Stores the ID of the transaction to be deleted;
let pendingDeleteID = null;

async function loadTransactions() {
    showState('loading');

    try {
        // Calls the api.js function
        const transactions = await fetchAllTransactions();

        if (transactions.length === 0) {
            showState('empty');
        } else {
            renderTable(transactions);
            showState('table');
        }
    } catch (error) {
        showState('empty');
        showToast('Connection to the server failed', 'error');
        console.error('Failed to load transactions:', error);
    }
}

function renderTable(transactions) {
    // Flushes previous content before rendering new data
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const tr = document.createElement('tr');

        const typeBadge = transaction.type === 'INCOME'
        ? `<span class="badge-income">Income</span>`
        : `<span class="badge-expense">Expense</span>`;

        const categoryText = transaction.category
        ? transaction.category.charAt(0) + transaction.category.slice(1).toLowerCase()
        : '-';

        const shortDesc = transaction.description && transaction.description.length > 30
        ? transaction.description.substring(0, 30) + '...'
        : transaction.description;

        tr.innerHTML = `
            <td style="color: var(--color-text-muted); font-size: 0.82rem;">#${transaction.id}</td>
 
            <td class="description-cell">
                <span class="description-text" title="${transaction.description}">${shortDesc}</span>
                ${transaction.description && transaction.description.length > 30
                    ? `<button class="btn-description" data-description="${encodeURIComponent(transaction.description)}">show</button>`
                    : ''
                }
            </td>
 
            <td style="font-weight: 600; font-variant-numeric: tabular-nums;">
                ${formatCurrency(transaction.amount)}
            </td>
 
            <td style="color: var(--color-text-muted);">${formatDate(transaction.date)}</td>
 
            <td>${typeBadge}</td>
 
            <td><span class="badge-category">${categoryText}</span></td>
 
            <td>
                <div style="display: flex; gap: 0.4rem;">
                    <!-- Link to the edit page, passing ID as a query param -->
                    <a href="edit.html?id=${transaction.id}" class="btn-action">
                        <i class="bi bi-pencil"></i> Edit
                    </a>
                    <!-- The data-id stores the ID of the transaction that will be deleted -->
                    <button class="btn-action delete" data-id="${transaction.id}">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);

    });

    attachTableListeners();
}

function attachTableListeners() {
    const descButtons = document.querySelectorAll('.btn-description');
    descButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const fullText = decodeURIComponent(btn.getAttribute('data-description'));
            modalDescText.textContent = fullText;
            descriptionModal.show();
        });
    });

    const deleteButtons = document.querySelectorAll('.btn-action.delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pendingDeleteID = parseInt(btn.getAttribute('data-id'));
            deleteModal.show();
        });
    });
}

confirmDeleteBtn.addEventListener('click', async () => {
    if (!pendingDeleteID) return;

    try {
        // Calls for the backend delete
        await deleteTransaction(pendingDeleteID);

        deleteModal.hide();
        pendingDeleteID = null;

        showToast('Transaction removed successfully');

        loadTransactions();

    } catch(error) {
        showToast('Failed to delete transaction: ' + error.message, 'error');
        console.error('Failed to delete:', error);
    }
});

function showState(state) {
    // Hides everything first
    loadingState.classList.add('d-none');
    emptyState.classList.add('d-none');
    tableWrapper.classList.add('d-none');

    if (state === 'loading') loadingState.classList.remove('d-none');
    if (state === 'empty') emptyState.classList.remove('d-none');
    if (state === 'table') tableWrapper.classList.remove('d-none');
}

// Executed as soon as the script loads
loadTransactions();
