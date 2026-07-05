// ============ NAV SCROLL EFFECT ============
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ============ SCROLL REVEAL (IntersectionObserver) ============
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 90);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ============ BUTTON RIPPLE EFFECT ============
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });
});

// ============ FAQ ACCORDION ============
const faqBoxes = document.querySelectorAll('.faqbox');

faqBoxes.forEach(box => {
    const head = box.querySelector('.faqbox-head');
    const answer = box.querySelector('.faq-answer');

    head.addEventListener('click', () => {
        const isOpen = box.classList.contains('open');

        faqBoxes.forEach(other => {
            if (other !== box) {
                other.classList.remove('open');
                other.querySelector('.faqbox-head').setAttribute('aria-expanded', 'false');
                other.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        if (isOpen) {
            box.classList.remove('open');
            head.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = null;
        } else {
            box.classList.add('open');
            head.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
    });
});

// ============ AUTH MODAL ============
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const signInBtn = document.getElementById('signInBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const faqGetStartedBtn = document.getElementById('faqGetStartedBtn');
const switchModeBtn = document.getElementById('switchModeBtn');
const switchText = document.getElementById('switchText');
const modalTitle = document.getElementById('modalTitle');
const authForm = document.getElementById('authForm');
const modalSuccess = document.getElementById('modalSuccess');
const submitLabel = document.querySelector('.modal-submit .btn-label');
const successMsg = document.getElementById('successMsg');
const authEmail = document.getElementById('authEmail');
const heroEmail = document.getElementById('heroEmail');
const faqEmail = document.getElementById('faqEmail');

let mode = 'signin';

function setMode(newMode) {
    mode = newMode;
    if (mode === 'signin') {
        modalTitle.textContent = 'Sign In';
        submitLabel.textContent = 'Sign In';
        switchText.textContent = 'New to Netflix?';
        switchModeBtn.textContent = 'Sign up now';
    } else {
        modalTitle.textContent = 'Sign Up';
        submitLabel.textContent = 'Create Account';
        switchText.textContent = 'Already have an account?';
        switchModeBtn.textContent = 'Sign in';
    }
}

function openModal(initialMode, prefillEmail) {
    setMode(initialMode);
    authForm.style.display = 'block';
    modalSuccess.classList.remove('active');
    authForm.reset();
    document.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));

    if (prefillEmail) {
        authEmail.value = prefillEmail;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

signInBtn.addEventListener('click', () => openModal('signin'));
getStartedBtn.addEventListener('click', () => openModal('signup', heroEmail.value.trim()));
faqGetStartedBtn.addEventListener('click', () => openModal('signup', faqEmail.value.trim()));

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

switchModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(mode === 'signin' ? 'signup' : 'signin');
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailField = document.getElementById('authEmail');
    const passField = document.getElementById('authPassword');
    const emailWrap = emailField.closest('.field');
    const passWrap = passField.closest('.field');

    const emailValid = /^\S+@\S+\.\S+$/.test(emailField.value.trim());
    const passValid = passField.value.trim().length >= 4;

    emailWrap.classList.toggle('invalid', !emailValid);
    passWrap.classList.toggle('invalid', !passValid);

    if (!emailValid || !passValid) return;

    authForm.style.display = 'none';
    successMsg.textContent = mode === 'signin'
        ? 'Welcome back to Netflix.'
        : 'Your account is ready. Enjoy the show!';
    modalSuccess.classList.add('active');

    setTimeout(closeModal, 2200);
});