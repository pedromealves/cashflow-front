
const searchBtn = document.getElementById('search-btn');
const initialState = document.getElementById('initial-state');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const resultsWrapper = document.getElementById('results-wrapper');
const resultsTbody = document.getElementById('results-tbody');
const resultsCount = document.getElementById('results-count');

searchBtn.addEventListener('click', async () => {
    const keyword = document.getElementById('filter-keyword').value.trim();
    const category = document.getElementById('filter-category').value;
    const type = document.getElementById('filter-type').value;

    // Builds up the the parameters object with what was filled by the user
    const params = { keyword, category, type };
 
    showState('loading');
 
    try {
        const results = await searchTransactions(params);
 
        if (results.length === 0) {
            showState('empty');
        } else {
            renderResults(results);
            showState('results');
        }
 
    } catch (error) {
        const message = error.message;
        const lowerMessage = message.charAt(0).toLowerCase() + message.slice(1);

        showToast('Failed to search: ' + lowerMessage, 'error');
        showState('initial');
    }
});

// Allows search by pressing enter 
document.getElementById('filter-keyword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

function renderResults(transactions) {
    resultsTbody.innerHTML = '';
 
    // Updates result counter
    resultsCount.textContent = `${transactions.length} result${transactions.length !== 1 ? 's' : ''} found.`;
 
    transactions.forEach(transaction => {
        const tr = document.createElement('tr');
 
        const typeBadge = transaction.type === 'INCOME'
            ? `<span class="badge-income">Income</span>`
            : `<span class="badge-expense">Expense</span>`;
 
        const categoryText = transaction.category
            ? transaction.category.charAt(0) + transaction.category.slice(1).toLowerCase()
            : '—';
 
        tr.innerHTML = `
            <td style="color: var(--color-text-muted); font-size: 0.82rem;">#${transaction.id}</td>
            <td>${transaction.description || '—'}</td>
            <td style="font-weight: 600;">${formatCurrency(transaction.amount)}</td>
            <td style="color: var(--color-text-muted);">${formatDate(transaction.date)}</td>
            <td>${typeBadge}</td>
            <td><span class="badge-category">${categoryText}</span></td>
        `;
 
        resultsTbody.appendChild(tr);
    });
}
 
function showState(state) {
    initialState.classList.add('d-none');
    loadingState.classList.add('d-none');
    emptyState.classList.add('d-none');
    resultsWrapper.classList.add('d-none');
 
    if (state === 'initial') initialState.classList.remove('d-none');
    if (state === 'loading') loadingState.classList.remove('d-none');
    if (state === 'empty') emptyState.classList.remove('d-none');
    if (state === 'results') resultsWrapper.classList.remove('d-none');
}