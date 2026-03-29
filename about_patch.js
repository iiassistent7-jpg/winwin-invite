// ── Win-Win about.html patch: детект зарегистрированного пользователя ────
(function() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const fromCabinet = params.get('from') === 'cabinet';
    const lang = params.get('lang') || 'ru';

    if (!token && !fromCabinet) return; // обычный посетитель — ничего не делаем

    // Ждём загрузки DOM
    function patchButtons() {
        // Скрываем все кнопки "Присоединиться" / "Join" / "להצטרף"
        const joinTexts = ['присоединиться', 'join', 'להצטרף', 'انضم', 'зарегистрироваться', 'register'];
        document.querySelectorAll('a, button').forEach(el => {
            const txt = (el.textContent || '').toLowerCase().trim();
            if (joinTexts.some(t => txt.includes(t))) {
                el.style.display = 'none';
            }
        });

        // Добавляем кнопку "Назад в кабинет" внизу страницы
        const backLabels = {
            ru: '← Вернуться в кабинет',
            he: '← חזרה ללוח',
            en: '← Back to Cabinet',
            ar: '← العودة إلى اللوحة',
        };

        const btn = document.createElement('a');
        btn.href = token
            ? `https://invite.winwinnetwork.pro/dashboard.html?token=${token}&lang=${lang}`
            : 'javascript:history.back()';
        btn.textContent = backLabels[lang] || backLabels.ru;
        btn.style.cssText = [
            'display:block', 'width:calc(100% - 32px)', 'max-width:398px',
            'margin:24px auto 40px', 'padding:16px', 'border-radius:16px',
            'background:#25D366', 'color:#fff', 'text-align:center',
            'font-weight:700', 'font-size:1rem', 'text-decoration:none',
            'font-family:Inter,sans-serif',
        ].join(';');

        // Вставляем в конец body
        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchButtons);
    } else {
        patchButtons();
    }
})();
