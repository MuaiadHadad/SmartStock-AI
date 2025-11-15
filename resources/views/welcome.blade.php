<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'SmartStock AI') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

        <!-- Styles / Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <style>
                :root {
                    color-scheme: light;
                    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                        'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    --bg-gradient: radial-gradient(circle at 20% 20%, rgba(70, 203, 255, 0.35), transparent 45%),
                        radial-gradient(circle at 80% 0%, rgba(151, 71, 255, 0.45), transparent 55%),
                        radial-gradient(circle at 50% 100%, rgba(255, 168, 76, 0.4), transparent 65%),
                        linear-gradient(135deg, #0b172d 0%, #111b31 40%, #1d2a46 100%);
                    --glass-bg: rgba(11, 23, 45, 0.72);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --card-shadow: 0 22px 60px rgba(4, 14, 31, 0.45);
                    --text-primary: rgba(255, 255, 255, 0.96);
                    --text-muted: rgba(211, 225, 255, 0.76);
                    --brand-500: #60a5fa;
                    --brand-400: #93c5fd;
                    --brand-300: #bfdbfe;
                    --accent-500: #fbbf24;
                    --success-500: #34d399;
                    --danger-500: #f87171;
                    --shadow-soft: 0 18px 40px rgba(15, 31, 68, 0.38);
                    --blur-amount: 18px;
                    --section-width: min(1200px, 92vw);
                    --transition-base: cubic-bezier(0.22, 1, 0.36, 1);
                    --border-radius-lg: 28px;
                    --border-radius-md: 22px;
                    --border-radius-sm: 16px;
                }

                * {
                    box-sizing: border-box;
                }

                *::selection {
                    background: rgba(96, 165, 250, 0.35);
                    color: #0b172d;
                }

                html,
                body {
                    height: 100%;
                }

                body {
                    margin: 0;
                    font-family: var(--font-sans);
                    background: #060c1b;
                    color: var(--text-primary);
                    overflow-x: hidden;
                    position: relative;
                    min-height: 100vh;
                }

                .page-shell {
                    position: relative;
                    z-index: 0;
                    min-height: 100vh;
                    background: var(--bg-gradient);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-bottom: 120px;
                }

                .page-shell::before,
                .page-shell::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -2;
                    background: inherit;
                    filter: blur(70px);
                    opacity: 0.45;
                }

                .page-shell::after {
                    background: radial-gradient(circle at 15% 80%, rgba(236, 72, 153, 0.4), transparent 60%),
                        radial-gradient(circle at 85% 50%, rgba(59, 130, 246, 0.45), transparent 58%),
                        radial-gradient(circle at 60% -5%, rgba(56, 189, 248, 0.3), transparent 70%);
                    mix-blend-mode: screen;
                    filter: blur(90px);
                    opacity: 0.6;
                }

                .animated-gradient {
                    position: fixed;
                    inset: -120px;
                    background: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.35), transparent 55%),
                        radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.35), transparent 60%),
                        linear-gradient(140deg, rgba(13, 25, 48, 0.95), rgba(17, 33, 66, 0.9));
                    filter: blur(95px);
                    animation: gradientShift 18s ease-in-out infinite alternate;
                    z-index: -3;
                    opacity: 0.85;
                }

                @keyframes gradientShift {
                    0% {
                        transform: scale(1.05) translate3d(-4%, -2%, 0);
                    }
                    50% {
                        transform: scale(1.12) translate3d(4%, 4%, 0);
                    }
                    100% {
                        transform: scale(1.08) translate3d(-2%, 2%, 0);
                    }
                }

                .floating-shape {
                    position: absolute;
                    border-radius: 999px;
                    backdrop-filter: blur(calc(var(--blur-amount) * 0.6));
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(244, 114, 182, 0.12));
                    box-shadow: 0 18px 60px rgba(15, 32, 77, 0.48);
                    pointer-events: none;
                    mix-blend-mode: screen;
                    animation: float 20s ease-in-out infinite;
                }

                .floating-shape.shape-1 {
                    width: 380px;
                    height: 380px;
                    top: 8%;
                    right: 8%;
                }

                .floating-shape.shape-2 {
                    width: 260px;
                    height: 260px;
                    top: 52%;
                    left: 6%;
                    animation-duration: 24s;
                }

                .floating-shape.shape-3 {
                    width: 190px;
                    height: 190px;
                    bottom: 12%;
                    right: 18%;
                    animation-duration: 28s;
                }

                @keyframes float {
                    0% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    33% {
                        transform: translate3d(12px, -28px, 0) scale(1.04);
                    }
                    66% {
                        transform: translate3d(-18px, 32px, 0) scale(0.98);
                    }
                    100% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }

                .star-field {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: -1;
                }

                .star {
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.8);
                    opacity: 0;
                    transform: translate3d(0, 0, 0);
                    animation: twinkle 6s ease-in-out infinite;
                }

                @keyframes twinkle {
                    0%,
                    100% {
                        opacity: 0;
                        transform: translate3d(0, 0, 0) scale(0.8);
                    }
                    50% {
                        opacity: 1;
                        transform: translate3d(3px, -4px, 0) scale(1.2);
                    }
                }

                main {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 120px;
                }

                .hero {
                    width: var(--section-width);
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    align-items: center;
                    gap: 64px;
                    padding-top: 140px;
                    position: relative;
                }

                .hero__intro {
                    display: flex;
                    flex-direction: column;
                    gap: 22px;
                    position: relative;
                    z-index: 1;
                }

                .hero__badge {
                    align-self: flex-start;
                    background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(192, 132, 252, 0.28));
                    color: var(--brand-300);
                    padding: 8px 18px;
                    font-size: 0.82rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    border-radius: 999px;
                    border: 1px solid rgba(148, 163, 184, 0.22);
                    backdrop-filter: blur(12px);
                }

                .hero__title {
                    font-size: clamp(2.9rem, 3.8vw, 4.4rem);
                    letter-spacing: -0.03em;
                    margin: 0;
                    color: var(--text-primary);
                    text-shadow: 0 24px 60px rgba(8, 13, 28, 0.75);
                }

                .hero__description {
                    margin: 0;
                    font-size: 1.1rem;
                    line-height: 1.65;
                    color: var(--text-muted);
                    max-width: 540px;
                }

                .hero__actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 18px;
                }

                .button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 16px 26px;
                    border-radius: 999px;
                    font-weight: 600;
                    letter-spacing: 0.01em;
                    text-decoration: none;
                    transition: transform 0.6s var(--transition-base), box-shadow 0.6s var(--transition-base);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid transparent;
                }

                .button--primary {
                    background: linear-gradient(135deg, #60a5fa 0%, #2563eb 90%);
                    color: #0b1221;
                    box-shadow: 0 18px 34px rgba(37, 99, 235, 0.45);
                }

                .button--ghost {
                    background: rgba(15, 30, 60, 0.55);
                    color: var(--text-primary);
                    border: 1px solid rgba(148, 163, 184, 0.26);
                    backdrop-filter: blur(14px);
                    box-shadow: 0 18px 38px rgba(10, 17, 35, 0.4);
                }

                .button::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(120deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
                    opacity: 0;
                    transform: translateX(-40%) skewX(-12deg);
                    transition: opacity 0.6s var(--transition-base), transform 0.6s var(--transition-base);
                }

                .button:hover {
                    transform: translateY(-6px) scale(1.01);
                }

                .button:hover::after {
                    opacity: 0.35;
                    transform: translateX(40%) skewX(-12deg);
                }

                .button--ghost:hover {
                    border-color: rgba(148, 163, 184, 0.5);
                }

                .hero__metrics {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 22px;
                    margin-top: 28px;
                }

                .metric-card {
                    background: rgba(13, 26, 52, 0.75);
                    border-radius: var(--border-radius-sm);
                    padding: 22px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: var(--shadow-soft);
                    backdrop-filter: blur(14px);
                    position: relative;
                    overflow: hidden;
                }

                .metric-card::after {
                    content: '';
                    position: absolute;
                    inset: 4px;
                    border-radius: inherit;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    opacity: 0.4;
                    pointer-events: none;
                }

                .metric-card__value {
                    font-size: 1.9rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--brand-300);
                }

                .metric-card__label {
                    margin: 6px 0 0;
                    color: rgba(203, 213, 225, 0.75);
                    font-size: 0.95rem;
                }

                .metric-card__trend {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 16px;
                    font-size: 0.88rem;
                    color: rgba(16, 185, 129, 0.92);
                }

                .metric-card__trend svg {
                    width: 16px;
                    height: 16px;
                }

                .hero__visual {
                    position: relative;
                    display: grid;
                    gap: 32px;
                    justify-items: center;
                }

                .dashboard-card {
                    width: min(480px, 100%);
                    padding: 26px;
                    border-radius: var(--border-radius-lg);
                    background: rgba(12, 24, 48, 0.82);
                    border: 1px solid rgba(255, 255, 255, 0.09);
                    box-shadow: 0 40px 90px rgba(9, 13, 28, 0.7);
                    backdrop-filter: blur(16px);
                    position: relative;
                    overflow: hidden;
                }

                .dashboard-card::before {
                    content: '';
                    position: absolute;
                    inset: -40px 40px auto -40px;
                    height: 240px;
                    background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.45), transparent 65%);
                    opacity: 0.6;
                    pointer-events: none;
                }

                .dashboard-card header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    z-index: 1;
                    position: relative;
                }

                .dashboard-card__title {
                    font-size: 1.05rem;
                    color: var(--brand-300);
                    margin: 0;
                }

                .dashboard-card__status {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    background: rgba(15, 118, 110, 0.25);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    color: rgba(167, 243, 208, 0.9);
                    font-size: 0.78rem;
                }

                .sparkline {
                    height: 160px;
                    border-radius: 18px;
                    background: linear-gradient(160deg, rgba(59, 130, 246, 0.24), rgba(14, 165, 233, 0.18));
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 24px;
                }

                .sparkline svg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }

                .sparkline__point {
                    fill: rgba(255, 255, 255, 0.9);
                    stroke: rgba(59, 130, 246, 0.9);
                    stroke-width: 2;
                }

                .dashboard-card__footer {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 18px;
                    position: relative;
                }

                .dashboard-mini {
                    background: rgba(13, 28, 54, 0.7);
                    border-radius: 18px;
                    padding: 16px;
                    border: 1px solid rgba(148, 163, 184, 0.16);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .dashboard-mini strong {
                    color: rgba(191, 219, 254, 0.95);
                    font-weight: 600;
                }

                .dashboard-mini span {
                    color: rgba(203, 213, 225, 0.75);
                    font-size: 0.85rem;
                }

                .floating-gallery {
                    width: min(460px, 100%);
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }

                .floating-gallery__item {
                    position: relative;
                    border-radius: var(--border-radius-md);
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: var(--shadow-soft);
                    transform-origin: center;
                    background: rgba(15, 30, 60, 0.6);
                }

                .floating-gallery__item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 1.2s ease, filter 1.2s ease;
                }

                .floating-gallery__item::after {
                    content: attr(data-caption);
                    position: absolute;
                    left: 18px;
                    bottom: 18px;
                    font-size: 0.85rem;
                    color: rgba(226, 232, 240, 0.88);
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    padding: 8px 14px;
                    border-radius: 999px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(226, 232, 240, 0.16);
                }

                .floating-gallery__item:hover img {
                    transform: scale(1.08);
                    filter: saturate(1.2);
                }

                .section {
                    width: var(--section-width);
                    display: flex;
                    flex-direction: column;
                    gap: 36px;
                    position: relative;
                }

                .section__header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 24px;
                }

                .section__title {
                    margin: 0;
                    font-size: clamp(2rem, 2.8vw, 3rem);
                    color: var(--text-primary);
                }

                .section__description {
                    margin: 0;
                    color: var(--text-muted);
                    max-width: 520px;
                    font-size: 1rem;
                    line-height: 1.6;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 28px;
                }

                .feature-card {
                    background: rgba(12, 26, 52, 0.75);
                    padding: 32px;
                    border-radius: var(--border-radius-md);
                    border: 1px solid rgba(148, 163, 184, 0.18);
                    box-shadow: var(--shadow-soft);
                    display: grid;
                    gap: 18px;
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(14px);
                }

                .feature-card::before {
                    content: '';
                    position: absolute;
                    inset: -20% -20% auto auto;
                    width: 140px;
                    height: 140px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 68%);
                    opacity: 0.6;
                }

                .feature-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: rgba(96, 165, 250, 0.18);
                    display: grid;
                    place-items: center;
                    color: var(--brand-300);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                }

                .feature-card h3 {
                    margin: 0;
                    font-size: 1.3rem;
                }

                .feature-card p {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.6;
                    font-size: 0.97rem;
                }

                .feature-card ul {
                    margin: 0;
                    padding-left: 20px;
                    color: rgba(195, 210, 237, 0.85);
                    font-size: 0.92rem;
                    display: grid;
                    gap: 8px;
                }

                .analytics-showcase {
                    display: grid;
                    grid-template-columns: 1.15fr 0.85fr;
                    gap: 28px;
                    align-items: stretch;
                }

                .analytics-card {
                    background: rgba(12, 24, 48, 0.78);
                    border-radius: var(--border-radius-lg);
                    padding: 34px;
                    border: 1px solid rgba(148, 163, 184, 0.18);
                    box-shadow: var(--card-shadow);
                    position: relative;
                    overflow: hidden;
                    display: grid;
                    gap: 28px;
                }

                .analytics-card::after {
                    content: '';
                    position: absolute;
                    inset: auto 30px -90px -90px;
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 65%);
                    opacity: 0.5;
                }

                .analytics-card h3 {
                    margin: 0;
                    font-size: 1.45rem;
                    color: var(--brand-300);
                }

                .analytics-insights {
                    display: grid;
                    gap: 18px;
                }

                .insight-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 18px 20px;
                    border-radius: 18px;
                    background: rgba(13, 26, 52, 0.72);
                    border: 1px solid rgba(148, 163, 184, 0.18);
                }

                .insight-row strong {
                    color: rgba(191, 219, 254, 0.96);
                    font-size: 1.1rem;
                }

                .insight-row span {
                    color: rgba(96, 165, 250, 0.95);
                    font-weight: 600;
                }

                .timeline {
                    display: grid;
                    gap: 18px;
                    border-left: 2px dashed rgba(148, 163, 184, 0.25);
                    padding-left: 28px;
                }

                .timeline__step {
                    position: relative;
                }

                .timeline__step::before {
                    content: '';
                    position: absolute;
                    left: -39px;
                    top: 4px;
                    width: 14px;
                    height: 14px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #93c5fd, #60a5fa);
                    border: 3px solid rgba(15, 23, 42, 0.9);
                    box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.2);
                }

                .timeline__step h4 {
                    margin: 0 0 8px;
                    color: var(--text-primary);
                }

                .timeline__step p {
                    margin: 0;
                    color: var(--text-muted);
                    line-height: 1.6;
                }

                .gallery {
                    display: grid;
                    gap: 28px;
                }

                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 24px;
                }

                .gallery-card {
                    position: relative;
                    border-radius: var(--border-radius-md);
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(13, 25, 52, 0.75);
                    box-shadow: var(--shadow-soft);
                }

                .gallery-card img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 1.2s ease, filter 1.2s ease;
                }

                .gallery-card__label {
                    position: absolute;
                    left: 20px;
                    bottom: 20px;
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: rgba(15, 23, 42, 0.7);
                    color: rgba(226, 232, 240, 0.92);
                    font-size: 0.85rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border: 1px solid rgba(226, 232, 240, 0.2);
                }

                .gallery-card:hover img {
                    transform: scale(1.08);
                    filter: saturate(1.25);
                }

                .testimonials {
                    display: grid;
                    grid-template-columns: 0.95fr 1.05fr;
                    gap: 32px;
                }

                .testimonial-hero {
                    background: rgba(15, 30, 60, 0.7);
                    border-radius: var(--border-radius-lg);
                    padding: 34px;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    box-shadow: var(--card-shadow);
                    display: grid;
                    gap: 22px;
                    position: relative;
                    overflow: hidden;
                }

                .testimonial-hero::after {
                    content: '';
                    position: absolute;
                    inset: auto auto -120px 40px;
                    width: 260px;
                    height: 260px;
                    background: radial-gradient(circle, rgba(244, 114, 182, 0.35), transparent 70%);
                    opacity: 0.55;
                }

                .testimonial-hero blockquote {
                    margin: 0;
                    font-size: 1.2rem;
                    line-height: 1.7;
                    color: var(--text-muted);
                }

                .testimonial-hero cite {
                    font-style: normal;
                    color: rgba(191, 219, 254, 0.85);
                    font-weight: 600;
                }

                .testimonial-list {
                    display: grid;
                    gap: 18px;
                }

                .testimonial-card {
                    background: rgba(12, 24, 48, 0.7);
                    border-radius: var(--border-radius-md);
                    padding: 22px;
                    border: 1px solid rgba(148, 163, 184, 0.18);
                    display: grid;
                    gap: 14px;
                }

                .testimonial-card header {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(96, 165, 250, 0.8), rgba(244, 114, 182, 0.8));
                    display: grid;
                    place-items: center;
                    font-weight: 700;
                    color: #0b172d;
                }

                .rating {
                    color: rgba(250, 204, 21, 0.9);
                    letter-spacing: 0.12em;
                    font-size: 0.85rem;
                }

                .cta {
                    width: var(--section-width);
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(14, 165, 233, 0.14));
                    border-radius: var(--border-radius-lg);
                    border: 1px solid rgba(148, 163, 184, 0.24);
                    padding: 48px 54px;
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 38px;
                    align-items: center;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(14px);
                    position: relative;
                    overflow: hidden;
                }

                .cta::before {
                    content: '';
                    position: absolute;
                    inset: -40px 60% -40px -40px;
                    background: radial-gradient(circle, rgba(96, 165, 250, 0.32), transparent 70%);
                    opacity: 0.7;
                }

                .cta h2 {
                    margin: 0;
                    font-size: clamp(2rem, 2.6vw, 2.8rem);
                    color: var(--text-primary);
                }

                .cta p {
                    margin: 12px 0 0;
                    color: var(--text-muted);
                    line-height: 1.6;
                }

                .cta__actions {
                    display: grid;
                    gap: 18px;
                    justify-items: start;
                }

                footer {
                    width: var(--section-width);
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 34px;
                    color: var(--text-muted);
                    margin-top: 40px;
                }

                footer h4 {
                    margin: 0 0 14px;
                    font-size: 1rem;
                    color: var(--text-primary);
                }

                footer ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: grid;
                    gap: 10px;
                }

                footer a {
                    color: rgba(191, 219, 254, 0.85);
                    text-decoration: none;
                    transition: color 0.4s ease;
                }

                footer a:hover {
                    color: var(--brand-300);
                }

                [data-reveal] {
                    opacity: 0;
                    transform: translate3d(0, 24px, 0) scale(0.98);
                    transition: opacity 0.9s var(--transition-base), transform 0.9s var(--transition-base);
                    transition-delay: var(--reveal-delay, 0ms);
                }

                [data-reveal].is-visible {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                .parallax-item {
                    transition: transform 1.4s ease;
                }

                @media (max-width: 1200px) {
                    .hero {
                        grid-template-columns: 1fr;
                        padding-top: 120px;
                    }

                    .hero__visual {
                        order: -1;
                    }

                    .hero__metrics {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .feature-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .testimonials,
                    .analytics-showcase,
                    .cta {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 780px) {
                    .page-shell {
                        padding-bottom: 80px;
                    }

                    main {
                        gap: 80px;
                    }

                    .hero__title {
                        font-size: clamp(2.4rem, 9vw, 3.2rem);
                    }

                    .hero__actions {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .hero__metrics,
                    .feature-grid,
                    .gallery-grid,
                    footer {
                        grid-template-columns: 1fr;
                    }

                    .floating-gallery {
                        grid-template-columns: 1fr;
                    }

                    .section__header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .cta {
                        padding: 36px;
                    }

                    .cta__actions {
                        width: 100%;
                    }
                }

                @media (max-width: 520px) {
                    .hero {
                        gap: 44px;
                    }

                    .hero__badge {
                        font-size: 0.72rem;
                    }

                    .hero__metrics {
                        gap: 16px;
                    }

                    .feature-card,
                    .analytics-card,
                    .testimonial-hero,
                    .cta {
                        padding: 26px;
                    }

                    .button {
                        width: 100%;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            </style>
        @endif
    </head>
    <body class="antialiased">
        <div class="animated-gradient" aria-hidden="true"></div>
        <div class="page-shell">
            <div class="star-field" data-stars></div>
            <div class="floating-shape shape-1 parallax-item" data-parallax></div>
            <div class="floating-shape shape-2 parallax-item" data-parallax></div>
            <div class="floating-shape shape-3 parallax-item" data-parallax></div>

            <main>
                <header class="hero">
                    <div class="hero__intro" data-reveal>
                        <span class="hero__badge">Inteligência aumentada para o seu estoque</span>
                        <h1 class="hero__title">Domine sua cadeia de suprimentos com SmartStock AI</h1>
                        <p class="hero__description">
                            Antecipe demandas, otimize compras e impulsione margens com uma plataforma desenhada para o
                            futuro do varejo. Visualizações cinematográficas, insights acionáveis e automações guiadas
                            por IA elevam cada decisão que você toma.
                        </p>
                        <div class="hero__actions">
                            <a class="button button--primary" href="#experimente">
                                Começar agora
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M5 12h14m0 0-6-6m6 6-6 6"
                                        stroke="#0b1221"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </a>
                            <a class="button button--ghost" href="#demonstração">Ver demonstração</a>
                        </div>

                        <div class="hero__metrics">
                            <article class="metric-card" data-reveal data-reveal-delay="120">
                                <p class="metric-card__value">98,4%</p>
                                <p class="metric-card__label">Precisão de previsão</p>
                                <span class="metric-card__trend">
                                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path
                                            d="m2.5 9.5 3-3 3 3 4-4"
                                            stroke="currentColor"
                                            stroke-width="1.8"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    +12% vs. trimestre anterior
                                </span>
                            </article>
                            <article class="metric-card" data-reveal data-reveal-delay="220">
                                <p class="metric-card__value">-27%</p>
                                <p class="metric-card__label">Redução de rupturas</p>
                                <span class="metric-card__trend" style="color: rgba(248, 113, 113, 0.9)">
                                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path
                                            d="m2.5 6.5 3 3 3-3 4 4"
                                            stroke="currentColor"
                                            stroke-width="1.8"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    4x menos excesso de estoque
                                </span>
                            </article>
                            <article class="metric-card" data-reveal data-reveal-delay="320">
                                <p class="metric-card__value">36h</p>
                                <p class="metric-card__label">Automação semanal economizada</p>
                                <span class="metric-card__trend">
                                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path
                                            d="M3 9.5 5.5 12 13 4.5"
                                            stroke="currentColor"
                                            stroke-width="1.8"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    Equipe mais estratégica
                                </span>
                            </article>
                        </div>
                    </div>

                    <div class="hero__visual">
                        <article class="dashboard-card parallax-item" data-parallax data-reveal data-reveal-delay="160">
                            <header>
                                <h2 class="dashboard-card__title">Visão geral dinâmica</h2>
                                <span class="dashboard-card__status">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M12 8v4l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>
                                    Tempo real
                                </span>
                            </header>
                            <div class="sparkline" aria-hidden="true">
                                <svg viewBox="0 0 480 160" role="presentation">
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                            <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.2" />
                                            <stop offset="50%" stop-color="#34d399" stop-opacity="0.35" />
                                            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.3" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0 120 C60 150, 120 40, 180 65 S300 130, 360 85 420 40, 480 70"
                                        stroke="url(#lineGradient)"
                                        stroke-width="6"
                                        fill="none"
                                        stroke-linecap="round"
                                    />
                                    <circle class="sparkline__point" cx="120" cy="52" r="6" />
                                    <circle class="sparkline__point" cx="260" cy="112" r="6" />
                                    <circle class="sparkline__point" cx="420" cy="58" r="6" />
                                </svg>
                            </div>
                            <footer class="dashboard-card__footer">
                                <div class="dashboard-mini">
                                    <strong>Reposição automática</strong>
                                    <span>Pedidos sugeridos com base em IA a cada hora</span>
                                </div>
                                <div class="dashboard-mini">
                                    <strong>Alertas proativos</strong>
                                    <span>3 itens críticos com ruptura prevista em 48h</span>
                                </div>
                                <div class="dashboard-mini">
                                    <strong>Saúde da margem</strong>
                                    <span>+8,6% de margem sobre categorias otimizadas</span>
                                </div>
                            </footer>
                        </article>

                        <div class="floating-gallery" data-reveal data-reveal-delay="260">
                            <figure
                                class="floating-gallery__item parallax-item"
                                data-parallax
                                data-caption="Equipe feliz"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
                                    alt="Equipe celebrando insights de dados"
                                    loading="lazy"
                                />
                            </figure>
                            <figure
                                class="floating-gallery__item parallax-item"
                                data-parallax
                                data-caption="Estoque enxuto"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1585386959984-a4155228ef44?auto=format&fit=crop&w=900&q=80"
                                    alt="Prateleiras organizadas com produtos"
                                    loading="lazy"
                                />
                            </figure>
                            <figure
                                class="floating-gallery__item parallax-item"
                                data-parallax
                                data-caption="Painel criativo"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                                    alt="Representação artística de dados"
                                    loading="lazy"
                                />
                            </figure>
                            <figure
                                class="floating-gallery__item parallax-item"
                                data-parallax
                                data-caption="Entrega veloz"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                                    alt="Transporte logístico futurista"
                                    loading="lazy"
                                />
                            </figure>
                        </div>
                    </div>
                </header>

                <section class="section" id="demonstração">
                    <div class="section__header" data-reveal>
                        <div>
                            <h2 class="section__title">Uma experiência visual feita para encantar</h2>
                            <p class="section__description">
                                Dashboards fluídos, animações suaves e widgets inteligentes criam uma narrativa visual
                                irresistível. Cada elemento foi desenhado para guiar seus olhos e acelerar decisões.
                            </p>
                        </div>
                        <a class="button button--ghost" href="#experimente">Tour guiado</a>
                    </div>
                    <div class="feature-grid">
                        <article class="feature-card" data-reveal>
                            <span class="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-5v5l3 3"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                            <h3>Simulações animadas</h3>
                            <p>
                                Ajuste cenários com arrastar e soltar, visualize impactos em tempo real e experimente a
                                magia de curvas suaves ilustrando tendências.
                            </p>
                            <ul>
                                <li>Modelos com IA generativa para prever sazonalidade</li>
                                <li>Comparação visual entre múltiplos centros de distribuição</li>
                                <li>Snapshots com animações exportáveis para apresentações</li>
                            </ul>
                        </article>
                        <article class="feature-card" data-reveal data-reveal-delay="160">
                            <span class="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M12 3v18M6 7l12 10M18 7 6 17"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                            <h3>Arte generativa aplicada</h3>
                            <p>
                                Combine dados e storytelling com ilustrações geradas automaticamente, trazendo vida às
                                suas apresentações para diretoria.
                            </p>
                            <ul>
                                <li>Templates interativos com camadas animadas</li>
                                <li>Paletas cromáticas dinâmicas para diferentes times</li>
                                <li>Integrações com bibliotecas criativas e Figma</li>
                            </ul>
                        </article>
                        <article class="feature-card" data-reveal data-reveal-delay="260">
                            <span class="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M4 6h16v12H4z"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="m4 10 5.5 3 3.5-2 6 3"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                            <h3>Colaboração coreografada</h3>
                            <p>
                                Convide sua equipe, crie anotações animadas e assista a decisões coletivas acontecerem
                                com sincronização perfeita.
                            </p>
                            <ul>
                                <li>Painéis coeditáveis com cursores animados</li>
                                <li>Replay de decisões com linha do tempo interativa</li>
                                <li>Integração com Slack, Teams e Notion</li>
                            </ul>
                        </article>
                    </div>
                </section>

                <section class="section" id="experimente">
                    <div class="analytics-showcase">
                        <article class="analytics-card" data-reveal>
                            <h3>Insights que dançam com seus dados</h3>
                            <p class="section__description">
                                O motor SmartPulse encontra padrões escondidos, revela oportunidades de cross-selling e
                                sugere campanhas com visualizações cinematográficas em 3D.
                            </p>
                            <div class="analytics-insights">
                                <div class="insight-row">
                                    <strong>Reposições inteligentes</strong>
                                    <span>+22% velocidade</span>
                                </div>
                                <div class="insight-row">
                                    <strong>Curva ABC animada</strong>
                                    <span>Atualizada a cada hora</span>
                                </div>
                                <div class="insight-row">
                                    <strong>Alertas preditivos</strong>
                                    <span>-41% rupturas</span>
                                </div>
                            </div>
                        </article>
                        <aside class="timeline" data-reveal data-reveal-delay="200">
                            <div class="timeline__step">
                                <h4>1. Conecte seus ERPs</h4>
                                <p>Importe dados históricos em minutos com conectores prontos para os principais ERPs.</p>
                            </div>
                            <div class="timeline__step">
                                <h4>2. Gere playlists de insights</h4>
                                <p>
                                    Escolha objetivos estratégicos e receba playlists animadas de recomendações para cada
                                    time.
                                </p>
                            </div>
                            <div class="timeline__step">
                                <h4>3. Orquestre execuções</h4>
                                <p>Transforme previsões em planos de ação integrados com um clique.</p>
                            </div>
                        </aside>
                    </div>
                </section>

                <section class="section gallery">
                    <div class="section__header" data-reveal>
                        <div>
                            <h2 class="section__title">Galeria de criações e cenários</h2>
                            <p class="section__description">
                                Misture fotos reais, artes digitais e gráficos generativos para inspirar o próximo ciclo
                                de inovação.
                            </p>
                        </div>
                        <span class="hero__badge" style="margin-bottom: 6px">Curadoria atualizada semanalmente</span>
                    </div>
                    <div class="gallery-grid" data-reveal data-reveal-delay="140">
                        <figure class="gallery-card">
                            <img
                                src="https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80"
                                alt="Representação artística de armazém futurista"
                                loading="lazy"
                            />
                            <figcaption class="gallery-card__label">Futuro do varejo</figcaption>
                        </figure>
                        <figure class="gallery-card">
                            <img
                                src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80"
                                alt="Equipe analisando dados em ambiente criativo"
                                loading="lazy"
                            />
                            <figcaption class="gallery-card__label">Squad estratégico</figcaption>
                        </figure>
                        <figure class="gallery-card">
                            <img
                                src="https://images.unsplash.com/photo-1526481280695-3c469dc9b40c?auto=format&fit=crop&w=900&q=80"
                                alt="Ilustração digital vibrante com gráficos"
                                loading="lazy"
                            />
                            <figcaption class="gallery-card__label">Arte generativa</figcaption>
                        </figure>
                    </div>
                </section>

                <section class="section">
                    <div class="testimonials">
                        <article class="testimonial-hero" data-reveal>
                            <h3 class="section__title">Clientes encantados</h3>
                            <blockquote>
                                “A SmartStock AI transformou nossa operação: os dashboards parecem cenas de filme e a IA
                                indica exatamente onde agir. Reduzimos perdas em tempo recorde.”
                            </blockquote>
                            <cite>Fernanda Souza — Diretora de Supply Chain, SuperNova Market</cite>
                            <span class="rating">★★★★★</span>
                        </article>
                        <div class="testimonial-list">
                            <article class="testimonial-card" data-reveal data-reveal-delay="120">
                                <header>
                                    <span class="avatar">RA</span>
                                    <div>
                                        <strong>Renato Alves</strong>
                                        <p style="margin: 4px 0 0; color: rgba(203, 213, 225, 0.75)">
                                            Head de Operações — Veloce Pharma
                                        </p>
                                    </div>
                                </header>
                                <p style="margin: 0; color: var(--text-muted)">
                                    “Os relatórios animados fazem qualquer reunião parecer uma premiere. A equipe adora e
                                    as decisões são tomadas na metade do tempo.”
                                </p>
                            </article>
                            <article class="testimonial-card" data-reveal data-reveal-delay="220">
                                <header>
                                    <span class="avatar">MS</span>
                                    <div>
                                        <strong>Marina Santos</strong>
                                        <p style="margin: 4px 0 0; color: rgba(203, 213, 225, 0.75)">
                                            COO — Rede VivaBem
                                        </p>
                                    </div>
                                </header>
                                <p style="margin: 0; color: var(--text-muted)">
                                    “Integramos lojas físicas e e-commerce sem esforço. A IA cria campanhas visuais que
                                    inspiram nossos times e aumentam a receita.”
                                </p>
                            </article>
                            <article class="testimonial-card" data-reveal data-reveal-delay="320">
                                <header>
                                    <span class="avatar">TL</span>
                                    <div>
                                        <strong>Thiago Lima</strong>
                                        <p style="margin: 4px 0 0; color: rgba(203, 213, 225, 0.75)">
                                            Diretor de Logística — Mega Distribuidora
                                        </p>
                                    </div>
                                </header>
                                <p style="margin: 0; color: var(--text-muted)">
                                    “Nunca vimos uma ferramenta combinar tanta arte com ciência. As simulações animadas
                                    guiam cada rota de entrega.”
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section class="cta" data-reveal>
                    <div>
                        <h2>Pronto para coreografar o futuro do seu estoque?</h2>
                        <p>
                            Solicite uma demonstração exclusiva com nossa equipe de especialistas em dados, design e
                            supply chain. Em 30 minutos você terá um plano iluminado por IA para transformar sua operação.
                        </p>
                    </div>
                    <div class="cta__actions">
                        <a class="button button--primary" href="mailto:contato@smartstock.ai">Falar com especialistas</a>
                        <a class="button button--ghost" href="#">Baixar one-pager animado</a>
                    </div>
                </section>

                <footer>
                    <div>
                        <h4>SmartStock AI</h4>
                        <p style="margin: 0; color: var(--text-muted)">
                            A plataforma que une ciência de dados, storytelling e automação para cadeias de suprimentos
                            visionárias.
                        </p>
                    </div>
                    <div>
                        <h4>Recursos</h4>
                        <ul>
                            <li><a href="#demonstração">Tour interativo</a></li>
                            <li><a href="#experimente">Funcionalidades</a></li>
                            <li><a href="#">Blog e inspirações</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Contato</h4>
                        <ul>
                            <li><a href="mailto:contato@smartstock.ai">contato@smartstock.ai</a></li>
                            <li><a href="tel:+551199999999">+55 (11) 99999-9999</a></li>
                            <li><a href="#">Política de privacidade</a></li>
                        </ul>
                    </div>
                </footer>
            </main>
        </div>

        @if (!(file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot'))))
            <script>
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
            </script>
        @endif
    </body>
</html>
