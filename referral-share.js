(function (global) {
  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setDescription(el, description) {
    if (!el) return;
    if (!description) {
      el.textContent = '';
      el.style.display = 'none';
      return;
    }
    var safe = escapeHtml(description);
    el.innerHTML = safe.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    el.style.display = 'block';
  }

  function renderQr(canvas, link) {
    if (!canvas) return;
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width || 300, canvas.height || 300);
    if (typeof global.QRious === 'function') {
      try {
        new global.QRious({ element: canvas, value: link, size: 220, level: 'H' });
      } catch (e) {}
    }
  }

  function open(options) {
    var opts = options || {};
    var screen = byId(opts.screenId || 'recommendScreen');
    var nameEl = byId(opts.nameId || 'recBizName');
    var nicheEl = byId(opts.nicheId || 'recBizNiche');
    var descEl = byId(opts.descId || 'recBizDesc');
    var input = byId(opts.inputId || 'refLinkInput');
    var copyBtn = byId(opts.copyBtnId || 'copyBtn');
    var canvas = byId(opts.qrCanvasId || 'qrCanvas');

    if (nameEl) nameEl.textContent = opts.businessName || '';
    if (nicheEl) nicheEl.textContent = opts.categoryLabel || '';
    setDescription(descEl, opts.description || '');
    if (input) input.value = opts.link || '';
    if (copyBtn) {
      copyBtn.textContent = opts.copyLabel || 'Copy';
      copyBtn.classList.remove('copied');
    }
    renderQr(canvas, opts.link || '');
    if (screen) screen.classList.add('active');
    document.body.style.overflow = 'hidden';
    global.scrollTo(0, 0);
    if (typeof opts.onOpen === 'function') opts.onOpen();
    if (global.feather && typeof global.feather.replace === 'function') global.feather.replace();
  }

  function close(options) {
    var opts = options || {};
    var screen = byId(opts.screenId || 'recommendScreen');
    if (screen) screen.classList.remove('active');
    document.body.style.overflow = '';
    if (typeof opts.onClose === 'function') opts.onClose();
  }

  function copy(options) {
    var opts = options || {};
    var input = byId(opts.inputId || 'refLinkInput');
    var copyBtn = byId(opts.copyBtnId || 'copyBtn');
    if (!input) return;
    (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(input.value) : Promise.reject())
      .catch(function () {
        input.select();
        document.execCommand('copy');
      });
    if (copyBtn) {
      copyBtn.textContent = opts.copiedLabel || 'Copied';
      copyBtn.classList.add('copied');
    }
    if (typeof opts.onCopy === 'function') opts.onCopy(input.value);
  }

  global.WinWinReferralShare = {
    open: open,
    close: close,
    copy: copy
  };
})(window);
