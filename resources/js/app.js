import './bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px', threshold: 0.2 }
        );

        revealElements.forEach((element) => {
            const delay = element.getAttribute('data-reveal-delay');
            if (delay) {
                element.style.setProperty('--reveal-delay', `${delay}ms`);
            }
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }

    const parallaxItems = document.querySelectorAll('[data-parallax]');
    if (!prefersReducedMotion && parallaxItems.length) {
        const parallaxStrength = 18;
        const applyParallax = (event) => {
            const { innerWidth: width, innerHeight: height } = window;
            const offsetX = (event.clientX / width - 0.5) * parallaxStrength;
            const offsetY = (event.clientY / height - 0.5) * parallaxStrength;

            parallaxItems.forEach((item, index) => {
                const depth = (index + 1) / parallaxItems.length;
                const translateX = offsetX * depth;
                const translateY = offsetY * depth;
                item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            });
        };

        window.addEventListener('pointermove', applyParallax);
    }

    const starField = document.querySelector('[data-stars]');
    if (starField && starField.children.length === 0) {
        const starTotal = 80;
        for (let i = 0; i < starTotal; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 6}s`;
            star.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
            starField.appendChild(star);
        }
    }
});
