document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for on-page anchor links
    const smoothScrollAnchors = document.querySelectorAll('a[href^="#"]');

    smoothScrollAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only proceed if the target is a valid anchor link (starts with # and is not just #)
            // and isn't specifically the donate modal trigger handled elsewhere.
            if (targetId.startsWith('#') && targetId.length > 1 && targetId !== '#open-donate-modal') { 
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Donation modal functionality (handled separately from general smooth scroll)
    const donateModal = document.getElementById('donate-modal');
    const openDonateModal = document.getElementById('open-donate-modal');
    const closeDonateModal = document.querySelector('.close-modal');
    const copyUpiButton = document.getElementById('copy-upi');
    const donorNameInput = document.getElementById('donor-name');
    const customAmountInput = document.getElementById('custom-amount');
    const donateButton = document.getElementById('donate-button');
    const quickDonateButtons = document.querySelectorAll('.quick-donate-btn');
    const nameError = document.getElementById('name-error');
    const amountError = document.getElementById('amount-error');
    const manualPayment = document.getElementById('manual-payment');


    let selectedAmount = 0;

    // Attach click handler only if the open modal button and modal exist
    if (openDonateModal && donateModal) {
        openDonateModal.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior (like scrolling to top if href is #)
            donateModal.style.display = 'flex';
             // Reset any previous states
            if (nameError) nameError.textContent = '';
            if (amountError) amountError.textContent = '';
            if (donorNameInput) donorNameInput.value = '';
            if (customAmountInput) customAmountInput.value = '';
            selectedAmount = 0;
            quickDonateButtons.forEach(btn => btn.classList.remove('selected'));
            if (manualPayment) manualPayment.style.display = 'none'; // Hide manual steps on opening
        });
    }

    if (closeDonateModal && donateModal) {
        closeDonateModal.addEventListener('click', () => {
            donateModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === donateModal) {
                donateModal.style.display = 'none';
            }
        });
    }

    // Copy UPI functionality
    if (copyUpiButton) {
        copyUpiButton.addEventListener('click', () => {
            navigator.clipboard.writeText('iamsirenjeev@oksbi')
                .then(() => {
                    copyUpiButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyUpiButton.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy UPI ID
                        `;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy UPI ID');
                });
        });
    }

    // Quick donate buttons
    if (quickDonateButtons) {
        quickDonateButtons.forEach(button => {
            button.addEventListener('click', () => {
                quickDonateButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                selectedAmount = parseInt(button.dataset.amount);
                if (customAmountInput) {
                    customAmountInput.value = selectedAmount;
                    if (amountError) amountError.textContent = ''; // Clear amount error on selecting quick amount
                }
            });
        });
    }

    // Custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            selectedAmount = parseInt(customAmountInput.value) || 0; // Use 0 if input is cleared or invalid
            quickDonateButtons.forEach(btn => btn.classList.remove('selected')); // Deselect quick buttons
             if (amountError && selectedAmount > 0) { // Clear amount error if a valid custom amount is entered
                 amountError.textContent = '';
             }
        });
    }


    // Donate button functionality
    if (donateButton) {
        donateButton.addEventListener('click', () => {
            const name = donorNameInput ? donorNameInput.value.trim() : '';
            const amount = selectedAmount; // Use the selectedAmount variable

            let isValid = true;

            if (!name) {
                if (nameError) {
                    nameError.textContent = 'Please enter your name';
                }
                isValid = false;
            } else if (nameError) {
                nameError.textContent = '';
            }

            // Check if selectedAmount is valid (either from quick button or custom input)
            if (!amount || amount <= 0) {
                if (amountError) {
                    amountError.textContent = 'Please select or enter a valid amount';
                }
                isValid = false;
            } else if (amountError) {
                amountError.textContent = '';
            }


            if (isValid) {
                const upiLink = `upi://pay?pa=iamsirenjeev@oksbi&pn=Sirenjeev&am=${amount}&cu=INR&tn=Focus Donation by ${encodeURIComponent(name)}`;
                window.location.href = upiLink;

                // Show manual payment section after attempting UPI link
                // Add a delay to allow the UPI app to potentially open
                if (manualPayment) {
                    setTimeout(() => {
                        manualPayment.style.display = 'block';
                    }, 1500); // Delay added
                }
            } else {
                 // If not valid, ensure manual payment is hidden initially or remains hidden
                 if (manualPayment) {
                     manualPayment.style.display = 'none';
                 }
            }
        });
    }

    // Clear name error on input
    if (donorNameInput) {
        donorNameInput.addEventListener('input', () => {
            if (nameError) {
                nameError.textContent = '';
            }
        });
    }

    // Logging to help with debugging
    console.log("Focus script loaded, checking for potential issues...");
    console.log("Smooth scrolling enabled for anchor links starting with '#' (excluding '#')");
    console.log("Donation modal logic initialized if elements exist.");
});