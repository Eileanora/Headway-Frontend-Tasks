
const button = document.getElementById('see-review');

button.addEventListener('click', function() {

    const review = document.getElementById('review');

    if (review.classList.contains('d-none')) {
        review.classList.remove('d-none');
        button.textContent = 'CLOSE REVIEW';
    }
    else {
        review.classList.add('d-none');
        button.textContent = 'SEE REVIEW';
    }
    

});


const header = document.getElementById('message');
header.style.fontWeight = 'purple'; // we use camelCase for CSS properties


// array functions
const names = ['Chris', 'Bob', 'Joe'];
names.push('Steve', 'btats'); // adds to end of array
names.unshift('John'); // adds to beginning of array
names.pop(); // removes last element of array
names.shift(); // removes first element of array
console.log(names); // ["Bob", "Joe", "Steve"]

// slice and splice
// slice does not modify the original array but returns a new array
// splice modifies the original array - used for adding or removing elements
const names2 = ['Chris', 'Bob', 'Joe'];
const newNames = names2.slice(1, 3); // ["Bob", "Joe"]
console.log(newNames);
console.log(names2); // ["Chris", "Bob", "Joe"]

// slice args are (start, end)
// splice args are (start, deleteCount, item1, item2, ...)

// adding elements with splice
const names3 = ['Chris', 'Bob', 'Joe'];
names3.splice(1, 0, 'Steve', 'Jeff'); // ["Chris", "Steve", "Jeff", "Bob", "Joe"]

// removing elements with splice
const names4 = ['Chris', 'Bob', 'Joe'];
names4.splice(1, 2); // ["Chris"]


// searchin arrays
const names5 = ['Chris', 'Bob', 'Joe'];
console.log(names5.indexOf('Bob')); // 1 - returns index of element
console.log(names5.indexOf('Steve')); // -1 - returns -1 if element not found
console.log(names5.includes('Joe')); // true - returns boolean

    // filter
    const names6 = ['Chris', 'Bob', 'Joe'];
    const filteredNames = names6.filter(function(name) {
        return name.includes('B'); // the function will be applied for all elements in the array
    });

    // find 
    const names7 = ['Chris', 'Bob', 'Joe'];
    const foundName = names7.find(function(name) {
        return name.includes('B'); // returns first element that matches the condition
    });

    // forEach
    const names9 = ['Chris', 'Bob', 'Joe'];
    names9.forEach(function(name) {
        console.log(name); // Executes a provided function once for each array element
    });

    // map
    const names8 = ['Chris', 'Bob', 'Joe'];
    const nameLengths = names8.map(function(name) {
        return name.length; // returns an array with the lengths of each element
        // used for transforming data in an array
    });


// Evenet listenrs
// DOM Content Loaded // fires when the initial HTML document has been completely loaded and parsed
document.addEventListener('DOMContentLoaded', function(){
    console.log('DOM Content Loaded');



});
window.addEventListener('DOMContentLoaded', function(){
    console.log('DOM Content Loaded');
    const orderButtons = document.querySelectorAll('button[data-order]');

    orderButtons.forEach(button => {
        button.addEventListener('click', e => {
            console.log(e.target.dataset.order); // logs the value of the data-order attribute
            const button = e.target; // the button that was clicked
            const container = button.parentElement; // the parent element of the button

            const order = {
                id: button.getAttribute('data-order'),
                title: container.querySelector('title').textContent,
                price: container.querySelector('price').textContent
            };

            // store the order in local storage to move them to the order page
            this.localStorage.setItem('order', JSON.stringify(order));

            // redirect to order page
            const url = window.location.href.replace('home', 'order');
            this.window.location.href = url;
            
        });
    }); 
});


// to retrieve the order from local storage
window.addEventListener('DOMContentLoaded', function(){

    const order = this.localStorage.getItem('order');
    if (order) {
        const parsedOrder = JSON.parse(order);
    }

    const pie = document.querySelector('pie');
    const title = pie.querySelector('title');
    const price = pie.querySelector('price');

    title.textContent = parsedOrder.title;
    price.textContent = parsedOrder.price;


    const img = pie.querySelector('img');
    img.setAttribute('src', `images/${parsedOrder.id}.jpg`);
    img.setAttribute('alt', parsedOrder.title);

    // ask for geolocation
    this.window.navigator.geolocation.getCurrentPosition(
        position => {
            let location = {
              latidude: position.coords.latitude,
              longitude: position.coords.longitude
            }
            location = JSON.stringify(location);

        },
        error => {
            console.log(error);
        }
    );
});


// ADV Array functions
let monthlySales = Array.of(500, 900, 800, 1000); // creates an array from the arguments
monthlySales.fill(0); // fills the array with the value 0


const app = {
    baseImgUrl: './assests/images/',
    headerData: ['', 'Name', 'Company', 'User', 'Cart', ''],
    data: [
      { 'name': 'Bessie Cooper', 'company': 'IBM', 'cart': '453 €' },
      { 'name': 'Wade Warren', 'company': 'L\'Oréal', 'cart': '994 €' },
      { 'name': 'Arlene McCoy', 'company': 'Gillette', 'cart': '429 €' },
      { 'name': 'Jenny Wilson', 'company': 'MasterCard', 'cart': '826 €' },
      { 'name': 'Kristin Watson', 'company': 'Gillette', 'cart': '561 €' },
      { 'name': 'Cameron Williamson', 'company': 'Louis Vuitton', 'cart': '540 €' }
    ],
  }
  
  function createCellContent(cellType, options) {
    let cell = document.createElement('td');
    let element;
  
    console.log(cellType, options);
  
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
        if (options.cellId) element.id = options.cellId;
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
          console.log(key, item[key]);
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
      });
      editSaveCell.appendChild(editCell);
  
      let saveBtn = createCellContent('img', {
        src: app.baseImgUrl + 'save.svg',
        alt: 'Save',
        innerClasses: ['icon', 'save-tr', 'text-center'],
        cellClasses: ['align-middle', 'save-tr', 'text-center', 'd-none'],
      });
      editSaveCell.appendChild(saveBtn);
  
      tr.appendChild(editSaveCell);
      tbody.appendChild(tr);
    });
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    createHeader();
    createRow(app.data);
  
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
          app.data[row.rowIndex - 2][td.classList[1].split('-')[0]] = content;
        });
  
        editBtn.classList.remove('d-none');
        saveBtn.classList.add('d-none');
      });
    });
  });
  