import ToDoItem from "./todo-class";
import Project, { projectsArray, createProject, removeProject , moveTask, createToDo} from "./project-class";
import "./styles.css";

export let currentProject = projectsArray.getProject("Default");

createToDo("test","DO THE THING", "ASAP", "TURBO HIGH");
createToDo("alternate", "wowie", "hehehe", "kind of");
createToDo("kreyzi", "when", "maybe way", "mistake");

createProject("test project 1");
currentProject = projectsArray.getProject("test project 1");

createToDo("shaboing", "what", "no way", "tragedy");
createToDo("blabla", "where", "yes way", "disoster");

const tasksDisplay = document.querySelector(".tasks-display");

//get each toDoItem in currentProject and display them as taskCards
function displayToDoItem(item) {
    const div = document.createElement("div");
    div.classList.add("filler");

    const taskCardTitle = document.createElement("div");
    const taskCardDue = document.createElement("div");

    taskCardTitle.textContent = item.title;
    taskCardDue.textContent = item.dueDate;

    div.append(taskCardTitle);
    div.append(taskCardDue);
    tasksDisplay.append(div);
}

currentProject.tasks.forEach(item => displayToDoItem(item));

//update the pending display number
const pendingCount = document.querySelector(".pending-count");
pendingCount.textContent = document.querySelector(".tasks-display").childElementCount;