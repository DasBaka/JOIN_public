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

function initDropDown(id, dataArray, heading, elementName, multiSelect, imgSrc, headingOverwrite, selectedElements, expandStatus) {
  let content = document.getElementById(id);
  let tmp_elementName = elementName || 'name';
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
      "elementName": tmp_elementName,
      "multiSelect": tmp_multiSelect,
      "imgSrc": tmp_imgSrc,
      "headingOverwrite": tmp_headingOverwrite,
      "selectedElements": tmp_selectedElements,
      "expandStatus": tmp_expandStatus,
    }
  )

  content.innerHTML = /*html*/ `
  <div class="form-default-drop-down-element" onclick="expandDropDown('${id}')">
    <h6 id="${id}-heading">${heading}</h6>
    <img class="form-default-input-img" src="${tmp_imgSrc}">
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
    let elementName = item[config['elementName']];

    content.innerHTML += /*html*/ `
    <div id="${id}-element-${elementName}" class="form-default-drop-down-element" onclick="selectDropDownElement('${id}', '${elementName}')">
      <h6>${elementName}</h6>
    </div>`;

    if (config['selectedElements'].indexOf(elementName) > -1) { 
      document.getElementById(`${id}-element-${elementName}`).classList.add('form-default-selected-drop-down-element');
    }
  }
}

function selectDropDownElement(id, selectedElement) {
  let config = formDropDownConfig[getIndexOfValue(formDropDownConfig, 'name', `${id}`)]
  let indexOfselectedElement = config['selectedElements'].indexOf(selectedElement);
  let HTMLelement = document.getElementById(`${id}-element-${selectedElement}`);
  
  if (config['multiSelect'] == false) {
    config['headingOverwrite'] = selectedElement;
    config['selectedElements'] = [selectedElement];
    expandDropDown(id);
    return
  }

  if (indexOfselectedElement == -1) { 
    config['selectedElements'].push(selectedElement);
    HTMLelement.classList.add('form-default-selected-drop-down-element');
  } else {
    config['selectedElements'].splice(indexOfselectedElement, 1);
    HTMLelement.classList.remove('form-default-selected-drop-down-element');
  }
}
