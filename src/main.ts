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


const list: HTMLElement | null = document.querySelector("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-item")

//Modal listeners if user clicks remove tasks
//const myModal = document.getElementById('myModal')
document.getElementById("removeTasks")?.addEventListener("click", removeTasks)

//Load tasks in local storage
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

console.log(list);

//Eventlistener for the input field
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

//Makes the checkbox toggle and ads strikethrough + updates the local storage
function handleCheckboxChange(event: Event, taskId: string) {
  const checkbox = event.target as HTMLInputElement;
  const task = tasks.find(task => task.id === taskId);
  const label = checkbox.nextElementSibling;
  console.log(label);

  if (task) {
    task.completed = checkbox.checked;
    label?.classList.toggle("strike-through", checkbox.checked)
    saveTasks();
    console.log(tasks);
  }
}

//Function that renders the list item
function addListItem(task: Task) {
  const element: string = `
  <div class="pt-2 w-100" id="${task.id}">
    <div class="row">
      <div class="col">
        <div class="d-flex custom-control custom-checkbox custom-checkbox-green gap-2">
          <input type="checkbox" class="form-check-input" ${task.completed ? 'checked' : ''} id="${task.id}">
          <label class="form-check-label text-start" id="labelText" for="${task.id}">${task.title}</label>
        </div>
      </div>
      <div class="col-auto">
        <i class="fa-solid fa-trash-can fa-lg delete align-self-end" style="color: grey;"></i>
      </div>
    </div>
  </div>
  `;

  list?.insertAdjacentHTML('beforeend', element);

    const lastCheckbox = document.getElementById(task.id);
    if (lastCheckbox) {
      lastCheckbox.addEventListener('change', (event) => {
        console.log("Checkbox changed");
        handleCheckboxChange(event, task.id)
    });
  }
}

//Adds eventlistener to the delete button
list?.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('delete')) {
    const grandParentElement = target.parentElement?.parentElement;
    if (grandParentElement) {
      const taskId: string = grandParentElement.id;
      const taskIndex: number = tasks.findIndex(task => task.id === taskId)
      if(taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks()
      }
      grandParentElement.remove();
    }
  }
});

//Clear-all-tasks Function
  function removeTasks(): void {
  localStorage.clear();
  list!.innerHTML = "";

  }


function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks() {
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return[]
  return JSON.parse(taskJSON)
}