// Get references to the DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date');
const categorySelect = document.getElementById('category-select');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterPriority = document.getElementById('filter-priority');
const filterCategory = document.getElementById('filter-category');

// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Event listener for form submission to add tasks
taskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const taskText = taskInput.value.trim();
  const taskPriority = prioritySelect.value;
  const dueDate = dueDateInput.value;
  const taskCategory = categorySelect.value;

  if (taskText && dueDate) {
    // Create a new task object
    const newTask = {
      text: taskText,
      completed: false,
      priority: taskPriority,
      dueDate: dueDate,
      category: taskCategory,
      id: new Date().getTime()  // Unique ID using timestamp
    };

    // Add the task to the task list
    addTaskToList(newTask);

    // Add the task to localStorage
    saveTaskToLocalStorage(newTask);

    // Clear the input fields
    taskInput.value = '';
    prioritySelect.value = 'low';
    dueDateInput.value = '';
    categorySelect.value = 'work'; // Reset to default category
  }
});

// Event listener for search input
searchInput.addEventListener('input', filterTasks);

// Event listener for priority filter
filterPriority.addEventListener('change', filterTasks);

// Event listener for category filter
filterCategory.addEventListener('change', filterTasks);

// Event delegation for task completion and deletion
taskList.addEventListener('click', function(event) {
  const target = event.target;
  const taskId = target.closest('li').dataset.id;

  if (target.classList.contains('task-checkbox')) {
    toggleTaskCompletion(taskId);
  }

  if (target.classList.contains('delete-btn')) {
    deleteTask(taskId);
  }
});

// Add task to the list (display on the UI)
function addTaskToList(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.classList.toggle('completed', task.completed);  // Mark as completed if needed

  li.innerHTML = `
    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
    <span class="task-text" style="color:${task.completed ? '#ccc' : '#000'}">${task.text}</span>
    <div class="task-details">
      <span class="priority" style="background-color:${getPriorityColor(task.priority)}; color:white; padding: 2px 6px; border-radius: 4px;">
        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </span>
      <span class="category" style="background-color:#2196F3; color:white; padding: 2px 6px; border-radius: 4px;">
        ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
      </span>
      <span class="due-date" style="font-weight: bold;">Due: ${task.dueDate}</span>
    </div>
    <button class="delete-btn">Delete</button>
  `;
  taskList.appendChild(li);
}

// Get the color based on the priority
function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return '#f44336'; // Red
    case 'medium': return '#ff9800'; // Orange
    case 'low': return '#4caf50'; // Green
    default: return '#4caf50'; // Default to green
  }
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(task => addTaskToList(task));
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Filter tasks based on search, priority, and category
function filterTasks() {
  const searchTerm = searchInput.value.toLowerCase();
  const priorityFilter = filterPriority.value;
  const categoryFilter = filterCategory.value;

  const tasks = getTasksFromLocalStorage();

  // Filter tasks based on the criteria
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm);
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Clear the task list and display filtered tasks
  taskList.innerHTML = '';
  filteredTasks.forEach(task => addTaskToList(task));
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
  const tasks = getTasksFromLocalStorage();
  const task = tasks.find(t => t.id == taskId);
  task.completed = !task.completed;
  saveAllTasksToLocalStorage(tasks);

  // Update the task's completion status in the UI
  const li = document.querySelector(`[data-id="${taskId}"]`);
  li.classList.toggle('completed', task.completed);
  li.querySelector('.task-checkbox').checked = task.completed;
  li.querySelector('.task-text').style.color = task.completed ? '#ccc' : '#000';
}

// Delete task
function deleteTask(taskId) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter(t => t.id != taskId);  // Remove the deleted task
  saveAllTasksToLocalStorage(tasks);

  // Remove the task from the UI
  const li = document.querySelector(`[data-id="${taskId}"]`);
  li.remove();
}

// Save all tasks to localStorage (after completion toggle or deletion)
function saveAllTasksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
