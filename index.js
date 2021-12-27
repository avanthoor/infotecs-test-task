import date from './date.json' //Читаем date.json локально при помощи возможностей сборщика Parcel

//Создаём таблицу
const table = document.createElement('table')
 
document.body.prepend(table)

//Создаём колонки

for (let i = 0; i < 4; i++) {
  table.append(document.createElement('tr'))
}

//и именуем их

const tr = document.querySelectorAll('tr')

const name = tr[0]
const lastName = tr[1]
const about = tr[2]
const eyeColor = tr[3]

name.textContent = 'Имя'
lastName.textContent = 'Фамилия'
about.textContent = 'Описание'
eyeColor.textContent = 'Цвет глаз'

//Создаём ячейки в колонках

for (let i = 0; i < date.length; i++) {
  name.append(document.createElement('td'))
  lastName.append(document.createElement('td'))
  about.append(document.createElement('td'))
  eyeColor.append(document.createElement('td'))
}

//Выбираем все ячейки, принадлежащие своим колонкам
const trName = document.querySelectorAll('tr:nth-child(1) > td') 
const trLastName = document.querySelectorAll('tr:nth-child(2) > td') 
const trAbout = document.querySelectorAll('tr:nth-child(3) > td') 
const trEyeColor = document.querySelectorAll('tr:nth-child(4) > td') 

//Заполняем табицу данными
for (let i = 0; i < date.length; i++) {
  trName[i].textContent = date[i].name.firstName
  trLastName[i].textContent = date[i].name.lastName
  trAbout[i].textContent = date[i].about
  trEyeColor[i].textContent = date[i].eyeColor
}







