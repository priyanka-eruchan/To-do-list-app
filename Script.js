// Vanilla JS: task list with filter + localStorage
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = [];
try { tasks = JSON.parse(localStorage.getItem("focus-desk-tasks") || "[]"); } catch (e) {}
let filter = "all";

function save() {
  try { localStorage.setItem("focus-desk-tasks", JSON.stringify(tasks)); } catch (e) {}
}

function render() {
  list.innerHTML = "";

  const visible = tasks.filter(t =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = tasks.length ? "Nothing here." : "No tasks yet. Add your first one above.";
    list.appendChild(empty);
  }

  visible.forEach(task => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.done;
    box.setAttribute("aria-label", "Mark done: " + task.text);
    box.addEventListener("change", () => {
      task.done = box.checked;
      save();
      render();
    });

    const label = document.createElement("span");
    label.textContent = task.text; // textContent keeps user input safe

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      render();
    });

    li.append(box, label, del);
    list.appendChild(li);
  });

  const open = tasks.filter(t => !t.done).length;
  count.textContent = `${open} open, ${tasks.length - open} done`;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
});

filterButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    render();
  })
);

render();
