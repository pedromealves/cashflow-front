
const form = document.getElementById('create-form');
const submitBtn = document.getElementById('submit-btn');

// Prevent reload after form submit
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clean previous erros before validating again
    clearErrors();

    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const date        = document.getElementById('date').value;
    const type        = document.getElementById('type').value;
    const category    = document.getElementById('category').value;

    if (!validateFields(description, amount, type, category)) {
        return;
    }

    // Builds up the object to be sent to the backend
    const transactionData = {
        description: description,
        amount: parseFloat(amount),
        date: date || null,
        type: type,
        category: category
    };

    setLoading(true);

    try {
        await createTransaction(transactionData) 
        
        showToast('Transaction created successfully', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        const message = error.message;
        const lowerMessage = message.charAt(0).toLowerCase() + message.slice(1);

        showToast('Failed to create transaction: ' + lowerMessage, 'error');
        console.error('Error:', error);
        setLoading(false);
    }
});

function validateFields(description, amount, type, category) {
    let isValid = true;

    if (!description) {
        showError('error-description');
        isValid = false;
    }

    if(!amount || parseFloat(amount) <= 0) {
        showError('error-amount');
        isValid = false;
    }

    if (!type) {
        showError('error-type');
        isValid = false;
    }

    if(!category) {
        showError('error-category');
        isValid = false;
    }

    return isValid;
}

function showError(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'block';
}

function clearErrors() {
    document.querySelectorAll('.cf-error').forEach(el => {
        el.style.display = 'none';
    });
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="cf-spinner" style="width:14px;height:14px;border-width:2px;"></span> Saving...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Create Transaction';
    }
}

