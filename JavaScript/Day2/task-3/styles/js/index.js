const app = {
  baseImgUrl: './assests/images/',
  headerData: ['', 'Name', 'Company', 'User', 'Cart', '']
}

let tableData = [
  { 'name': 'Bessie Cooper', 'company': 'IBM', 'cart': '453 €' },
  { 'name': 'Wade Warren', 'company': 'L\'Oréal', 'cart': '994 €' },
  { 'name': 'Arlene McCoy', 'company': 'Gillette', 'cart': '429 €' },
  { 'name': 'Jenny Wilson', 'company': 'MasterCard', 'cart': '826 €' },
  { 'name': 'Kristin Watson', 'company': 'Gillette', 'cart': '561 €' },
  { 'name': 'Cameron Williamson', 'company': 'Louis Vuitton', 'cart': '540 €' }
];


function saveLocalStorage() {
  localStorage.setItem('tableData', JSON.stringify(tableData));
}

function loadLocalStorage() {
  const data = localStorage.getItem('tableData');
  if (data) tableData = JSON.parse(data);
}

function createCellContent(cellType, options) {
  var elementType='td';
  if(options.asDiv){
    elementType='div';
  }
  let cell = document.createElement(elementType);
  let element;

  switch (cellType) {
    case 'text':
      element = document.createTextNode(options.text);
      break;
    case 'img':
      element = document.createElement('img');
      element.src = options.src;
      element.alt = options.alt;
      if (options.innerClasses) element.classList.add(...options.innerClasses);
      break;
    case 'checkbox':
      element = document.createElement('input');
      element.type = 'checkbox';
      if (options.innerClasses) element.classList.add(...options.innerClasses);
      // if (options.cellId) element.id = options.cellId;
      break;
  }

  if (options.cellClasses) cell.classList.add(...options.cellClasses);

  cell.appendChild(element);
  return cell;
}

function createHeader() {
  let table = document.querySelector('table');
  let thead = table.tHead || table.createTHead();
  let headerRow = document.createElement('tr');

  app.headerData.forEach((item) => {
    let th = document.createElement('th');
    th.textContent = item;
    th.classList.add('col-1', 'align-middle');
    if (item === 'User') th.classList.add('text-center');
    if (item === 'Cart') th.classList.add('text-end');
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
}

function createCell(headerName) {
  let cell = document.createElement('td');

  const trClass = headerName.toLowerCase() + '-tr';
  const classes = ['align-middle', trClass];
  cell.classList.add(...classes);

  return cell;
}

function createRow(data) {
  let table = document.querySelector('table');
  let tbody = table.tBodies[0];

  // empty row for the striped table
  let tr = document.createElement('tr');
  tr.classList.add('d-none');
  tbody.appendChild(tr);

  data.forEach((item) => {
    let tr = document.createElement('tr');

    let cell = createCellContent('checkbox', {
      innerClasses: ['form-check-input'],
      cellClasses: ['align-middle', 'text-center'],
      cellId: 'flexCheckDefault',
    });
    tr.appendChild(cell);

    app.headerData.forEach((header) => {
      if (header === 'User') {
        let imgCell = createCellContent('img', {
          src: app.baseImgUrl + item.name.toLowerCase().split(' ').join('-') + '-pfp' + '.svg',
          alt: item.name,
          innerClasses: ['avatar', 'icon'],
          cellClasses: ['align-middle', 'User-tr', 'text-center'],
        });
        tr.appendChild(imgCell);
      } else if (header && header !== "") {
        let key = header.toLowerCase();

        let textCell = createCellContent('text', {
          text: item[key],
          cellClasses: ['align-middle', `${key}-tr`, 'data'],
        });
        tr.appendChild(textCell);
      }
    });

    let editSaveCell = document.createElement('td');
    editSaveCell.classList.add('align-middle', 'btn-wrapper', 'text-center');

    let editCell = createCellContent('img', {
      src: app.baseImgUrl + 'edit.svg',
      alt: 'Edit',
      innerClasses: ['icon'],
      cellClasses: ['align-middle', 'edit-tr', 'text-center'],
      asDiv:true
    });
    editSaveCell.appendChild(editCell);

    let saveBtn = createCellContent('img', {
      src: app.baseImgUrl + 'save.svg',
      alt: 'Save',
      innerClasses: ['icon', 'save-tr', 'text-center'],
      cellClasses: ['align-middle', 'save-tr', 'text-center', 'd-none'],
      asDiv:true
    });
    editSaveCell.appendChild(saveBtn);

    tr.appendChild(editSaveCell);
    tbody.appendChild(tr);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  createHeader();
  createRow(tableData);

  let editSaveBtns = document.querySelectorAll('.btn-wrapper');
  editSaveBtns.forEach((btnWrapper) => {
    let editBtn = btnWrapper.querySelector('.edit-tr');
    let saveBtn = btnWrapper.querySelector('.save-tr');

    editBtn.addEventListener('click', () => {
      let row = editBtn.closest('tr');

      row.querySelectorAll('td.data').forEach((td) => {
        const content = td.textContent;
        td.innerHTML = `<input class="form-control form-control-sm" type="text" value="${content}" />`;
      });

      editBtn.classList.add('d-none');
      saveBtn.classList.remove('d-none');
    });

    saveBtn.addEventListener('click', () => {
      let row = saveBtn.closest('tr');
      row.querySelectorAll('td.data').forEach((td) => {
        const content = td.querySelector('input').value;
        td.textContent = content;
        tableData[row.rowIndex - 2][td.classList[1].split('-')[0]] = content;
      });

      saveLocalStorage();
      editBtn.classList.remove('d-none');
      saveBtn.classList.add('d-none');
    });
  });
});
