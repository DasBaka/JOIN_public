function initDropDown(id) {
  for (let i = 0; i < formDropDown.length; i++) {
    const item = formDropDown[i];
    if (!document.getElementById(item['id'])) { continue }
    if (id && item['id'] != id) { continue }
    let content = document.getElementById(item['id']);

    content.innerHTML = /*html*/ `
    <div class="form-dd-element" onclick="expandDropDown('${item['id']}')">
      <h6 id="${item['id']}-heading">${item['heading']}</h6>
      <img class="form-input-img" src="${item['headingImgSrc']}">
    </div>
    <div id="${item['id']}-content" class="form-dd-content" ></div>`;

    // additionalDropDownElement('form-dd-category');
  }
}

function expandDropDown(id) {
  let content = document.getElementById(`${id}-content`);
  let heading = document.getElementById(`${id}-heading`);
  let config = formDropDown[getIndexOfValue(formDropDown, 'id', `${id}`)];

  if (config['expandStatus']) {
    content.innerHTML = '';
    config['expandStatus'] = false;
    if (config['headingOverwrite']) { heading.innerText = config['headingOverwrite'] };
    return
  }

  config['expandStatus'] = true;
  heading.innerText = config['heading'];

  if (config['additionalElement'] && config['additionalElement']['firstElement'] == true) {
    additionalDropDownElement(id, true);
  }

  for (let i = 0; i < config['dataArray'].length; i++) {
    const item = config['dataArray'][i];
    let elementId = item[config['elementId']];
    let elementName = "";

    for (let j = 0; j < config['elementName'].length; j++) {
      elementName = `${elementName} ${item[config['elementName'][j]]}`;
    }

    content.innerHTML += /*html*/ `
    <div id="${id}-element-${elementId}" class="form-dd-element" onclick="selectDropDownElement('${id}', '${elementId}')">
      <h6>${elementName}</h6>
      <div id="${id}-checkbox-${elementId}" class="form-dd-checkbox display-none"></div>
    </div>`;

    if (config['multiSelect']) {
      document.getElementById(`${id}-checkbox-${elementId}`).classList.remove('display-none');
    }

    if (config['selectedElements'].indexOf(elementId) > -1) {
      document.getElementById(`${id}-element-${elementId}`).classList.add('form-dd-selected-element');
      document.getElementById(`${id}-checkbox-${elementId}`).classList.add('form-dd-checkbox-filled');
    }
  }

  if (config['additionalElement'] && config['additionalElement']['firstElement'] == false) {
    additionalDropDownElement(id, true);
  }
}

function selectDropDownElement(id, elementId) {
  let config = formDropDown[getIndexOfValue(formDropDown, 'id', `${id}`)]
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
    checkboxDiv.classList.add('form-dd-checkbox-filled');
  } else {
    config['selectedElements'].splice(indexOfelementId, 1);
    checkboxDiv.classList.remove('form-dd-checkbox-filled');
  }
}

function additionalDropDownElement(id, render) {
  let content = document.getElementById(`${id}-content`);
  let config = formDropDown[getIndexOfValue(formDropDown, 'id', `${id}`)];

  if (render == true) {
    content.innerHTML += /*html*/ `
  <div id="additional-element" class="form-dd-element" onclick="additionalDropDownElement('${id}', false)">
    <h6>${config['additionalElement']['elementName']}</h6>
    <img class="form-input-img" src="${config['additionalElement']['imgSrc']}">
  </div>`;
    return
  }

  content = document.getElementById(id);
  config['expandStatus'] = false;
  content.innerHTML = /*html*/ `
    <input type="text" placeholder="${config['additionalElement']['placeHolder']}" value="">
    <div class="form-dd-additional-element-button-wrapper">
      <img src="assets/img/cross.svg" style="transform: rotate(45deg);" onclick="initDropDown('${id}')">
      <div class="grey-divider-div"></div>
      <img src="assets/img/check-black.png">
    </div>`;
}

function renderPriorities(id) {
  
}
