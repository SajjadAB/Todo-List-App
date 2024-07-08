// define variable
// let todos = [];
let filterValue = "all";

const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const selectFilter = document.querySelector(".filter-todos");
const backdrop = document.querySelector(".backdrop");
const editForm = document.querySelector(".edit-form");
const editInput = document.querySelector(".edit-input");

// events
todoForm.addEventListener("submit", addNewTodo);

selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", () => {
  const todos = getAllTodos();
  createTodos(todos);
});

backdrop.addEventListener("click", (e) => {
  if (!e.target.closest(".modal")) {
    backdrop.classList.add("hidden");
  }
});

// functions
function addNewTodo(e) {
  e.preventDefault();

  if (!todoInput.value) return null;

  const newTodo = {
    id: Date.now(),
    title: todoInput.value,
    createdAt: new Date().toISOString(),
    isCompleted: false,
  };

  // todos.push(newTodo);
  savedTodo(newTodo);
  filterTodos();
}

function createTodos(todos) {
  // create todos on DOM
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
    <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>
    <div class="todo__info">
      <span class="todo__createdAt">${new Date(
        todo.createdAt
      ).toLocaleDateString("fa-IR")}</span>
      <button class="todo__edit" data-todo-id=${
        todo.id
      }><i class="fa-regular fa-pen-to-square"></i></button>
      <button class="todo__check" data-todo-id=${
        todo.id
      }><i class="far fa-check-square"></i></button>
      <button class="todo__remove" data-todo-id=${
        todo.id
      }><i class="far fa-trash-alt"></i></button>
 </li>`;
  });
  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", editTodo));
}

function filterTodos() {
  // const filter = e.target.value;
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((todo) => todo.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((todo) => !todo.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function removeTodo(e) {
  let todos = getAllTodos();
  // const todoId = e.target.dataset.todoId;
  const todoId = e.target.getAttribute("data-todo-id");
  todos = todos.filter((todo) => todo.id !== parseInt(todoId));
  savedAllTodos(todos);
  filterTodos();
}

function checkTodo(e) {
  const todos = getAllTodos();
  const todoId = e.target.getAttribute("data-todo-id");
  const todo = todos.find((todo) => todo.id === parseInt(todoId));
  todo.isCompleted = !todo.isCompleted;
  savedAllTodos(todos);
  filterTodos();
}

function editTodo(e) {
  backdrop.classList.remove("hidden");
  const todos = getAllTodos();
  const todoId = e.target.getAttribute("data-todo-id");
  const todo = todos.find((todo) => todo.id === parseInt(todoId));
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    backdrop.classList.add("hidden");
    todo.title = editInput.value ? editInput.value : null;
    savedAllTodos(todos);
    filterTodos();
  });
  editInput.value = "";
}

// localStorage => web API
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function savedTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function savedAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
