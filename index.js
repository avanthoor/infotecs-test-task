// Читаем date.json локально при помощи возможностей сборщика Parcel
import date from './date.json'

// Создаём таблицу 
const table = document.createElement('table')
 
document.body.prepend(table)

for (let el of date) {
  table.append(document.createElement('tr'))
}

const rows = document.querySelectorAll('tr')

for (let row of rows) {
  for (let i = 0; i < 4; i++) {
    row.append(document.createElement('td'))
  }
}

// Заполняем все колонки таблицы соответствующими данными из JSON-файла
const columnName = document.querySelectorAll('tr > td:nth-child(1)')
const columnLastName = document.querySelectorAll('tr > td:nth-child(2)')
const columnAbout = document.querySelectorAll('tr > td:nth-child(3)')
const columnEyeColor = document.querySelectorAll('tr > td:nth-child(4)')


for (let i = 0; i < date.length; i++) {
  columnName[i].textContent = date[i].name.firstName
  columnLastName[i].textContent = date[i].name.lastName
  columnAbout[i].textContent = date[i].about
  columnEyeColor[i].textContent = date[i].eyeColor
}

//Создаём и заполяем заголовочные ячейки
const headerRow = document.createElement('tr')
headerRow.id = 'headerRow'

table.prepend(headerRow)
for (let i = 0; i < 4; i++) {
  headerRow.append(document.createElement('th'))
}

const headerCells = document.querySelectorAll('th')

headerCells[0].innerHTML = '<div>Имя (firstName)</div>'
headerCells[1].innerHTML = '<div>Фамилия (lastName)</div>'
headerCells[2].innerHTML = '<div>Описание <br>(about)</div>'
headerCells[3].innerHTML = '<div>Цвет глаз (eyeColor)</div>'

// Реализуем сортировку колокнок при нажатии на соответствующую кнопку
for (let i = 0; i < headerCells.length; i++) {
  const img = new Image(20, 20)
  img.src = 'https://img.icons8.com/material/50/000000/sorting-arrows--v1.png'
  headerCells[i].append(img)
}

const imgs = document.querySelectorAll('img')

// Функция сортировки
const sortAZ = (column) => {
  let sorted = Array.from(rows)
    .sort((a, b) => a.cells[column].textContent > b.cells[column].textContent ? 1 : -1)

  table.append(...sorted)
}

const sortZA = (column) => {
  let sorted = Array.from(rows)
    .sort((a, b) => a.cells[column].textContent > b.cells[column].textContent ? -1 : 1)

  table.append(...sorted)
}
// Вешаем обработчики событий на соответствующие кнопки. Теперь при кликах на кнопки данные будут сортироваться
// от A до Z и от Z до A поочерёдно
let clickCounter = 0

for (let i = 0; i < headerCells.length; i++) {
  imgs[i].addEventListener('click', () => {
    clickCounter++
    clickCounter % 2 === 0 ? sortZA(i) : sortAZ(i)
  })
}

// Редактирование данных
// Создадим div с формой редактирования данных

const formContainer = document.createElement('div')
formContainer.id = 'formContainer'
table.after(formContainer)

const form = document.createElement('form')
formContainer.append(form)

for (let i = 0; i < headerCells.length; i++) {
  form.append(document.createElement('h3'))
  form.append(document.createElement('input'))
}

const inputHeaders = document.querySelectorAll('h3')
const inputs = document.querySelectorAll('input')

const formBtn = document.createElement('button')
formContainer.append(formBtn)

formBtn.textContent = 'Редактировать'

// Озаглавим input'ы

inputHeaders[0].textContent = 'Имя'
inputHeaders[1].textContent = 'Фамилия'
inputHeaders[2].textContent = 'Описание'
inputHeaders[3].textContent = 'Цвет глаз'

// Реализуем функцию редактирования данных при клике на соответствующую строку

formContainer.style.visibility = 'hidden' // форма редактирования по умолчанию скрыта

table.addEventListener('click', e => {
  let tr = e.target.closest('tr') // при клике на строки e.target === td, поэтому используем метод closest

  formContainer.style.visibility = 'visible' // делаем видимым блок редактирования

  for (let row of rows) {
    row.removeAttribute('data-clicked') // после кажого клика удаляем все атрибуты у строк
    row.style.background = '#fff' // и убираем заливку строки, на которую кликнули
  }

  if (tr && tr.id !== 'headerRow') { // игнорируем заголовочную строку
    tr.dataset.clicked = 'clicked' // если клик произошёл про строке - устанавливаем дата-атрибут 'clicked' кликнутой строке
    
    if (tr.hasAttribute('data-clicked')) {
      tr.style.background = 'orange' // окрашиваем кликнутую строку
    }
  } 

})

formBtn.addEventListener('click', () => {
  for (let row of rows) {
    row.style.background = '#fff' // убираем заливку со строки

    if (row.dataset.clicked) {
      for (let i = 0; i < headerCells.length; i++) {
        if (inputs[i].value !== '') {
          row.children[i].textContent = inputs[i].value
        }
      }
    }
  }

  for (let input of inputs) {  //очищаем input'ы после каждого редактирования
    input.value = ''
  }

  formContainer.style.visibility = 'hidden' // скрываем блок редактирования после нажатия на клавишу "Редактировать"
})

/* for (let cell of columnAbout) {
  console.log(cell.style.height)
} */


