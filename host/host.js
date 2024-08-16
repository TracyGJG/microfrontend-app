import config from './bootstrap.json' with { type: "json" };

const userSettings = JSON.parse(window.localStorage.getItem('mfaUserSettings') || `{"rngLightDark": "1", "rngFontSize": "16"}`);

let currentScreen;

document.querySelector('header h1').textContent = config.host.applicationName;
if (config.host.logo) {
  document.querySelector('header img').src = config.host.logo;
  document.querySelector('link[rel="icon"]').href=config.host.logo;
}
else {
  document.querySelector('header').classList.add('no-logo');
}

showScreen();

function showScreen(newScreen = config.host.initialScreen) {
  const newScreenSpec = config.screens[newScreen];

  if (!document.querySelector(`#${newScreen}`)) {

    document.querySelector(`main`).insertAdjacentHTML('beforeEnd', `<section id=${newScreen}></section>`)

    let gridAreas = '';
    if (newScreenSpec.areas) {
      gridAreas = `grid-template-areas: ${newScreenSpec.areas.map(area => `"${area}"`).join(' ')};`;
    }
    
    document.querySelector(`#${newScreen}`).style = `--grid-rows:${newScreenSpec.rows || 8}; --grid-cols:${newScreenSpec.cols || 12}; ${gridAreas}`;
    document.querySelector(`#${newScreen}`).innerHTML = newScreenSpec.remotes.map(remote => {
      let iframeStyle = [];
    
      if (remote.area) {
        iframeStyle.push(`grid-area: ${remote.area}`);
      }
      if (remote.rows) {
        iframeStyle.push(`grid-row: ${remote.rows}`);
      }
      if (remote.cols) {
        iframeStyle.push(`grid-column: ${remote.cols}`);
      }
      return `<iframe src="${remote.url}" style="${iframeStyle.join('; ')}"></iframe>`;
    }).join('');
  }
  
  if (currentScreen) {
    document.querySelector(`#${currentScreen}`).classList.remove('show');
  }
  currentScreen = newScreen;
  document.querySelector('header h2').textContent = newScreenSpec.title;
  document.title = `${config.host.applicationName}:${newScreenSpec.title}`;
  document.querySelector(`#${currentScreen}`).classList.add('show');
}

document.querySelector('nav > article').innerHTML = Object.entries(config.screens).map(([id, screen]) => `<button data-id="${id}">${screen.title}</button>`).join('');
document.querySelector('nav > article').addEventListener('click', evt => {
  if (evt.target.tagName === 'BUTTON') {
    showScreen(evt.target.dataset.id);
  }
});

window.addEventListener('message', ({data}) => {
  showScreen(data);
});

const settingsEventHandlers = {
  'rngFontSize': (value) => {
    document.body.style.fontSize = `${value}px`;
  },
  'rngLightDark': (value) => {   
    if ((document.body.classList.contains('DarkMode') && (value === "1")) 
    || (!document.body.classList.contains('DarkMode') && (value === "0"))) {
      document.body.classList.toggle('DarkMode');
    }
  }
}

Object.entries(userSettings).map(([elementId, value]) => {
  settingsEventHandlers[elementId](value);
  document.querySelector(`#${elementId}`).value = value;
});

function storeUserSettings() {
  Object.keys(userSettings).map((elementId) => {
    userSettings[elementId] = document.querySelector(`#${elementId}`).value;
  });
  window.localStorage.setItem('mfaUserSettings', JSON.stringify(userSettings));
}

document.querySelector('aside > article').addEventListener('change', evt => {
  const eventHandler = settingsEventHandlers[evt.target.id];
  if (eventHandler) {
    eventHandler(evt.target.value);
    storeUserSettings();
  }
});