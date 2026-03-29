// ── Win-Win business.html patch: этап взятия в работу + статистика ────────
// Подключить: <script src="business_patch.js"></script> перед </body>

(function() {
    // Ждём загрузки bizData
    const _origFetch = window.fetchData;
    
    // ── 1. Патч renderDeals: добавляем кнопку "Взять в работу" для new ──
    const _origRenderDeals = window.renderDeals;
    window.renderDeals = function() {
        if (typeof _origRenderDeals === 'function') _origRenderDeals();
        
        // Находим карточки со статусом "new" и добавляем кнопку
        const container = document.getElementById('dealsContainer');
        if (!container) return;
        
        // Находим все deal-card без кнопки управления
        container.querySelectorAll('.deal-card').forEach(card => {
            const badge = card.querySelector('.status-badge');
            if (!badge) return;
            const statusText = badge.textContent.trim();
            // Статус "Новая" на разных языках
            const isNew = ['Новая','New','חדשה','جديد'].some(t => statusText.includes(t));
            if (!isNew) return;
            // Проверяем нет ли уже кнопки
            if (card.querySelector('.btn-accept')) return;
            // Достаём deal id из кнопки Управлять
            const manageBtn = card.querySelector('.btn-action[onclick*="openManageDeal"]');
            if (!manageBtn) return;
            const match = manageBtn.getAttribute('onclick').match(/openManageDeal\((\d+)\)/);
            if (!match) return;
            const dealId = match[1];
            
            // Добавляем кнопку "Взять в работу" перед "Управлять"
            const acceptBtn = document.createElement('button');
            acceptBtn.className = 'btn-action btn-accept';
            acceptBtn.style.cssText = 'background:rgba(39,174,96,0.15);color:var(--green);border-color:rgba(39,174,96,0.3);margin-bottom:8px;';
            acceptBtn.innerHTML = '<i data-feather="check" style="width:16px;height:16px;"></i> Взять в работу';
            acceptBtn.onclick = () => acceptDeal(parseInt(dealId));
            manageBtn.parentNode.insertBefore(acceptBtn, manageBtn);
            
            if (typeof feather !== 'undefined') feather.replace();
        });
    };

    // ── 2. Функция принятия сделки в работу ─────────────────────────────
    window.acceptDeal = async function(dealId) {
        const btn = event.target.closest('button');
        if (btn) { btn.disabled = true; btn.textContent = '...'; }
        try {
            const token = new URLSearchParams(window.location.search).get('token');
            const res = await fetch(`https://amlatsa-bot-production.up.railway.app/api/deals/action`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ token, deal_id: dealId, action: 'accept' })
            });
            if (res.ok) {
                // Обновляем данные с сервера
                await fetchDataRefresh();
            } else {
                alert('Ошибка. Попробуйте ещё раз.');
                if (btn) { btn.disabled = false; btn.textContent = 'Взять в работу'; }
            }
        } catch(e) {
            alert('Ошибка сети.');
            if (btn) { btn.disabled = false; }
        }
    };

    // ── 3. Перезагружаем данные с сервера после любого action ───────────
    window.fetchDataRefresh = async function() {
        const token = new URLSearchParams(window.location.search).get('token');
        try {
            const res = await fetch(`https://amlatsa-bot-production.up.railway.app/api/business?token=${token}`);
            if (!res.ok) return;
            window.bizData = await res.json();
            if (typeof renderAll === 'function') renderAll();
        } catch(e) {
            console.error('fetchDataRefresh error:', e);
        }
    };

    // ── 4. Патч submitDealAction: после успеха — перезагружаем данные ───
    const _origSubmit = window.submitDealAction;
    window.submitDealAction = async function(actionType) {
        if (typeof _origSubmit === 'function') await _origSubmit(actionType);
        // После любого успешного действия — обновляем статистику с сервера
        setTimeout(fetchDataRefresh, 1500);
    };

    console.log('[business_patch] loaded');
})();
