import Script from 'next/script';

export function ThemeScript() {
  const inline = `
    (function() {
      try {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var stored = localStorage.getItem('theme');
        var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
        var root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        root.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;

  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {inline}
    </Script>
  );
}
