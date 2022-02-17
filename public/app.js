document.addEventListener('click', (event) => {
	if (event.target.dataset.type === 'remove') {
		const id = event.target.dataset.id

		// необходимо отправить запрос
		remove(id).then(() => {
			event.target.closest('li').remove()
		})
	}
	// для редактирования по 'id && title'
	if (event.target.dataset.type === 'edit') {

		const $task = event.target.closest('li')
		const id = event.target.dataset.id
		const title = event.target.dataset.title
		const initialHtml = $task.innerHTML

		$task.innerHTML = `
			<input type="text" value="${title}" class="w-75">
			<div>
			<button class="btn btn-success" data-type="save">Сохранить</button>
			<button class="btn btn-danger" data-type="cancel">Отменить</button>
			</div>
		`
		const taskListener = ({ target }) => {
			if (target.dataset.type === 'cancel') {
				$task.innerHTML = initialHtml
				$task.removeEventListener('click', taskListener)
			}
			if (target.dataset.type === 'save') {
				const title = $task.querySelector('input').value
				update({ title, id }).then(() => {
					$task.innerHTML = initialHtml
					$task.querySelector('span').innerText = title
					$task.querySelector('[data-type=edit]').dataset.title = title
					$task.removeEventListener('click', taskListener)
				})
			}
		}

		$task.addEventListener('click', taskListener)

		// const newTitle = prompt('Введите новое название', title)
		// console.log('newTitle: ', newTitle)
		/* if (newTitle !== null) {
			update({ id, title: newTitle }).then(() => {
				event.target.closest('li').querySelector('span').innerText = newTitle
			})
		} */
	}
})

async function update(newNote) {
	await fetch(`/${newNote.id}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newNote)
	})
}

async function remove(id) {
	await fetch(`/${id}`, {
		method: 'DELETE'
	})
}
