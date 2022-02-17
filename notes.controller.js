const fs = require('fs/promises')
const path = require('path')
const chalk = require('chalk')

const notesPath = path.join(__dirname, 'db.json')
console.log(notesPath)

async function addNote(title) {
	// получил данные
	const notes = await getNotes()
	// создал объект
	const note = {
		title,
		id: Date.now().toString()
	}
	// добавляю объект в БД
	notes.push(note)
	// записываю изменения в файл
	await saveNotes(notes)
	console.log(chalk.green.inverse('Node was added'))
}

async function getNotes() {
	const notes = await fs.readFile(notesPath, { encoding: 'utf-8' })
	return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function saveNotes(notes) {
	await fs.writeFile(notesPath, JSON.stringify(notes))
}

async function printNotes() {
	const notes = await getNotes()

	console.log(chalk.bgBlue('Here is the list of notes'))
	notes.forEach((note) => {
		console.log(chalk.bgWhite(note.id), chalk.blue(note.title))
	})
}

async function removeNote(id) {
	const notes = await getNotes()

	const filtered = notes.filter((n) => n.id !== id)

	await saveNotes(filtered)
	console.log(chalk.red(`Note with id="${id}" has been removed!`))
}

async function updateNote(noteData) {
	const notes = await getNotes()
	const index = notes.findIndex((note) => note.id === noteData.id)
	if (index >= 0) {
		notes[index] = { ...notes[index], ...noteData }
		await saveNotes(notes)
		console.log(chalk.bgGreen(`Note with id="${noteData.id}" has been updated!`))
	}
}

// экспорт ф-ий наружу
module.exports = {
	addNote,
	getNotes,
	removeNote,
	updateNote
}
