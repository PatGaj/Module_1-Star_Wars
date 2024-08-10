import { rowData } from "./data.js";

const body = document.body;
// Nav
const nav = buildElement("nav");
const spanNav = buildElement("span", undefined, undefined, "To hear something type 'vader' or 'yoda'");
const themeButton = buildElement("button", "themeButton", undefined, "Light side");
themeButton.addEventListener("click", changeSide);
nav.append(spanNav, themeButton);

// Buttons
const divButtons = buildElement("div", "buttons");
for (const key in rowData) {
  const button = buildElement("button", key, undefined, key.toUpperCase());
  button.addEventListener("click", () => v2(key));
  divButtons.appendChild(button);
}

// Content
const content = buildElement("div", "content");
// Logo
const logo = buildElement("img", "logo", undefined, undefined, "./img/star_wars.png");
content.appendChild(logo);

// Tabela
let rekordy = [];
let searchedRecords = [];
let markedCheckbox = [];
let aktualnaStrona = 0;
let iloscStron = 1;
const containerForTable = buildElement("div", "containerForTable");
const searchArea = buildElement("div", "searchArea");
const mainTable = buildElement("table", "mainTable");
containerForTable.style.display = "none";
const changePageArea = buildElement("div", "changePageArea");
containerForTable.append(searchArea, mainTable, changePageArea);
content.appendChild(containerForTable);

// Search do SearchArea
const idSearch = buildElement("input", "idSearch");
idSearch.setAttribute("placeholder", `1-${rekordy.length}`);
idSearch.setAttribute("type", "number");
idSearch.min = 1;
const nameSearch = buildElement("input", "nameSearch");
nameSearch.setAttribute("placeholder", `search by `);
const searchButton = buildElement("button", "searchButton", undefined, "Search");
searchButton.addEventListener("click", addRow);
searchArea.append(idSearch, nameSearch, searchButton);

// Pages do changePageArea
const lastPage = buildElement("button", "leftArrow", undefined, "<");
lastPage.addEventListener("click", () => {
  if (aktualnaStrona !== 0) {
    aktualnaStrona -= 1;
    addRow();
  }
});
const nextPage = buildElement("button", "rightArrow", undefined, ">");
nextPage.addEventListener("click", () => {
  if (aktualnaStrona + 1 !== iloscStron) {
    aktualnaStrona += 1;
    addRow();
  }
});
const inputToChangePage = buildElement("input", "page");
inputToChangePage.setAttribute("placeholder", aktualnaStrona + 1);
const maxRowsInTable = buildElement("select", "maxRows");
maxRowsInTable.addEventListener("change", () => {
  aktualnaStrona = 0;
  addRow();
});
const listOfMaxRows = [10, 20];
listOfMaxRows.forEach((item) => {
  const maxPages = buildElement("option");
  maxPages.text = item;
  maxPages.value = item;
  maxRowsInTable.appendChild(maxPages);
});
const quantityPages = buildElement("span", "lastPage"); //Do zmiany text -

changePageArea.append(lastPage, inputToChangePage, quantityPages, nextPage, maxRowsInTable);

// Dodanie do Body
body.append(nav, divButtons, content);

// Sounds
const vaderSound = buildElement("audio", "vaderSound", undefined, undefined, "./mp3/sound-for-vader.mp3");
const yodaSound = buildElement("audio", "yodaSound", undefined, undefined, "./mp3/sound-for-yoda.mp3");
body.append(vaderSound, yodaSound);

let typed = "";
const keywordVader = "vader";
const keywordYoda = "yoda";
document.addEventListener("keydown", function (event) {
  typed += event.key.toLowerCase();
  if (typed.includes(keywordVader)) {
    typed = "";
    soundStartStop(vaderSound, 30);
    if (yodaSound.currentTime !== 0) {
      soundStop(yodaSound);
    }
  } else if (typed.includes(keywordYoda)) {
    typed = "";
    soundStartStop(yodaSound, 30);
    if (vaderSound.currentTime !== 0) {
      soundStop(vaderSound);
    }
  }
  if (typed.length >= keywordVader.length) {
    typed = typed.substring(typed.length - keywordVader.length);
  }
});
// ---------------------------------------------------------------------------------------------------------------------------------------
// Function Section

function soundStop(sound) {
  sound.pause();
  sound.currentTime = 0;
}

function soundStartStop(sound, timeToStopInSec) {
  sound.play();
  setTimeout(() => {
    sound.pause();
    sound.currentTime = 0;
  }, timeToStopInSec * 1000);
}

function changeSide() {
  const buttons = document.querySelectorAll("#buttons button");
  if (themeButton.textContent === "Light side") {
    themeButton.textContent = "Dark side";
    themeButton.style.backgroundColor = "var(--red)";
    body.style.backgroundImage = 'url("./img/vader_background.jpg")';
    buttons.forEach((button) => {
      button.style.boxShadow = "inset 0 -5px 10px 5px var(--red)";
      button.style.color = "var(--red)";
    });
  } else if (themeButton.textContent === "Dark side") {
    themeButton.textContent = "Light side";
    themeButton.style.backgroundColor = "var(--green)";
    body.style.backgroundImage = 'url("./img/falcon_background.jpg")';
    buttons.forEach((button) => {
      button.style.boxShadow = "inset 0 -5px 10px 5px var(--black)";
      button.style.color = "var(--black)";
    });
  }
}

function buildElement(typeElement, idElement, classElement, textElement, srcElement) {
  const element = document.createElement(typeElement);
  if (idElement !== undefined) {
    element.id = idElement;
  }
  if (classElement !== undefined) {
    element.className = classElement;
  }
  if (textElement !== undefined) {
    element.textContent = textElement;
  }
  if (srcElement !== undefined) {
    element.src = srcElement;
  }
  return element;
}

function actualyCategory(category) {
  const buttons = divButtons.children;
  for (const button of buttons) {
    button.style.border = "none";
  }
  const clickedButton = document.getElementById(category);
  clickedButton.style.border = "solid var(--green) 2px";
}

// Remove Row
function removeRow(child) {
  rekordy.splice(rekordy.indexOf(child), 1);
  if (rekordy.length === 0) {
    mainTableBody.textContent = "Brak elementów do wyświetlenia";
    idSearch.placeholder = "0";
    idSearch.min = 0;
  } else {
    idSearch.placeholder = `1-${rekordy.length}`;
    idSearch.max = rekordy.length;
  }
  addRow();
}

// Info row
function infoRow(parent, row) {
  const info = buildElement("table", "info");
  parent.appendChild(info);
  const infoHead = buildElement("thead");
  const infoBody = buildElement("tbody");
  info.append(infoHead, infoBody);
  const infoTrHead = buildElement("tr");
  infoHead.appendChild(infoTrHead);
  const infoTdHead = buildElement("td");
  infoTdHead.setAttribute("colspan", 2);
  infoTrHead.appendChild(infoTdHead);
  const closeInfoButton = buildElement("button", undefined, undefined, "Close");
  closeInfoButton.addEventListener("click", () => parent.removeChild(info));
  infoTdHead.appendChild(closeInfoButton);
  for (const dataName in row) {
    let record = row[dataName];
    if (dataName === "created") {
      record = record.slice(0, 10).split("-").reverse().join("-");
    }
    const infoTrBody = buildElement("tr");
    infoBody.appendChild(infoTrBody);
    const infoThBody = buildElement("th", undefined, undefined, `${dataName} :`);
    const infoTdBody = buildElement("td", undefined, undefined, record);
    infoTrBody.append(infoThBody, infoTdBody);
  }
}

function checkSelected(checkbox, listOfMarkedCheckboxs, row) {
  if (checkbox.checked) {
    const empty = listOfMarkedCheckboxs.indexOf("empty");
    if (empty === -1) {
      listOfMarkedCheckboxs.push(row);
    } else {
      listOfMarkedCheckboxs[empty] = row;
    }
  } else if (listOfMarkedCheckboxs.includes(row)) {
    const element = listOfMarkedCheckboxs.indexOf(row);
    listOfMarkedCheckboxs.splice(element, 1, "empty");
    if (clearList(listOfMarkedCheckboxs)) {
    }
  }
  const czyJest = Boolean(document.getElementById("removeAllButton"));
  if (!czyJest) {
    const removeAllButton = buildElement("button", "removeAllButton", undefined, "Remove All");
    removeAllButton.addEventListener("click", () => {
      for (const check of listOfMarkedCheckboxs) {
        if (check === "empty") {
          continue;
        }
        removeRow(check);
      }
      listOfMarkedCheckboxs.splice(0, listOfMarkedCheckboxs.length);
      changePageArea.removeChild(removeAllButton);
    });
    changePageArea.append(removeAllButton);
  } else if (listOfMarkedCheckboxs.length == 0 && czyJest) {
    const removeAllButton = document.getElementById("removeAllButton");
    changePageArea.removeChild(removeAllButton);
  }
}

function clearList(list) {
  if (list[list.length - 1] === "empty") {
    list.pop();
    return clearList(list);
  } else {
    return true;
  }
}
// Zrobione 15 pkt

function v2(category) {
  // Dodaje zaznaczenie do aktualnie używanego przycisku
  actualyCategory(category);
  aktualnaStrona = 0;
  // Sprawdza czy logo jest widoczne
  if (logo.style.display !== "none") {
    logo.style.display = "none";
    containerForTable.style.display = "block";
  }
  // Sprawdza czy jest mainTable ma dzieci jak tak to usuwa
  while (mainTable.children.length !== 0) {
    mainTable.removeChild(mainTable.firstChild);
  }
  // Tworzy nowy heder i body w tabeli
  const mainTableHeader = buildElement("thead", "mainTableHeader");
  const mainTableBody = buildElement("tbody", "mainTableBody");
  mainTable.append(mainTableHeader, mainTableBody);
  const headerRow = buildElement("tr");
  mainTableHeader.appendChild(headerRow);

  // Dodaje Id i Action
  const headerId = buildElement("th", undefined, undefined, "Id");
  const headerAction = buildElement("th", "headerAction", undefined, "action");
  headerRow.append(headerId, headerAction);

  // Sprawdza jaka kategoria kliknięta i dobiera nazyw kolumn do niej
  let columns;
  switch (category) {
    case "vehicles":
      columns = ["name", "model", "manufacturer", "created"];
      break;
    case "starships":
      columns = ["name", "model", "manufacturer", "created"];
      break;
    case "planets":
      columns = ["name", "climate", "terrain", "created"];
      break;
    case "people":
      columns = ["name", "birth_year", "gender", "created"];
      break;
    case "species":
      columns = ["name", "classification", "language", "created"];
      break;
    case "films":
      columns = ["title", "director", "release_date", "created"];
      break;
  }
  // Czyszczenie rekordów
  while (rekordy.length !== 0) {
    rekordy.pop();
  }

  // Dodanie Nazw Kolumn
  for (const key in rowData[category][0]) {
    if (columns.includes(key)) {
      const data = key.replace("_", " ");
      const headerColumn = buildElement("th", undefined, undefined, data);
      headerRow.insertBefore(headerColumn, headerAction);
    }
  }

  // Dodawanie wartości rekordów
  for (const index in rowData[category]) {
    //Index
    const id = parseInt(index) + 1;
    const bodyRow = buildElement("tr", `id_${id}`, "trBody");
    const indexRecord = buildElement("td", undefined, "tdIndex", id);
    bodyRow.appendChild(indexRecord);
    const row = rowData[category][index];
    // Rodawanie rekordów do kolumn
    for (const key in row) {
      if (columns.includes(key)) {
        let recordData = row[key];
        if (key === "created") {
          recordData = recordData.slice(0, 10).split("-").reverse().join("-");
        }
        const record = buildElement("td", undefined, undefined, recordData);
        bodyRow.appendChild(record);
      }
    }
    // Tworzenie Zawartości w rekordach akcji
    const tdAction = buildElement("td", undefined, "tdAction");
    bodyRow.appendChild(tdAction);
    // Delete Button
    const deleteButton = buildElement("button", undefined, "deleteButton");
    deleteButton.addEventListener("click", () => {
      removeRow(bodyRow);
      if (markedCheckbox.includes(bodyRow)) {
        const element = markedCheckbox.indexOf(bodyRow);
        markedCheckbox.splice(element, 1, "empty");
      }
    });
    const trashCan = buildElement("img", undefined, "trashCan", undefined, "./img/trash-can.svg");
    deleteButton.appendChild(trashCan);
    // Info Button
    const infoButton = buildElement("button", "infoButton", undefined, "+");
    infoButton.addEventListener("click", () => infoRow(body, row));
    // checkBox

    const checkBoxRow = buildElement("input", undefined, "checkBoxRow");
    checkBoxRow.type = "checkbox";
    checkBoxRow.addEventListener("click", () => checkSelected(checkBoxRow, markedCheckbox, bodyRow));
    tdAction.append(deleteButton, infoButton, checkBoxRow);
    rekordy.push(bodyRow);
  }
  nameSearch.placeholder = `search by ${columns[0]}`;
  addRow();
}

function addRow() {
  search();

  const mainTableBody = document.getElementById("mainTableBody");
  while (mainTableBody.children.length !== 0) {
    mainTableBody.removeChild(mainTableBody.lastChild);
  }
  const maxRows = parseInt(maxRowsInTable.value);
  let start = aktualnaStrona * maxRows;
  const stopPage = start + maxRows > searchedRecords.length ? searchedRecords.length : start + maxRows;
  for (start; start < stopPage; start++) {
    mainTableBody.append(searchedRecords[start]);
  }

  iloscStron = Math.ceil(searchedRecords.length / maxRows);
  quantityPages.textContent = ` z ${iloscStron}`;
  inputToChangePage.placeholder = aktualnaStrona + 1;
  idSearch.placeholder = `1-${rekordy.length}`;
  idSearch.max = rekordy.length;
}

function search() {
  while (searchedRecords.length !== 0) {
    searchedRecords.pop();
  }
  const filterName = nameSearch.value.toLowerCase();
  let filterId = idSearch.value;
  if (parseInt(idSearch.value) > idSearch.max) {
    idSearch.value = `${idSearch.max}`;
    filterId = `${idSearch.max}`;
  }

  for (let i = 0; i < rekordy.length; i++) {
    const text = rekordy[i].getElementsByTagName("td")[1];
    const id = rekordy[i].getElementsByTagName("td")[0];
    if (filterName !== "" && filterId !== "") {
      if (parseInt(id.textContent) === parseInt(filterId) && text.textContent.toLowerCase().indexOf(filterName) > -1) {
        searchedRecords.push(rekordy[i]);
      }
    } else if (filterName !== "") {
      if (text.textContent.toLowerCase().indexOf(filterName) > -1) {
        searchedRecords.push(rekordy[i]);
      }
    } else if (filterId !== "") {
      if (parseInt(id.textContent) === parseInt(filterId)) {
        //Coś zjebałem z wyszukiwaniem po id Niewiem czy czasem nie powinno być wyszukiwania po index w mainTableBody
        searchedRecords.push(rekordy[i]);
      }
    } else {
      searchedRecords.push(rekordy[i]);
    }
  }
}
