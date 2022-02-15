const yargs = require('yargs')

// гибкая настройка получения версий
const pkg = require('./package.json')
const { addNote, printNotes, removeNote } = require('./notes.controller')

yargs.version(pkg.version)

// регистрируем команду "add"
yargs.command({
	command: 'add',
	describe: 'Add new note to list',
	// с какими полями инициировать заментку
	builder: {
		title: {
			type: 'string',
			describe: 'Note title',
			demandOption: true
		}
	},
	handler({ title }) {
		addNote(title)
	}
})

// регистрируем команду "list"
yargs.command({
	command: 'list',
	describe: 'Print all notes',
	async handler() {
		printNotes()
	}
})

yargs.command({
	command: 'remove',
	describe: 'Remove note by id',
	builder: {
		id: {
			type: 'string',
			describe: 'Note uniq id',
			demandOption: true
		}
	},
	async handler({ id }) {
		removeNote(id)
	}
})

// инициализируем зарегистрированные команды
yargs.parse()
