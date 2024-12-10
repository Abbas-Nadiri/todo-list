import ToDoItem from "./todo-class";
import Project, { projectsArray, createProject, removeProject , moveTask, createToDo} from "./project-class";
import "./styles.css";
import untickedImg from "./icons/unticked.svg";
import tickedImg from "./icons/ticked.svg";
import folderImg from "./icons/folder-open-outline.svg";

export let currentProject = projectsArray.getProject("Default");

function toKebabCase(str) {
    return str
        .trim()
        .replace(/\s+/g, '-');
};

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
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const taskCardText = document.createElement("div");
    taskCardText.classList.add("taskCard-text");
    const taskCardTitle = document.createElement("div");
    const taskCardDue = document.createElement("div");
    taskCardTitle.textContent = item.title;
    taskCardDue.textContent = item.dueDate;

    const taskCardButton = document.createElement("button");
    const unticked = document.createElement("img");
    const ticked = document.createElement("img");
    unticked.src = untickedImg;
    ticked.src = tickedImg;
    taskCardButton.append(unticked);

    // add ".completed-task" class to completed tasks 
    taskCardButton.addEventListener("click", () => {
        taskCard.classList.toggle("completed-task");
        console.log(taskCard.classList.contains("completed-task"));
        if (taskCard.classList.contains("completed-task")) {
            taskCardButton.innerHTML = "";
            taskCardButton.append(ticked);
        } else {
            taskCardButton.innerHTML = "";
            taskCardButton.append(unticked);
        }
    })

    taskCardText.append(taskCardTitle);
    taskCardText.append(taskCardDue);
    taskCard.append(taskCardButton, taskCardText);
    tasksDisplay.append(taskCard);
}
//do this for each project 


//update the pending display number
const pendingCount = document.querySelector(".pending-count");


//display each project in the sidebar

function displayProjects() {
    projectsArray.projects.forEach(project => {

        const projectsSidebar = document.querySelector(".projects");
        const projectButton = document.createElement("button");
        const img = document.createElement("img");
        img.src = folderImg;
        projectButton.classList.add(toKebabCase(project.title));
        const projectName = document.createElement("span");
        projectName.textContent = project.title;
        
        projectButton.append(img, projectName);
        projectsSidebar.append(projectButton);

        //create eventListeners for each project button

        projectButton.addEventListener("click", () => {
            tasksDisplay.innerHTML = "";
            currentProject = project;
            currentProject.tasks.forEach(item => displayToDoItem(item));
            pendingCount.textContent = document.querySelector(".tasks-display").childElementCount;
        })
    })
}

displayProjects();


