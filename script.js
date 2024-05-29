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

function editTodo(id) {
    const todo = todos.find((todo) => todo.id == id);
    const editModal = document.createElement('div');
    editModal.className = 'modal is-active';

    editModal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <div class="field">
                    <label class="label">Изменить задачу</label>
                    <div class="control">
                        <input id="edit-input" class="input" type="text" value="${todo.title}">
                    </div>
                </div>
                <div class="buttons is-centered">
                    <button class="button is-success" id="save-edit">Сохранить</button>
                    <button class="button is-danger" id="cancel-edit">Отмена</button>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
    `;

    document.body.appendChild(editModal);

    document.getElementById('save-edit').onclick = () => {
        const newValue = document.getElementById('edit-input').value;
        if (!newValue) {
            alert('Введите текст задачи');
            return;
        }
        
        todo.title = newValue;
        localStorage.setItem('todos', JSON.stringify(todos));
        document.getElementById(id).querySelector('.todo-title').textContent = newValue.length <= 25 ? newValue : newValue.slice(0, 25) + '...';
        closeEditModal();
    };

    document.getElementById('cancel-edit').onclick = closeEditModal;
    document.querySelector('.modal-close').onclick = closeEditModal;

    function closeEditModal() {
        document.body.removeChild(editModal);
    }
}

function showTodo(object) {
    let clone = todo.cloneNode(true);

    clone.setAttribute('id', object.id);
    clone.querySelector('.todo-title').textContent =
        object.title.length <= 25
            ? object.title
            : object.title.slice(0, 25) + '...';

    object.completed
        ? clone.querySelector('.checkbox').setAttribute('checked', true)
        : 0;

    clone.querySelector('.remove').dataset.id = object.id;
    clone.querySelector('.edit').dataset.id = object.id;
    clone.querySelector('.checkbox').dataset.id = object.id;

    clone.classList.remove('is-hidden');
    todosContainer.append(clone);
    counter();
}

// Обработчик события для кнопки "Изменить"
function addEditButtonEventListeners() {
    document.querySelectorAll('.edit').forEach(button => {
        button.onclick = () => editTodo(button.dataset.id);
    });
}

todos.forEach((todo) => showTodo(todo));
addEditButtonEventListeners();

// Функция для показа модального окна с подтверждением
function showConfirmationModal(modalText, confirmText, confirmHandler) {
    modal.classList.add('is-active');
    modal.querySelector('.modal-text').textContent = modalText;
    
    const buttons = modal.querySelector('.buttons');
    buttons.innerHTML = '';

    const confirmButton = document.createElement('button');
    confirmButton.className = 'button is-danger is-fullwidth';
    confirmButton.textContent = confirmText;

    const cancelButton = document.createElement('button');
    cancelButton.className = 'button is-info is-fullwidth';
    cancelButton.textContent = 'Отмена';

    buttons.append(confirmButton, cancelButton);

    confirmButton.onclick = () => {
        confirmHandler();
        modal.classList.remove('is-active');
    };

    cancelButton.onclick = () => modal.classList.remove('is-active');
    modal.querySelector('.modal-close').onclick = () => modal.classList.remove('is-active');
}

// Функция для удаления всех задач
function deleteAllTodos() {
    showConfirmationModal('Вы уверены, что хотите удалить все задачи?', 'Удалить все', () => {
        todos = [];
        localStorage.setItem('todos', JSON.stringify(todos));
        document.querySelectorAll('.todo').forEach(todo => todo.remove());
        counter();
    });
}

// Функция для завершения всех задач
function completeAllTodos() {
    showConfirmationModal('Вы уверены, что хотите завершить все задачи?', 'Завершить все', () => {
        todos = todos.map(todo => ({ ...todo, completed: true }));
        localStorage.setItem('todos', JSON.stringify(todos));
        document.querySelectorAll('.todo').forEach(todo => {
            todo.querySelector('.checkbox').checked = true;
            todo.querySelector('.todo-title').classList.add('completed');
        });
        counter();
    });
}

// Обработчики событий для кнопок "Удалить все" и "Завершить все"
document.querySelector('.dropdown-content .dropdown-item:nth-child(1)').onclick = deleteAllTodos;
document.querySelector('.dropdown-content .dropdown-item:nth-child(2)').onclick = completeAllTodos;

// Изменение функции toggleStatus для правильной работы с классом completed
function toggleStatus(id) {
    todos = todos.map(todo =>
        todo.id == id
            ? { ...todo, completed: !todo.completed }
            : todo
    );
    localStorage.setItem('todos', JSON.stringify(todos));

    const todoElement = document.getElementById(id).querySelector('.todo-title');
    todoElement.classList.toggle('completed');
}

// Функция для отображения задач в зависимости от фильтра
function filterTodos(filter) {
    const todoElements = document.querySelectorAll('.todo');
    todoElements.forEach(todoElement => {
        const id = todoElement.getAttribute('id');
        const todo = todos.find(t => t.id == id);

        switch (filter) {
            case 'all':
                todoElement.style.display = '';
                break;
            case 'completed':
                todo.completed ? todoElement.style.display = '' : todoElement.style.display = 'none';
                break;
            case 'open':
                !todo.completed ? todoElement.style.display = '' : todoElement.style.display = 'none';
                break;
        }
    });
}

// Обработчики событий для кнопок фильтрации
document.querySelector('#buttons .button.is-primary').onclick = () => filterTodos('all');
document.querySelector('#buttons .button.is-warning').onclick = () => filterTodos('completed');
document.querySelector('#buttons .button.is-link').onclick = () => filterTodos('open');

// Обновление функции showTodo для корректной работы фильтрации
function showTodo(object) {
    let clone = todo.cloneNode(true);

    clone.setAttribute('id', object.id);
    clone.querySelector('.todo-title').textContent =
        object.title.length <= 25
            ? object.title
            : object.title.slice(0, 25) + '...';

    if (object.completed) {
        clone.querySelector('.checkbox').setAttribute('checked', true);
        clone.querySelector('.todo-title').classList.add('completed');
    }

    clone.querySelector('.remove').dataset.id = object.id;
    clone.querySelector('.edit').dataset.id = object.id;
    clone.querySelector('.checkbox').dataset.id = object.id;

    clone.classList.remove('is-hidden');
    todosContainer.append(clone);
    counter();
}

// Обновление функции toggleStatus для корректной работы фильтрации
function toggleStatus(id) {
    todos = todos.map(todo =>
        todo.id == id
            ? { ...todo, completed: !todo.completed }
            : todo
    );
    localStorage.setItem('todos', JSON.stringify(todos));

    const todoElement = document.getElementById(id);
    todoElement.querySelector('.todo-title').classList.toggle('completed');
    todoElement.querySelector('.checkbox').checked = !todoElement.querySelector('.checkbox').checked;
}

// Обновление функции addEditButtonEventListeners для корректной работы после добавления новых задач
function addEditButtonEventListeners() {
    document.querySelectorAll('.edit').forEach(button => {
        button.onclick = () => editTodo(button.dataset.id);
    });
}

// Инициализация задач и добавление обработчиков событий
todos.forEach((todo) => showTodo(todo));
addEditButtonEventListeners();
