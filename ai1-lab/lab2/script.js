class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.searchTerm = '';
        this.draw();
    }

    draw() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        const filteredTasks = this.getFilteredTasks();

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span contenteditable="true">${this.highlightText(task.text, this.searchTerm)}</span>
                <input type="date" value="${task.dueDate || ''}" class="due-date-input">
                <button class="delete-btn">Usuń</button>
            `;
            taskList.appendChild(li);

            // Event listeners for edit and delete
            li.querySelector('span').addEventListener('blur', (e) => {
                task.text = e.target.innerText;
                this.save();
            });

            li.querySelector('.due-date-input').addEventListener('change', (e) => {
                task.dueDate = e.target.value;
                this.save();
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                this.tasks.splice(index, 1);
                this.save();
                this.draw();
            });
        });
    }

    addTask(text, dueDate) {
        this.tasks.push({ text, dueDate });
        this.save();
        this.draw();
    }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    getFilteredTasks() {
        if (this.searchTerm.length < 2) return this.tasks;
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    highlightText(text, term) {
        let highlightedText = '';
        let termIndex = 0;

        for (let i = 0; i < text.length; i++) {
            if (termIndex < term.length && text[i].toLowerCase() === term[termIndex].toLowerCase()) {
                highlightedText += `<span class="highlight">${text[i]}</span>`;
                termIndex++;
            } else {
                highlightedText += text[i];
            }
        }

        return highlightedText;
    }
}

// Initializing Todo application
const todoApp = new Todo();

document.getElementById('add-btn').addEventListener('click', () => {
    const taskText = document.getElementById('new-task').value.trim();
    const dueDate = document.getElementById('task-date').value;
    if (taskText.length >= 3 && taskText.length <= 255 && (!dueDate || new Date(dueDate) > new Date())) {
        todoApp.addTask(taskText, dueDate);
        document.getElementById('new-task').value = '';
        document.getElementById('task-date').value = '';
    } else {
        alert('Nieprawidłowe dane.');
    }
});

document.getElementById('search').addEventListener('input', (e) => {
    todoApp.searchTerm = e.target.value;
    todoApp.draw();
});
