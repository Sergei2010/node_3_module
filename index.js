const express = require('express')
const chalk = require('chalk')
// const fs = require('fs/promises')
const path = require('path')
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller')

const port = 3000

const app = express()

// переопределяем папку с файлами
app.set('views', 'pages')

// определяем шаблонизатор 'ejs'
app.set('view engine', 'ejs')

// необходимо обозначить, что папка "public" - статическая
app.use(express.static(path.resolve(__dirname, 'public')))

app.use(express.json())

// с какими данными работаем
app.use(
	express.urlencoded({
		extended: true
	})
)

// неободимо обработать GET запрос
app.get('/', async (req, res) => {
	// передаваемые параметры
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false
	})
})

// неободимо обработать POST запрос
app.post('/', async (req, res) => {
	await addNote(req.body.title)

	// передаваемые параметры
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: true // флаг создания note для alert
	})
})

// для удаления определённой note
app.delete('/:id', async (req, res) => {
	await removeNote(req.params.id)

	// передаваемые параметры
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false // флаг создания note для alert
	})
})

// редактирование данных
app.put('/:id', async (req, res) => {
	await updateNote({ id: req.params.id, title: req.body.title })

	// передаваемые параметры
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false // флаг создания note для alert
	})
})

app.listen(port, () => {
	console.log(chalk.green(`Server has been started on port ${port}...`))
})
