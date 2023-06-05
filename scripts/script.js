let login_status = false;
let formDropDownConfig = [];

async function initialPageLoad() {
  await includeHTML();
  activeNavElement();
}

function initialRedirect() {
  if (login_status == false) {
    window.location.href = '/log-in.html';
  } else {
    window.location.href = '/summary.html';
  }
}

async function includeHTML() {
  let includeElements = document.querySelectorAll('[include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('include-html'); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

function activeNavElement() {
  let navElements = [
    'summary',
    'board',
    'add-task',
    'contacts',
    'legal-notice',
  ];
  for (let i = 0; i < navElements.length; i++) {
    const element = navElements[i];
    if (window.location.pathname.includes(element)) {
      document
        .getElementById('nav-element-' + element)
        .classList.add('nav-element-active');
    }
  }
}

function logOutButtonVisibility() {
  let element = document.getElementById('log-out-button').classList;
  element.toggle('display-none');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Returns the inital Letter of a name or surname.
 * @param {string} name - Name
 * @param {number} pos - Position (most: 0)
 * @returns
 */
function initialLetter(name, pos) {
  return name.name.charAt(pos);
}

//Color-Interaction
/**
 * Changes the (text) color based on the background-color. Recommended threshhold: 145 - 190;
 * @param {HEXcolor} bgColor - color as HEX-format
 * @returns - Returns "white" or "black" as HEX-color
 */
function responsiveColor(bgColor) {
  let colorRGB = hexToRgb(bgColor);
  let threshhold = 150;
  if (
    colorRGB.r * 0.299 + colorRGB.g * 0.587 + colorRGB.b * 0.114 >
    threshhold
  ) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}

/**
 * Formats and splits HEX-color into RGB-values
 * @param {HEXcolor} hex - color as HEX-format
 * @returns - returns values for red, green and blue.
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

function getIndexOfValue(array, key, value) {
  return array.findIndex(k => k[key] === value);
}
