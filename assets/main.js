document.addEventListener('DOMContentLoaded', () => {
    const encoded = "aGltc2VsZkBndm96bm8uY29t";
    const target = document.getElementById('email-place');
    if (target) {
        const email = atob(encoded);
        const link = document.createElement('a');
        link.href = `mailto:${email}`;
        link.className = 'footer-email';
        link.textContent = email;
        target.appendChild(link);
    }
});