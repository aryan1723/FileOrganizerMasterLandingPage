document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Video Modal Logic ---
    const modal = document.getElementById('video-modal');
    const btnWatchDemo = document.querySelector('.btn-watch-demo');
    const closeBtn = document.querySelector('.close-modal');

    btnWatchDemo.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // --- 2. Engine Room Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const codeBlocks = document.querySelectorAll('.code-block');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            codeBlocks.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 3. Like Counter implementation with anti-spam ---
    const likeBtn = document.getElementById('like-btn');
    const likeCountDisplay = document.getElementById('like-count');
    const likeMsg = document.getElementById('like-msg');

    const BASE_LIKES = 0;
    const NAMESPACE = 'aryan1723';
    const KEY = 'fomomaster_real_likes_v1';

    // Initial load
    let hasLiked = localStorage.getItem('fomo_has_liked') === 'true';

    // Fetch initial count
    fetch(`https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`)
        .then(response => response.json())
        .then(data => {
            const count = data.value || 0;
            likeCountDisplay.textContent = BASE_LIKES + count;
        })
        .catch(err => {
            console.error('Error fetching like count:', err);
            likeCountDisplay.textContent = BASE_LIKES;
        });

    if (hasLiked) {
        likeBtn.classList.add('liked');
    }

    likeBtn.addEventListener('click', () => {
        if (hasLiked) {
            // Already liked effect
            likeBtn.style.transform = 'scale(1)';
            setTimeout(() => likeBtn.style.transform = '', 100);
            likeMsg.textContent = "You already liked this!";
            likeMsg.classList.add('show');
            setTimeout(() => likeMsg.classList.remove('show'), 2000);
            return;
        }

        hasLiked = true;
        localStorage.setItem('fomo_has_liked', 'true');
        likeBtn.classList.add('liked');

        // Optimistic UI update
        const currentCount = parseInt(likeCountDisplay.textContent) || BASE_LIKES;
        likeCountDisplay.textContent = currentCount + 1;

        // Hit API
        fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`)
            .then(response => response.json())
            .then(data => {
                likeCountDisplay.textContent = BASE_LIKES + data.value;
            })
            .catch(err => console.error('Error incrementing like count:', err));

        // Celebration msg
        likeMsg.textContent = "Thanks for the support!";
        likeMsg.classList.add('show');
        setTimeout(() => likeMsg.classList.remove('show'), 2000);
    });


    // --- 4. Contact Form Submission Logic ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button');
        const origText = submitBtn.textContent;
        submitBtn.textContent = "SENDING...";
        submitBtn.disabled = true;

        // Send email via EmailJS
        // Note: 'YOUR_PUBLIC_KEY' must be replaced with the actual Public Key from EmailJS Account > API Keys
        emailjs.sendForm('service_6llrti9', 'template_ytf53yp', contactForm, 'B402yNyQpyKQH_kzb')
            .then(() => {
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
                contactForm.reset();
            }, (error) => {
                console.error('EmailJS Error:', error);
                submitBtn.textContent = "Error! Try Again";
                setTimeout(() => {
                    submitBtn.textContent = origText;
                    submitBtn.disabled = false;
                }, 3000);
            });
    });

    resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        formSuccess.classList.add('hidden');
        contactForm.classList.remove('hidden');
    });


    // --- 5. Pico Chat Simulation ---
    const chatFeed = document.getElementById('chat-feed');
    const messages = [
        "THIS IS PICO",
        "PICO THINKS YOU ARE SMART",
        "PICO WILL BE REALLY HAPPY IF YOU SHARE AND GIVE A LIKE TO THIS PROJECT",
        "YOU DID WHAT PICO SAID, RIGHT??"
    ];

    let msgIndex = 0;

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatFeed.appendChild(indicator);
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function addMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg';
        msgDiv.textContent = text;
        chatFeed.appendChild(msgDiv);
    }

    function processNextMessage() {
        if (msgIndex >= messages.length) return; // Done

        // Show typing
        showTypingIndicator();

        // Random typing delay (1s to 2.5s)
        const typingDelay = Math.random() * 150 + 1000;

        setTimeout(() => {
            removeTypingIndicator();
            addMessage(messages[msgIndex]);
            msgIndex++;

            // Random pause before next message starts typing (0.5s to 1.5s)
            const pauseDelay = Math.random() * 1000 + 500;
            setTimeout(processNextMessage, pauseDelay);

        }, typingDelay);
    }

    // Initialize Pico Chat simulation using IntersectionObserver
    // so it starts only when user scrolls to it
    const chatObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(processNextMessage, 1000); // Small initial delay
            chatObserver.disconnect(); // Only run once
        }
    }, { threshold: 0.5 });

    const picoContainer = document.querySelector('.pico-chat-container');
    if (picoContainer) {
        chatObserver.observe(picoContainer);
    }

    // --- 6. Footer Text Modal ---
    const textModal = document.getElementById('text-modal');
    if (textModal) {
        const footerLinks = document.querySelectorAll('.footer-link');
        const textModalCloseBtn = textModal.querySelector('.close-modal');
        const modalTitle = document.getElementById('text-modal-title');
        const modalContent = document.getElementById('text-modal-content');

        const modalData = {
            privacy: { title: "Privacy Policy", content: "Your privacy is important to us. This is a mockup privacy policy for your application. No data is stored or transmitted without your explicit consent." },
            terms: { title: "Terms of Service", content: "By using FileOrganizerMaster, you agree to organize your files locally. We are not responsible for accidental overwrites, although our safety logic prevents it!" },
            docs: { title: "Documentation", content: "Please visit our GitHub repository to view detailed documentation, Java classes, and configuration guides." }
        };

        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = link.getAttribute('data-type');
                if (modalData[type]) {
                    modalTitle.textContent = modalData[type].title;
                    modalContent.textContent = modalData[type].content;
                    textModal.classList.add('show');
                }
            });
        });

        textModalCloseBtn.addEventListener('click', () => {
            textModal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === textModal) {
                textModal.classList.remove('show');
            }
        });
    }

    // --- 7. Coffee Modal ---
    const coffeeBtn = document.querySelector('.buy-coffee-btn');
    const coffeeModal = document.getElementById('coffee-modal');

    if (coffeeBtn && coffeeModal) {
        const coffeeCloseBtn = document.getElementById('coffee-close');

        coffeeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            coffeeModal.classList.add('show');
        });

        coffeeCloseBtn.addEventListener('click', () => {
            coffeeModal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === coffeeModal) {
                coffeeModal.classList.remove('show');
            }
        });
    }

});
