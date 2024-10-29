window.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add');
  const input = document.getElementById('add-input');
  const displayBtn = document.getElementById('display');

  let list = [];

  addBtn.addEventListener('click', () => {
    if (input.value) {
      list.push(input.value);
      input.value = '';
    } else {
      alert('Please enter a value');
    }
  });

  displayBtn.addEventListener('click', () => {
    const display = document.getElementById('output-list');

    if (display.hasChildNodes()) {
      display.innerHTML = '';
    }

    for (let i = 0; i < list.length; i++) {
      const number = 'Element ' + i + ' = ' + list[i];
      const listItem = createListItem(number);
      display.appendChild(listItem);
    }
  });
});

function createListItem(number) {
  const listItem = document.createElement('li');
  listItem.textContent = number;
  return listItem;
}
