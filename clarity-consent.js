(function () {
  const projectId = 'zckja1zeht';
  const consentKey = 'menus-clarity-consent';
  const consentLifetime = 270 * 24 * 60 * 60 * 1000;
  const consentChoices = ['granted', 'denied'];
  let choice = readChoice();

  function readChoice() {
    let serialized;
    try {
      serialized = window.localStorage.getItem(consentKey);
    } catch (error) {
      console.warn('No se pudo leer la preferencia de Clarity.', error);
      return null;
    }

    if (!serialized) return null;

    let saved;
    try {
      saved = JSON.parse(serialized);
    } catch (error) {
      console.warn('La preferencia guardada de Clarity no es válida.', error);
      return null;
    }

    if (!saved || !consentChoices.includes(saved.choice) || !Number.isFinite(saved.updatedAt)) return null;
    if (Date.now() - saved.updatedAt > consentLifetime) return null;
    return saved.choice;
  }

  function loadClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', projectId);

    window.clarity('consentv2', {
      ad_Storage: 'denied',
      analytics_Storage: 'granted'
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    #clarity-consent {
      position: fixed;
      z-index: 1000;
      left: 16px;
      right: 16px;
      bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      max-width: 720px;
      margin: 0 auto;
      padding: 16px;
      border: 1px solid #d6d3d1;
      border-radius: 14px;
      background: #fff;
      color: #292524;
      box-shadow: 0 8px 32px rgba(0, 0, 0, .24);
      font: 14px/1.45 system-ui, sans-serif;
    }
    #clarity-consent[hidden] { display: none; }
    #clarity-consent p { margin: 6px 0 14px; }
    #clarity-consent-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
    #clarity-consent button {
      min-height: 40px;
      padding: 8px 14px;
      border: 1px solid #57534e;
      border-radius: 8px;
      background: #fff;
      color: #292524;
      font: inherit;
      cursor: pointer;
    }
    #clarity-consent button:focus-visible,
    .clarity-settings:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
    #clarity-consent .clarity-accept { background: #292524; color: #fff; }
    .clarity-settings {
      margin-left: 8px;
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-decoration: underline;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('section');
  banner.id = 'clarity-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'false');
  banner.setAttribute('aria-labelledby', 'clarity-consent-title');
  banner.setAttribute('aria-describedby', 'clarity-consent-description');

  const title = document.createElement('strong');
  title.id = 'clarity-consent-title';
  title.textContent = 'Privacidad y análisis';

  const description = document.createElement('p');
  description.id = 'clarity-consent-description';
  description.textContent = 'Microsoft Clarity puede medir las visitas y grabar interacciones de navegación para analizar el uso de estas cartas. Solo se activa si aceptas. Rechazar no afecta a la carta ni a los pedidos.';

  const actions = document.createElement('div');
  actions.id = 'clarity-consent-actions';

  const rejectButton = document.createElement('button');
  rejectButton.type = 'button';
  rejectButton.textContent = 'Rechazar';

  const acceptButton = document.createElement('button');
  acceptButton.type = 'button';
  acceptButton.className = 'clarity-accept';
  acceptButton.textContent = 'Aceptar análisis';

  actions.append(rejectButton, acceptButton);
  banner.append(title, description, actions);
  document.body.appendChild(banner);

  function saveChoice(nextChoice) {
    choice = nextChoice;
    try {
      window.localStorage.setItem(consentKey, JSON.stringify({
        choice: nextChoice,
        updatedAt: Date.now()
      }));
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de Clarity.', error);
    }

    banner.hidden = true;
    if (nextChoice === 'granted') {
      loadClarity();
    } else if (window.clarity) {
      window.clarity('consentv2', {
        ad_Storage: 'denied',
        analytics_Storage: 'denied'
      });
    }
  }

  function showPreferences() {
    banner.hidden = false;
    acceptButton.focus();
  }

  rejectButton.addEventListener('click', function () {
    saveChoice('denied');
  });
  acceptButton.addEventListener('click', function () {
    saveChoice('granted');
  });

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'clarity-settings';
  settingsButton.textContent = 'Privacidad';
  settingsButton.setAttribute('aria-label', 'Cambiar preferencias de análisis');
  settingsButton.addEventListener('click', showPreferences);

  const footer = document.querySelector('.demo');
  if (footer) {
    footer.append(document.createTextNode(' · '), settingsButton);
  }

  if (choice === 'granted') {
    loadClarity();
  } else if (!choice) {
    banner.hidden = false;
  }
})();
