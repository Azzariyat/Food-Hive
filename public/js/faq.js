// faq.js

// Toggle FAQ function
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Close FAQ when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.faq-item')) {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Back button functionality
function goBack() {
    history.back();
}