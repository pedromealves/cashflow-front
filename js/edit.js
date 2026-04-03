
const loadingState = document.getElementById('loading-state');
const errorState   = document.getElementById('error-state');
const formCard     = document.getElementById('form-card');
const form         = document.getElementById('edit-form');
const submitBtn    = document.getElementById('submit-btn');

let transactionId = null;

const urlParams = new URLSearchParams(window.location.search);
const idFromUrl = urlParams.get('id'); 

async function init() {
    if (!idFromUrl) {
        showState('error');
        return;
    }
 
    transactionId = parseInt(idFromUrl);
 
    // Updates titles with ID
    document.getElementById('transaction-id-title').textContent = `#${transactionId}`;
 
    try {
        const transaction = await fetchTransactionById(transactionId);
        populateForm(transaction);
        showState('form');
 
    } catch (error) {
        showState('error');
        console.error('Failed to load transaction:', error);
    }
}

function populateForm(transaction) {
    document.getElementById('description').value = transaction.description || '';
    document.getElementById('amount').value = transaction.amount || '';
    document.getElementById('date').value = transaction.date || '';
 
    document.getElementById('type').value = transaction.type || '';
    document.getElementById('category').value = transaction.category || '';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
 
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
 
    if (!validateFields(description, amount, type, category)) {
        return;
    }
 
    const updatedData = {
        description: description,
        amount: parseFloat(amount),
        date: date || null,
        type: type,
        category: category
    };
 
    setLoading(true);
 
    try {
        await updateTransaction(transactionId, updatedData);
        showToast('Transaction updated successfully!', 'success');
 
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
 
    } catch (error) {
        const message = error.message;
        const lowerMessage = message.charAt(0).toLowerCase() + message.slice(1);
        
        showToast('Failed to update: ' + lowerMessage, 'error');
        setLoading(false);
    }
});

function validateFields(description, amount, type, category) {
    let isValid = true;
    
    if (!description) { 
        showError('error-description'); 
        isValid = false; 
    }
    
    if (!amount || parseFloat(amount) <= 0) { 
        showError('error-amount'); 
        isValid = false; 
    }
    
    if (!type) { 
        showError('error-type');       
        isValid = false; 
    }
    
    if (!category) { 
        showError('error-category');   
        isValid = false; 
    }
    
    return isValid;
}

function showError(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

function clearErrors() {
    document.querySelectorAll('.cf-error').forEach(el => el.style.display = 'none');
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="cf-spinner" style="width:14px;height:14px;border-width:2px;"></span> Saving...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Saving Changes';
    }
}

function showState(state) {
    loadingState.classList.add('d-none');
    errorState.classList.add('d-none');
    formCard.classList.add('d-none');
 
    if (state === 'loading') loadingState.classList.remove('d-none');
    if (state === 'error')   errorState.classList.remove('d-none');
    if (state === 'form')    formCard.classList.remove('d-none');
}

init();

