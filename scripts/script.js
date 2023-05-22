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
  let navElements = ['summary', 'board', 'add-task', 'contacts', 'legal-notice'];
  for (let i = 0; i < navElements.length; i++) {
    const element = navElements[i];
    if (window.location.pathname.includes(element)) {
      document.getElementById('nav-element-' + element).classList.add('nav-element-active');
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

function getIndexOfValue(array, key, value) {
  return array.findIndex(k => k[key] === value);
}

function initDropDown(id, dataArray, heading, elementId, elementName, multiSelect, imgSrc, headingOverwrite, selectedElements, expandStatus) {
  let content = document.getElementById(id);
  let tmp_elementId = elementId || 'name';
  let tmp_elementName = elementName || ['name'];
  let tmp_multiSelect = multiSelect || false;
  let tmp_imgSrc = imgSrc || 'assets/img/sort-down.png';
  let tmp_headingOverwrite = headingOverwrite || null;
  let tmp_selectedElements = selectedElements || [];
  let tmp_expandStatus = expandStatus || false;

  formDropDownConfig.push(
    {
      "name": id,
      "dataArray": dataArray,
      "heading": heading,
      "elementId": tmp_elementId,
      "elementName": tmp_elementName,
      "multiSelect": tmp_multiSelect,
      "imgSrc": tmp_imgSrc,
      "headingOverwrite": tmp_headingOverwrite,
      "selectedElements": tmp_selectedElements,
      "expandStatus": tmp_expandStatus,
    }
  )

  content.innerHTML = /*html*/ `
  <div class="form-drop-down-element" onclick="expandDropDown('${id}')">
    <h6 id="${id}-heading">${heading}</h6>
    <img class="form-input-img" src="${tmp_imgSrc}">
  </div>
  <div id="${id}-content" class="form-drop-down-content" ></div>`;
}

function expandDropDown(id) {
  let content = document.getElementById(`${id}-content`);
  let heading = document.getElementById(`${id}-heading`);
  let config = formDropDownConfig[getIndexOfValue(formDropDownConfig, 'name', `${id}`)]

  if (config['expandStatus']) {
    content.innerHTML = '';
    config['expandStatus'] = false;
    if (config['headingOverwrite']) { heading.innerText = config['headingOverwrite'] };
    return
  }

  config['expandStatus'] = true;
  heading.innerText = config['heading'];

  for (let i = 0; i < config['dataArray'].length; i++) {
    const item = config['dataArray'][i];
    let elementId = item[config['elementId']];
    let elementName = "";

    for (let j = 0; j < config['elementName'].length; j++) {
      elementName = `${elementName} ${item[config['elementName'][j]]}`;
    }

    content.innerHTML += /*html*/ `
    <div id="${id}-element-${elementId}" class="form-drop-down-element" onclick="selectDropDownElement('${id}', '${elementId}')">
      <h6>${elementName}</h6>
      <div id="${id}-checkbox-${elementId}" class="form-drop-down-checkbox display-none"></div>
    </div>`;

    if (config['multiSelect']) {
      document.getElementById(`${id}-checkbox-${elementId}`).classList.remove('display-none');
    }

    if (config['selectedElements'].indexOf(elementId) > -1) { 
      document.getElementById(`${id}-element-${elementId}`).classList.add('form-drop-down-selected-element');
      document.getElementById(`${id}-checkbox-${elementId}`).classList.add('form-drop-down-checkbox-filled');
    }
  }
}

function selectDropDownElement(id, elementId) {
  let config = formDropDownConfig[getIndexOfValue(formDropDownConfig, 'name', `${id}`)]
  let indexOfelementId = config['selectedElements'].indexOf(elementId);
  let checkboxDiv = document.getElementById(`${id}-checkbox-${elementId}`);
  
  if (config['multiSelect'] == false) {
    config['headingOverwrite'] = elementId;
    config['selectedElements'] = [elementId];
    expandDropDown(id);
    return
  }

  if (indexOfelementId == -1) { 
    config['selectedElements'].push(elementId);
    checkboxDiv.classList.add('form-drop-down-checkbox-filled');
  } else {
    config['selectedElements'].splice(indexOfelementId, 1);
    checkboxDiv.classList.remove('form-drop-down-checkbox-filled');
  }
}
