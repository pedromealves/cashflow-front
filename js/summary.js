
async function loadSummary() {
    try {
        // GET /transactions/summary
        const summary = await fetchSummary();
 
        // Fills in the cards using formatCurrency from api.js
        document.getElementById('income-value').textContent  = formatCurrency(summary.income);
        document.getElementById('expense-value').textContent = formatCurrency(summary.expense);
        document.getElementById('balance-value').textContent = formatCurrency(summary.balance);
 
        // Mensagem contextual baseada no saldo
        const balanceMsg = document.getElementById('balance-message');
        if (summary.balance > 0) {
            balanceMsg.textContent = '✅ Your income exceeds your expenses.';
            balanceMsg.style.color = 'var(--color-income)';
        } else if (summary.balance < 0) {
            balanceMsg.textContent = '⚠️ Your expenses exceed your income.';
            balanceMsg.style.color = 'var(--color-expense)';
        } else {
            balanceMsg.textContent = 'Income and expenses are balanced.';
        }
 
        // Shows cards and footer
        document.getElementById('loading-state').classList.add('d-none');
        document.getElementById('summary-cards').classList.remove('d-none');
        document.getElementById('summary-footer').classList.remove('d-none');
 
    } catch (error) {
        const message = error.message;
        const lowerMessage = message.charAt(0).toLowerCase() + message.slice(1);

        showToast('Failed to load summary: ' + lowerMessage, 'error');
        console.error(error);

        document.getElementById('loading-state').innerHTML = `
            <div class="text-danger">
                <i class="bi bi-exclamation-triangle"></i> 
                Unable to connect to server.
            </div>`;
    }
}

loadSummary();