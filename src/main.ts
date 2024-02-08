//import './style.css'

import { v4 as uuidV4 } from 'uuid'
//console.log(uuidV4());

//Typescript task code
type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}


const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-item")
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

console.log(list);

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return


  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }

  tasks.push(newTask)
  saveTasks()

  addListItem(newTask)
  input.value = "";
})

function handleCheckboxChange(event: Event, taskId: string) {
  const checkbox = event.target as HTMLInputElement;
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = checkbox.checked;
    saveTasks();
    console.log(tasks);
  }
}

function addListItem(task: Task) {
  const element = `
  <div class="row g-3">
    <div class="col custom-control custom-checkbox custom-checkbox-green">
      <input type="checkbox" class="form-check-input" ${task.completed ? 'checked' : ''} id="${task.id}">
      <label class="form-check-label" for="${task.id}">
      ${task.title}
    </label>
  </div>
</div>
`;

  list?.insertAdjacentHTML('beforeend', element);

  const lastCheckbox = list?.querySelector(`input[data-task-id="${task.id}"]:last-child`);
  if (lastCheckbox) {
    lastCheckbox.addEventListener('change', (event) => handleCheckboxChange(event, task.id));
  }
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks() {
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return[]
  return JSON.parse(taskJSON)
}
