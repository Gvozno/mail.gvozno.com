
document.addEventListener('DOMContentLoaded', () => {

    const emails = {
        support:  atob('ZWNob0Bndm96bm8uY29t'),
        business: atob('bmV4dXNAZ3Zvem5vLmNvbQ=='),
        abuse:    atob('YWJ1c2VAZ3Zvem5vLmNvbQ=='),
        legal:    atob('ZG1jYUBndm96bm8uY29t')
    };

    document.querySelectorAll('.support-buttons .btn[data-key]').forEach(btn => {
        const key = btn.dataset.key;
        const email = emails[key];

        if (email) {
            btn.href = `mailto:${email}`;
            btn.setAttribute('title', `Send to ${email}`);

        } else {
            console.warn(`No email found for data-key: "${key}"`);
            btn.style.opacity = '0.5';
            btn.title = 'Email not configured';
        }
    });
});