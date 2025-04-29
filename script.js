// Updated script to handle potential null elements more gracefully

// Smooth scrolling for on-page anchor links
document.addEventListener('DOMContentLoaded', () => {
    const smoothScrollAnchors = document.querySelectorAll('a[href^="#"]');

    smoothScrollAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only proceed if the target exists on the page
            if (targetId.startsWith('#') && targetId !== '#donate-modal') {
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

    // Hamburger menu toggle (only if elements exist)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
            hamburger.classList.toggle('is-active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            const isClickInside = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('is-active')) {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
            }
        });

        // Close menu when nav links are clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
            });
        });
    }
});

// Logging to help with debugging
console.log("Focus script loaded, checking for potential issues...");
console.log("Smooth scrolling enabled for anchor links starting with '#'");
console.log("Hamburger menu logic initialized if elements exist.");
console.log("Donation modal logic initialized.");

document.addEventListener('DOMContentLoaded', () => {
    const donateModal = document.getElementById('donate-modal');
    const openDonateModal = document.getElementById('open-donate-modal');
    const closeDonateModal = document.querySelector('.close-modal');
    const copyUpiButton = document.getElementById('copy-upi');

    // Open donate modal
    if (openDonateModal && donateModal) {
        openDonateModal.addEventListener('click', (e) => {
            e.preventDefault();
            donateModal.style.display = 'flex';
        });
    }

    // Close donate modal
    if (closeDonateModal && donateModal) {
        closeDonateModal.addEventListener('click', () => {
            donateModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === donateModal) {
                donateModal.style.display = 'none';
            }
        });
    }

    // Copy UPI ID
    if (copyUpiButton) {
        copyUpiButton.addEventListener('click', () => {
            navigator.clipboard.writeText('iamsirenjeev@oksbi').then(() => {
                alert('UPI ID copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy UPI ID');
            });
        });
    }
});