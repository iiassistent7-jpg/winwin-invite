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

        if (dealId == null || !choices.length) return '';

        return [
            '<div class="', wrapClass, '">',
            choices.map(function(choice) {
                const value = String(choice && choice.value || '').trim().toLowerCase();
                const label = choice && choice.label ? choice.label : value;
                if (!value) return '';
                return [
                    '<button class="', buttonClass, ' recommender-decision-btn" type="button" data-decision-choice="', value, '" onclick="',
                    clickPrefix, "WinWinRecommenderDecisionUI.handleChoiceClick(this, '", onAction, "', ", JSON.stringify(dealId), ", '", value, "')\">",
                    escapeHtml(label),
                    '</button>'
                ].join('');
            }).join(''),
            '</div>'
        ].join('');
    }

    function handleChoiceClick(button, handlerName, dealId, choiceValue) {
        const root = button && typeof button.closest === 'function'
            ? button.closest('.settlement-choice-grid')
            : null;
        if (root) {
            root.querySelectorAll('.recommender-decision-btn').forEach(function(node) {
                node.classList.remove('is-selected');
            });
        }
        if (button && button.classList) {
            button.classList.add('is-selected');
        }
        const handler = global[handlerName];
        if (typeof handler === 'function') {
            return handler(dealId, choiceValue);
        }
    }

    global.WinWinRecommenderDecisionUI = {
        render: render,
        handleChoiceClick: handleChoiceClick
    };
})(window);
