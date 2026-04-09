(function(global) {
    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function render(options) {
        const opts = options || {};
        const dealId = opts.dealId;
        const choices = Array.isArray(opts.choices) ? opts.choices : [];
        const buttonClass = String(opts.buttonClass || 'btn-primary');
        const wrapClass = String(opts.wrapClass || 'settlement-choice-grid');
        const onAction = String(opts.onAction || 'submitSettlementChoice');
        const clickPrefix = String(opts.clickPrefix || '');
        const styles = Object.assign({
            take: 'background:var(--accent2); color:#fff;',
            gift_client: 'background:transparent; color:var(--text); border:1px solid var(--border);',
            support_business: 'background:transparent; color:var(--text); border:1px solid var(--border);'
        }, opts.styles || {});

        if (dealId == null || !choices.length) return '';

        return [
            '<div class="', wrapClass, '">',
            choices.map(function(choice) {
                const value = String(choice && choice.value || '').trim().toLowerCase();
                const label = choice && choice.label ? choice.label : value;
                if (!value) return '';
                return [
                    '<button class="', buttonClass, '" style="', styles[value] || '', '" onclick="',
                    clickPrefix, onAction, '(', JSON.stringify(dealId), ", '", value, '\')">',
                    escapeHtml(label),
                    '</button>'
                ].join('');
            }).join(''),
            '</div>'
        ].join('');
    }

    global.WinWinRecommenderDecisionUI = { render: render };
})(window);
