import date from './date.json' // читаем date.json локально при помощи возможностей сборщика Parcel

// Импортируем изображения
import sortByAlpha from './src/static/sort-by-alpha.svg'
import visibilityOn from './src/static/visibility-on.svg'
import visibilityOff from './src/static/visibility-off.svg'

const rowsOnPage = 10 // количество строк таблицы, выводимых на странице (по заданию)

// Создаём контейнер для таблицы и div'a с формой редактирования
const container = document.createElement('div')

document.body.append(container)
container.id = 'container'

// Создаём таблицу 
const table = document.createElement('table')
 
container.prepend(table)

for (let i = 0; i < rowsOnPage; i++) {       // заполняем таблицу строками (кол-во строк === rowsOnPage)
  const tr = document.createElement('tr')
  tr.dataset.id = i                          // присваиваем каждой строке data-id

  table.append(tr)
}

const rows = document.querySelectorAll('tr')

for (let row of rows) {                      // заполняем строки ячейками (по 4, в соответствии с заданием)
  for (let i = 0; i < 4; i++) {
    row.append(document.createElement('td'))
  }
}


//--------------------------------------------------------------------------------------------------------------------------
// ЗАПОЛНЯЕМ ВСЕ КОЛОНКИ ТАБЛИЦЫ СООТВЕТСТВУЮЩИМИ ДАННЫМИ ИЗ JSON-ФАЙЛА И РЕАЛИЗУЕМ ПАГИНАЦИЮ

// Заносим колонки в соответствующие константы
const columnName = document.querySelectorAll('tr > td:nth-child(1)')
const columnLastName = document.querySelectorAll('tr > td:nth-child(2)')
const columnAbout = document.querySelectorAll('tr > td:nth-child(3)')
const columnEyeColor = document.querySelectorAll('tr > td:nth-child(4)')

// Для более удобной навигации добавим каждой ячейке дата-атрибут с номером своей колонки
for (let cell of columnName) {
  cell.dataset.column = 0
}

for (let cell of columnLastName) {
  cell.dataset.column = 1
}

for (let cell of columnAbout) {
  cell.dataset.column = 2
}

for (let cell of columnEyeColor) {
  cell.dataset.column = 3
}

const numberOfBtns = date.length / rowsOnPage // определяем количество кнопок пагинации (в их роли выступят элементы li)

// Создаём и добавляем на страницу кнопки для пагинации
const paginationList = document.createElement('ul')

document.body.append(paginationList)
paginationList.id = 'paginationList'

for (let i = 1; i <= numberOfBtns; i++) {
  const pageBtn = document.createElement('li')

  paginationList.append(pageBtn)
  pageBtn.textContent = i
}

// Заполняем ячейки таблицы по умолчанию первыми rowsOnPage элементами массива данных
for (let i = 0; i < rowsOnPage; i++) {
  columnName[i].textContent = date[i].name.firstName
  columnLastName[i].textContent = date[i].name.lastName
  columnAbout[i].textContent = date[i].about
  columnEyeColor[i].textContent = date[i].eyeColor
}

// Создаём и заполняем заголовочные ячейки
const headerRow = document.createElement('tr')
headerRow.id = 'headerRow'

table.prepend(headerRow)
for (let i = 0; i < 4; i++) {
  headerRow.append(document.createElement('th'))
}

const headerCells = document.querySelectorAll('th')

for (let cell of headerCells) {
  cell.classList.add('headerCell')
}

headerCells[0].textContent = 'First Name'
headerCells[1].textContent = 'Last name'
headerCells[2].textContent = 'About'
headerCells[3].textContent = 'Eye color'

headerCells.forEach((cell, i) => { // для заголовочных ячеек также устанавливаем дата-атрибут своей колонки
  cell.dataset.column = i
})

// Напишем функцию окрашивания ячеек колонки "Цвет в глаз" в сооответствии со значением
const paintTheCells = () => {
  for (let i = 0; i < rowsOnPage; i++) {
    columnEyeColor[i].style.background = columnEyeColor[i].textContent
  }
}

paintTheCells() // вызываем эту функцию, чтобы ячейки были окрашены по умолчанию

let dateCashed = [...date] // кэшурием JSON для того, чтобы локально сохранять изменения при редактировании данных

let currentPage = 1 // объявляем переменную, запоминающую текущую страницу со значением по умолчанию - 1

// Функция заполнения таблицы актуальными данными из кэшированного JSON'a 
const fillInTheTable = () => {
  let start = (currentPage - 1) * rowsOnPage // По формуле определяем с элемента массива данных начать выводить данные в таблицу для каждой страницы
  let end = start + rowsOnPage             // Определяем на каком элементе массива данных прекратить вывод данных в таблицу для каждой страницы
  let dateCashedSliced = dateCashed.slice(start, end)  // "Режем" массив данных в зависимости от того, на клавишу с каким номером страницы произошёл клик
  
  // Заполняем таблицу данными dateSliced (соответствующими нажатой кнопке)
  for (let i = 0; i < rowsOnPage; i++) {
    columnName[i].textContent = dateCashedSliced[i].name.firstName
    columnLastName[i].textContent = dateCashedSliced[i].name.lastName
    columnAbout[i].textContent = dateCashedSliced[i].about
    columnEyeColor[i].textContent = dateCashedSliced[i].eyeColor
  }
}

// Вешаем на каждую кнопку пагинации слушатель клика
paginationList.addEventListener('click', e => {
  currentPage = +e.target.textContent        // Определяем номер страницы, которую хочет получить пользователь, кликнув на соответствующую кнопку 
  
  fillInTheTable()

  paintTheCells() // сохраняем возможность отображения корректного цвета при переходе между страницами
})


//--------------------------------------------------------------------------------------------------------------------------
// РЕАЛИЗУЕМ ФУНКЦИЮ РЕДАКТИРОВАНИЯ ДАННЫХ СТРОКИ, НА КОТОРОЙ ПРОИЗОШЁЛ КЛИК

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

// Для удобства запишем каждый инпут в свою переменную
const inputName = inputs[0]
const inputLastName = inputs[1]
const inputAbout = inputs[2]
const inputEyeColor = inputs[3]

const formBtn = document.createElement('button')
formContainer.append(formBtn)

formBtn.textContent = 'Edit'

// Озаглавим input'ы

inputHeaders[0].textContent = 'First Name'
inputHeaders[1].textContent = 'Last name'
inputHeaders[2].textContent = 'About'
inputHeaders[3].textContent = 'Eye color'

formContainer.style.visibility = 'hidden' // форма редактирования по умолчанию скрыта

let trIndex // объявляем переменную, в которой будет содержаться индекс строки, по которой кликнули

table.addEventListener('click', e => {
  let tr = e.target.closest('tr') // при клике на строки e.target === td, поэтому используем метод closest
  let trId = tr.dataset.id        // получаем id строки, по которой кликнули

  trIndex = ((+currentPage - 1) * 10) + +trId // по формуле определяем индекс строки по которой кликнули

  for (let row of rows) {
    row.removeAttribute('data-clicked') // после кажого клика удаляем все атрибуты у строк
    row.style.background = '#fff' // и убираем заливку строки, на которую кликнули
  }

  if (tr && tr.id !== 'headerRow') { // игнорируем заголовочную строку
    tr.dataset.clicked = 'clicked' // если клик произошёл про строке - устанавливаем дата-атрибут 'clicked' кликнутой строке
    formContainer.style.visibility = 'visible' // делаем видимым блок редактирования

    if (tr.hasAttribute('data-clicked')) {
      tr.style.background = 'orange' // окрашиваем "кликнутую" строку
    }
  } 
})

// "Вешаем" слушатель события клика на кнопку "Edit"
formBtn.addEventListener('click', () => {
  for (let row of rows) {
    row.style.background = '#fff' // убираем заливку со строки

    /* if (row.dataset.clicked) {                          // ищем строку, на котороую кликнули
      for (let i = 0; i < headerCells.length; i++) {
        if (inputs[i].value !== '') {                   // если input не пустой, тогда добавляем в ячейку новое значение иначе сохраняется старое
          row.children[i].textContent = inputs[i].value // записывем значение из input'ов в содержимое ячеек соответствующей строки для мнговенного отображения изменений
        }
      }
    } */
  }

 

  // Записываем изменения в закэшированный объект JSON 
  if (inputName.value !== '') {
    dateCashed[trIndex].name.firstName = inputName.value
  }
  if (inputLastName.value !== '') {
    dateCashed[trIndex].name.lastName = inputLastName.value
  }
  if (inputAbout.value !== '') {
    dateCashed[trIndex].about = inputAbout.value
  }
  if (inputEyeColor.value !== '') {
    dateCashed[trIndex].eyeColor = inputEyeColor.value
  }

  fillInTheTable()             // заново парсим dateCashed и заполняем таблицу отредактированными данными
  
  for (let input of inputs) {  // очищаем input'ы после каждого редактирования
    input.value = ''
  }

  formContainer.style.visibility = 'hidden' // скрываем блок редактирования после нажатия на клавишу "Редактировать"
  

  paintTheCells()                           // вызываем функцию окраски ячеек столбца "Цвет глаз"
})


//--------------------------------------------------------------------------------------------------------------------------
// РЕАЛИЗУЕМ ФУНКЦИЮ СОРИТРОВКИ ДАННЫХ И СКРЫТИЯ/ПОКАЗА КОЛОНОК

for (let cell of headerCells) {     // добавляем в заголовочные ячейки иконки сорировки и скрытия колонок
  const imgSort = new Image(20, 20)
  const imgHide = new Image (20, 20)

  cell.append(imgSort)
  cell.append(imgHide)

  imgSort.src = sortByAlpha
  imgHide.src = visibilityOff

  imgSort.classList.add('imgSort')
  imgHide.classList.add('imgHide')
}

const imgsSort = document.querySelectorAll('.imgSort')
const imgsHide = document.querySelectorAll('.imgHide')

// Функция сортировки
const sortAZ = (column) => { // сортировка от a до z
  let sorted = Array.from(rows) // преобразовываем псевдомассив в массив, чтобы иметь возможность использовать метод массива sort()
    .sort((a, b) => a.cells[column].textContent > b.cells[column].textContent ? 1 : -1) // Сортируем массив текстовому содержимому ячеек указанной колонки

  table.append(...sorted) // заполняем таблицу отсортированными данными
}

const sortZA = (column) => { //сортировка от z до a
  let sorted = Array.from(rows)
    .sort((a, b) => a.cells[column].textContent > b.cells[column].textContent ? -1 : 1)

  table.append(...sorted)
}

const rowsArr = [columnName, columnLastName, columnAbout, columnEyeColor] // для удобства добавим в массив все столбцы, в соответствии с их индексами

// Cоздаём пустой массив и заполняем его содержимым заголовочных ячеек
let headerCellsInners = []  

for (let cell of headerCells) {
  headerCellsInners.push(cell.innerHTML)
}

let clickCounter = 0     // объявляем счётчик кликов для реализации функции сортировки

// "Вешаем" счётчик кликов на строку с заголовочными ячейками
headerRow.addEventListener('click', e => { 
  let i = e.target.closest('th').dataset.column               // Записываем в переменную i индекс столбца, в котором находится заголовочная ячейка
  
  let clickOnImgHide = e.target.classList.contains('imgHide')
  let clickOnImgShow = e.target.classList.contains('imgShow')

  // Реализуем возможность соритровки
  if (e.target.classList.contains('imgSort')) {     // при каждом чётном клике по иконке сортировки отрабатывает функция sortZA
    clickCounter++                                  // при нечётном - sortAZ
    clickCounter % 2 === 0 ? sortZA(i) : sortAZ(i)  
  }

  // При клике на иконку "отобразить" и "скрыть" добавляется и убирается дата-атрибут hidden соответственно
  if (clickOnImgHide) e.target.closest('th').dataset.hidden = 'true'    
  if (clickOnImgShow) e.target.closest('th').removeAttribute('data-hidden')

  let checkHiddenColumn = document.querySelectorAll('[data-hidden') // проверяем сколько колонок скрыто на данный момент
  
  // Реализуем возможность скрытия колонок
  if (clickOnImgHide) { 
    if (checkHiddenColumn.length < headerCells.length) {  // условие, необходимое для того, чтобы предотвратить скрытие последней нескрытой колонки (иначе, при скрытии всех колонок отобразится таблица с пустыми строками)
      const imgShow = new Image (20, 20)                  // создаём новую иконку

      headerCells[i].textContent = ''                     // очищаем заголовочную ячейку, на которой произошёл клик (для того, чтобы корректно, без деформации "сжималась" скрытая ячейка)
      
      imgShow.src = visibilityOn
      imgShow.classList.add('imgShow')
      imgShow.dataset.column = i                          // также записываем дата-атрибутом новой иконки индекс колонки, в которой она находится

      
      headerCells[i].append(imgShow)                      // помещаем imgShow в "кликнутую" заголовочную ячейку

      imgShow.style.visibility = 'visible'                // и делаем её видимой


      headerCells[i].classList.add('hidden')              // скрываем заголовочную ячейку...

      for (let row of rowsArr[i]) {                       // ...и весь остальной столбец
        row.classList.add('hidden')
      }
    }
  }
  
  // Реализуем возмножность отображения колонок после скрытия
  if (e.target.classList.contains('imgShow')) {
    headerCells[i].classList.remove('hidden') // удаляем класс hidden у всей колонки

    for (let row of rowsArr[i]) {      
      row.classList.remove('hidden')
    }

    headerCells[i].innerHTML = headerCellsInners[i] // возвращаем соответствующее содержимое заголовочной колонки
  }
  
  // Фикс странного поведения CSS: при скрытии колонки "Описание" пропадала правая рамка
  if (+i === 2) {                      
    for (let cell of columnEyeColor) {
      cell.classList.remove('fixBorder1')
    }
  }
})