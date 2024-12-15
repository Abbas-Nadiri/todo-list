import ToDoItem from "./todo-class";
import Project, { projectsArray, createProject, removeProject , moveTask, createToDo} from "./project-class";
import "./styles.css";
import untickedImg from "./icons/unticked.svg";
import tickedImg from "./icons/ticked.svg";
import folderImg from "./icons/folder-open-outline.svg";

export let currentProject = projectsArray.getProject("Default");

//define initial constants and functions
const tasksDisplay = document.querySelector(".tasks-display");
const pendingCount = document.querySelector(".pending-count");
function toKebabCase(str) {
    return str
        .trim()
        .replace(/\s+/g, '-');
};

createToDo("test","DO THE THING", "ASAP", "high");
createToDo("alternate", "wowie", "hehehe", "med");
createToDo("kreyzi", "when", "maybe way", "low");

createProject("test project 1");
currentProject = projectsArray.getProject("test project 1");

createToDo("shaboing", "what", "no way", "med");
createToDo("blabla", "where", "yes way", "low");

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
        };
    })

    //change border colour depending on priority (might have to move somewhere else if colour not changing after prio changes)
    switch(item.priority.toLowerCase()) {
        case "high":
            taskCard.classList.add("high-prio");
            break;
        case "med":
            taskCard.classList.add("med-prio");
            break;
        case "low":
            taskCard.classList.add("low-prio");
            break;
    };

    taskCardText.append(taskCardTitle);
    taskCardText.append(taskCardDue);
    taskCard.append(taskCardButton, taskCardText);
    tasksDisplay.append(taskCard);
}

//display a project in the sidebar
function displayProject(project) {
    const projectsSidebar = document.querySelector(".projects");
    const projectButton = document.createElement("button");
    const img = document.createElement("img");
    img.src = folderImg;
    projectButton.classList.add(toKebabCase(project.title));
    const projectName = document.createElement("span");
    projectName.textContent = project.title;
    
    projectButton.append(img, projectName);
    projectsSidebar.append(projectButton);

    //create eventListener for project button

    projectButton.addEventListener("click", () => {
        const title = document.querySelector(".heading");
        title.textContent = project.title;
        tasksDisplay.innerHTML = "";
        currentProject = project;
        currentProject.tasks.forEach(item => displayToDoItem(item));
        //update the pending display number
        pendingCount.textContent = document.querySelector(".tasks-display").childElementCount;
    })
}


projectsArray.projects.forEach(project => displayProject(project));


//Add Task + modal functionality
const addTaskButton = document.querySelector(".addTask-btn");
const modalForm = document.querySelector(".modal-form");

addTaskButton.addEventListener("click", () => modalForm.showModal());

//make the form submit button export the form info back to this script
const addTaskForm = document.querySelector("#addTask-form");
const submitFormBtn = document.querySelector(".submit-form");

addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addTaskForm);
    const data = Object.fromEntries(formData.entries());

    console.log("Form data:", data);
    currentProject = projectsArray.getProject(data.projectSelector);
    const newToDo = createToDo(data.title, data.description, data.dueDate, data.priority);
    displayToDoItem(newToDo);
    //localStorage.setItem("formData", JSON.stringify(formData));   return to this when wanting to add persistent local storage
    addTaskForm.reset();
});

//close the modal
submitFormBtn.addEventListener("click", () => {
    modalForm.close()
});

//function to close a modal by clicking outside of it
function clickOutModal(modal) {
    modal.addEventListener('click', event => {
        const rect = modal.getBoundingClientRect();
        const isInDialog =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
      
        if (!isInDialog) {
          modal.close();
        }
      });
}

clickOutModal(modalForm);

//add each existing project in projectsArray to the modal's projectSelector dropdown menu
function appendProjectToDropdown(project) {
    const projectSelector = document.querySelector("#projectSelector");
    const projectOption = document.createElement("option");

    projectOption.textContent = project.title;
    projectOption.value = project.title;
    projectSelector.append(projectOption);
};

projectsArray.projects.forEach(project => appendProjectToDropdown(project));

//Add Project modal functionality
const addProjectBtn = document.querySelector("#add-project");
const projectModal = document.querySelector(".project-modal");
const projectModalInput = document.querySelector("#project-modal-input");
const createProjectButton = document.querySelector(".project-modal-create");
const closeProjectModalBtn = document.querySelector(".project-modal-cancel");

addProjectBtn.addEventListener("click", () => projectModal.showModal());

createProjectButton.addEventListener("click", () => {
    const newProjectName = projectModalInput.value;
    if (newProjectName.trim()){
        const newProject = createProject(newProjectName);
        appendProjectToDropdown(newProject);
        displayProject(newProject);
        projectModal.close();
        projectModalInput.value = "";
    };
})

closeProjectModalBtn.addEventListener("click", () => {
    projectModal.close();
    projectModalInput.value = "";
});

clickOutModal(projectModal);

