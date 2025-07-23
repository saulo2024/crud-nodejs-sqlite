document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');
  
    // Carrega tarefas
    fetch('/api/tasks')
      .then(res => res.json())
      .then(tasks => {
        tasks.forEach(addTaskToUI);
      });
  
    // Adiciona nova tarefa
    form.addEventListener('submit', e => {
      e.preventDefault();
      const taskText = input.value.trim();
      if (taskText === '') return;
  
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskText })
      })
      .then(res => res.json())
      .then(data => {
        addTaskToUI({ id: data.id, name: taskText });
        input.value = '';
      });
    });
  
    function addTaskToUI(task) {
      const li = document.createElement('li');
      li.textContent = task.name;
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Excluir';
      deleteBtn.addEventListener('click', () => {
        fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
          .then(() => li.remove());
      });
  
      li.appendChild(deleteBtn);
      list.appendChild(li);
    }
  });
  