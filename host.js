import config from './bootstrap.json' with { type: "json" };

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

document.addEventListener('_changeScreen', e => {
  showScreen(e.detail);
});

function showScreen(newScreen = config.host.initialScreen) {
  const newScreenSpec = config.screens[newScreen];

  if (!document.querySelector(`#${newScreen}`)) {

    document.body.insertAdjacentHTML('beforeEnd', `<main id=${newScreen}></main>`)

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
