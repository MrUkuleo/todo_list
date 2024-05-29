let todos = JSON.parse(localStorage.getItem('todos')) ?? []
let todosContainer = document.querySelector('.todos')
let todo = todosContainer.firstElementChild
let form = document.querySelector('form')
let dropdown = document.querySelector('.dropdown')
let modal = document.querySelector('.modal')

form.addEventListener('submit', (event) => {
    event.preventDefault()

    let value = form['input'].value

    if (!value) return showModal('Введите текст задачи', 'Ок')

    if (todos.find((todo) => todo.title === value)) {
        showModal('Такая задача уже добавлена', 'Ок')
        form['input'].blur()
        return
    }

    let newTodo = {
        id: new Date().getTime(),
        title: value,
        completed: false
    }
    todos.push(newTodo)
    localStorage.setItem('todos', JSON.stringify(todos))
    showTodo(newTodo)
    form.reset()
})

dropdown.addEventListener('click', (event) => {
    dropdown.classList.toggle('is-active')

    window.onclick = (e) => {
        if (event.target !== e.target) {
            dropdown.classList.remove('is-active')
        }
    }
})

todos.forEach((todo) => showTodo(todo))


function showTodo(object) {
    let clone = todo.cloneNode(true)

    clone.setAttribute('id', object.id)
    clone.querySelector('.todo-title').textContent =
        object.title.length <= 25
            ? object.title
            : object.title.slice(0, 25) + '...'

    object.completed
        ? clone.querySelector('.checkbox').setAttribute('checked', true)
        : 0

    clone.querySelector('.remove').dataset.id = object.id
    clone.querySelector('.edit').dataset.id = object.id
    clone.querySelector('.checkbox').dataset.id = object.id

    clone.classList.remove('is-hidden')
    todosContainer.append(clone)
    counter()
}

function counter() {
    document.querySelector('.todo-counter').textContent =
        todos.length
}

function showModal(modalText, buttonText, buttonHandler = null) {
    modal.classList.toggle('is-active')

    modal.querySelector('.modal-text').textContent = modalText

    const button = document.createElement('button')
    button.className = 'button is-info is-fullwidth'
    button.textContent = buttonText

    const buttons = modal.querySelector('.buttons')
    buttons.innerHTML = ''
    buttons.append(button)

    button.onclick = !buttonHandler
        ? () => modal.classList.remove('is-active')
        : buttonHandler

    modal.querySelector('.modal-close').onclick = () =>
        modal.classList.remove('is-active')

    document.onkeydown = (event) => {
        switch (event.key) {
            case 'Enter':
                buttonHandler
                    ? buttonHandler()
                    : modal.classList.remove('is-active')
            default:
                modal.classList.remove('is-active')
        }
    }
}

function deleteTodo(id) {
    const deleteElement = document.getElementById(id)

    showModal('Подтвердите удаление задачи', 'Удалить',
        () => {
            deleteElement.remove()
            modal.classList.remove('is-active')

            todos = todos.filter((todo) => todo.id != id)
            localStorage.setItem('todos', JSON.stringify(todos))
            counter()
        })
}

function toggleStatus(id) {
    todos = todos.map((todo) =>
        todo.id == id
            ? { ...todo, completed: !todo.completed }
            : todo
    )
    localStorage.setItem('todos', JSON.stringify(todos))

    document.getElementById(id).querySelector('.todo-title')
        .classList.toggle('completed')
}
