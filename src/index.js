import ToDoItem from "./todo-class";
import Project, { projectsArray, createProject, removeProject , moveTask, createToDo} from "./project-class";
import "./styles.css";
import untickedImg from "./icons/unticked.svg";
import tickedImg from "./icons/ticked.svg";
import folderImg from "./icons/folder-open-outline.svg";
import crossImg from "./icons/cross.svg";
import { format, parseISO, isWithinInterval, addDays, startOfDay, isSameDay } from "date-fns";

export let currentProject = projectsArray.getProject("Default");

//define initial constants and functions
const tasksDisplay = document.querySelector(".tasks-display");
const modalForm = document.querySelector(".modal-form");
const pendingDisplay = document.querySelector(".pending-display");
const title = document.querySelector(".heading");
let lastClickedButton = null;

function toKebabCase(str) {
    return str
        .trim()
        .replace(/\s+/g, '-');
};

//get today's date
const todaysDate = startOfDay(new Date());
const formattedTodaysDate = format(todaysDate, "yyyy-MM-dd");
//convert dates from ISO format into DD/MM/YYYY
function handleDateChange(date) {
    const parsedDate = parseISO(date);
    return format(parsedDate, "dd/MM/yyyy");
}


//create dummy toDo items
createToDo("Tidy room","DO THE THING", format(addDays(todaysDate, 1), "yyyy-MM-dd"), "high");
createToDo("Make a morbillion dollars", "wowie", format(addDays(todaysDate, 6), "yyyy-MM-dd"), "med");
createToDo("Do it again", "how", formattedTodaysDate, "low");
//create dummy project
createProject("Important");
currentProject = projectsArray.getProject("Important");// delete this in the end

createToDo("Fortnite move!", "where", formattedTodaysDate, "high");
createToDo("Do nothing?", "what", format(addDays(todaysDate, 9), "yyyy-MM-dd"), "med");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function updatePendingCount() {
    const pendingCount = document.querySelector(".pending-count");
    pendingCount.textContent = document.querySelector(".tasks-display").childElementCount;
};

function updateCompletedCount() {
    const completedCount = document.querySelector(".completed-count");
    let count = 0;
    completedCount.textContent = count;
    currentProject.tasks.forEach(task => {
        if (task.completed) {
            count++;
            completedCount.textContent = count;
        }
    })
}

//function that returns all incomplete tasks in a single 1D array
function returnAllTasks() {
    const allTasks = []; // the issue is once tasks are added to here how can i remove them?
    projectsArray.projects.forEach(project => {
        if (!project.display) {
            return;
        }
        project.tasks.forEach(task => {
            allTasks.push(task);
        });
    });
    allTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return allTasks;
}

//TODAY
function todayFilter(task) {
    return isSameDay(task.dueDate, todaysDate);
};
//TOMORROW
function tomorrowFilter(task) {
    return isSameDay(task.dueDate, addDays(todaysDate, 1));
};
//THIS WEEK
function thisWeekFilter(task) {
    return isWithinInterval(task.dueDate, {start: todaysDate, end: addDays(todaysDate, 7)});
}

//function that filters all incomplete tasks with a given filter
function filterAllTasks(filterFunction) {
    const allTasks = returnAllTasks();
    return allTasks.filter(task => filterFunction(task));
}

//CREATE PROJECTS + EVENT LISTENERS FOR TODAY, TOMORROW, THIS WEEK, ALL TASKS SIDEBAR BUTTON
function addListenerToTasksBtn(button, heading, project, filter) {
    button.addEventListener("click", () => {
        pendingDisplay.classList.remove("hidden");
        title.textContent = heading;
        tasksDisplay.innerHTML = "";
        currentProject = project;
        currentProject.tasks = [];
        const filteredTasks = filterAllTasks(filter);
        filteredTasks.forEach(task => currentProject.addTask(task));
        currentProject.tasks.forEach(task => {
            if (!task.completed) {
                displayToDoItem(task);
            };
        });
        //update the pending/completed display numbers
        updatePendingCount();
        updateCompletedCount();
    })
}

const todayBtn = document.querySelector("#today");
const todayProject = createProject("Today");
todayProject.display = false;

//get page to display Today on load
window.onload = function() {
    pendingDisplay.classList.remove("hidden");
    title.textContent = "Today";
    tasksDisplay.innerHTML = "";
    currentProject = todayProject;
    currentProject.tasks = [];
    const filteredTasks = filterAllTasks(todayFilter);
    filteredTasks.forEach(task => currentProject.addTask(task));
    currentProject.tasks.forEach(task => {
        if (!task.completed) {
            displayToDoItem(task);
        };
    });
    //update the pending/completed display numbers
    updatePendingCount();
    updateCompletedCount();
};

addListenerToTasksBtn(todayBtn, "Today", todayProject, todayFilter);

const tomorrowBtn = document.querySelector("#tomorrow");
const tomorrowProject = createProject("Tomorrow");
tomorrowProject.display = false;

addListenerToTasksBtn(tomorrowBtn, "Tomorrow", tomorrowProject, tomorrowFilter);

const thisWeekBtn = document.querySelector("#this-week");
const thisWeekProject = createProject("This Week");
thisWeekProject.display = false;

addListenerToTasksBtn(thisWeekBtn, "This Week", thisWeekProject, thisWeekFilter);

const allTasksBtn = document.querySelector("#all");
const allTasksProject = createProject("All Tasks");
allTasksProject.display = false;

addListenerToTasksBtn(allTasksBtn, "All Tasks", allTasksProject, (task) => task);

//create "Completed" project for completed tasks
const completedProject = createProject("Completed");
const completedBtn = document.querySelector("#completed");
completedProject.display = false;

completedBtn.addEventListener("click", () => {
    title.textContent = "Completed";
    pendingDisplay.classList.add("hidden");
    tasksDisplay.innerHTML = "";
    currentProject = completedProject;
    //sort tasks to display closest dueDate on top
    currentProject.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    currentProject.tasks.forEach(item => displayToDoItem(item));
    //update the pending display number
    updatePendingCount();
    updateCompletedCount();
})

//get each toDoItem in currentProject and display them as taskCards
function displayToDoItem(item) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    const taskCardText = document.createElement("div");
    taskCardText.classList.add("taskCard-text");
    const taskCardTitle = document.createElement("div");
    const taskCardDue = document.createElement("div");
    taskCardTitle.textContent = item.title;
    taskCardDue.textContent = handleDateChange(item.dueDate);

    const taskCardButton = document.createElement("button");
    const unticked = document.createElement("img");
    const ticked = document.createElement("img");
    unticked.src = untickedImg;
    ticked.src = tickedImg;
    taskCardButton.append(item.completed ? ticked : unticked);

    if (item.completed) {
        taskCard.classList.add("completed-task");
    }

    // add ".completed-task" class to completed tasks 
    taskCardButton.addEventListener("click", function(event) {
        event.stopPropagation();
        item.completed = !item.completed;

        if (item.completed) {
            completedProject.addTask(item);  // Add to completedProject
        } else {
            // If the task is not completed, remove it from the completedProject
            completedProject.removeTask(item); // Use your built-in removeTask method
        }

        taskCard.classList.toggle("completed-task");
        taskCardButton.innerHTML = ""; // Update button
        taskCardButton.append(item.completed ? ticked : unticked);


        //remove taskCard from current tasksDisplay
        taskCard.remove();
        updatePendingCount();

        updateCompletedCount();
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

    //add click eventListener to taskCard to open Edit Task modal
    taskCard.addEventListener("click", () => {
        const modalHeader = document.querySelector(".modal-header");
        modalHeader.textContent = "Edit Task";

        //repopulate each form input with the toDo item's properties
        const titleInput = document.querySelector("#title");
        titleInput.value = item.title;

        const descInput = document.querySelector("#description");
        descInput.value = item.desc;

        const dateInput = document.querySelector("#dueDate");
        dateInput.value = item.dueDate;
        
        const projectSelector = document.querySelector("#projectSelector");
        projectSelector.value = projectsArray.projects.find(project => project.tasks.includes(item))?.title || "Default";

        const radioButtons = document.querySelectorAll("input[name='priority']");
        radioButtons.forEach(button => {
            button.checked = (button.value === item.priority);
        });

        const btnContainer = document.querySelector(".button-container");
        btnContainer.innerHTML = "";
        //replace addTask button with delete/save buttons
        if (!btnContainer.hasChildNodes()) {
            const deleteTaskBtn = document.createElement("button");
            const saveChangesBtn = document.createElement("button");
            deleteTaskBtn.textContent = "Delete Task";
            saveChangesBtn.textContent = "Save Changes";
            deleteTaskBtn.classList.add("editTask-button");
            saveChangesBtn.classList.add("editTask-button");

            //eventListeners for buttons
            deleteTaskBtn.addEventListener("click", () => {
                event.preventDefault();
                projectsArray.projects.forEach(project => {
                    project.removeTask(item);
                });
                taskCard.remove();
                modalForm.close();
                updatePendingCount();
                
                updateCompletedCount();
            })

            saveChangesBtn.addEventListener("click", () => {
                event.preventDefault();
                item.title = titleInput.value;
                item.desc = descInput.value;
                item.dueDate = dateInput.value;
                //move the project
                moveTask(item, projectSelector.value);

                //remove border colour to add updated one
                taskCard.classList.forEach(item => {
                    if (item != "task-card") {
                        taskCard.classList.remove(item);
                    }
                });

                radioButtons.forEach(button => {
                    if (button.checked) {
                        item.priority = button.value;
                        taskCard.classList.add(button.id);
                    }
                });
                updatePendingCount();
                updateCompletedCount();
                modalForm.close();
            })

            btnContainer.append(deleteTaskBtn, saveChangesBtn);
        }

        modalForm.showModal();
    })
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
        lastClickedButton = projectButton;
        title.textContent = project.title;
        tasksDisplay.innerHTML = "";
        currentProject = project;
        //sort tasks to display closest dueDate on top
        currentProject.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        currentProject.tasks.forEach(item => {
            if (item.completed) {
                return;
            }
            displayToDoItem(item);
        });
        //update the pending display number
        pendingDisplay.classList.remove("hidden");
        updatePendingCount();
        updateCompletedCount();
    })

    //delete project button
    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.classList.add("delete-project-btn");
    const btnImg = document.createElement("img");
    btnImg.src = crossImg;
    
    deleteProjectBtn.append(btnImg);
    projectButton.append(img, projectName, deleteProjectBtn);
    projectsSidebar.append(projectButton);

    //create eventListener to delete project (maybe make a "are you sure modal?") cba
    deleteProjectBtn.addEventListener("click", () => {
        event.stopPropagation(); 
        projectButton.remove();
        projectsArray.removeProject(project);

        const projectSelector = document.querySelector("#projectSelector");
        const options = projectSelector.options;

        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === project.title) {
            projectSelector.remove(i);
            break;
            }
        }

        

    })
    return projectButton;
}


//display all projects in sidebar
projectsArray.projects.forEach(project => {
    if (!project.display) {
        return;
    }
    displayProject(project);
} );

//Add Task + modal functionality
const addTaskButton = document.querySelector(".addTask-btn");
addTaskButton.addEventListener("click", () => {
    const modalHeader = document.querySelector(".modal-header");
    modalHeader.textContent = "Add Task";

    const btnContainer = document.querySelector(".button-container");
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Add Task";
    submitBtn.classList.add("submit-form");
    //only add the button if btnContainer is empty 
    if (btnContainer.hasChildNodes()) {
        btnContainer.innerHTML = "";
        btnContainer.append(submitBtn);
    };

    modalForm.showModal();
    const projectSelector = document.querySelector("#projectSelector");
    projectSelector.value = currentProject.title ? currentProject.title : "Default";
});

//make the form submit button export the form info back to this script
const addTaskForm = document.querySelector("#addTask-form");

addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addTaskForm);
    const data = Object.fromEntries(formData.entries());

    currentProject = projectsArray.getProject(data.projectSelector);
    const newToDo = createToDo(data.title, data.description, data.dueDate, data.priority);
    updatePendingCount();
    //localStorage.setItem("formData", JSON.stringify(formData));   return to this when wanting to add persistent local storage
    addTaskForm.reset();
    modalForm.close();
    //click the button of the page currently being displayed to refresh the display
    switch (title.textContent) {
        case "Today":
            todayBtn.click();
            break; 
        case "Tomorrow":
            tomorrowBtn.click();
            break; 
        case "This Week":
            thisWeekBtn.click();
            break; 
        case "All Tasks":
        allTasksBtn.click();
            break; 
        default:
            if (lastClickedButton) {
                lastClickedButton.click();
            }
            break;
    }
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
          projectModalInput.value = "";
          addTaskForm.reset();
          modal.close();
        }
      });
}

clickOutModal(modalForm);

//add each existing project in projectsArray to the add task modal's projectSelector dropdown menu
function appendProjectToDropdown(project) {
    const projectSelector = document.querySelector("#projectSelector");
    const projectOption = document.createElement("option");

    projectOption.textContent = project.title;
    projectOption.value = project.title;
    projectSelector.append(projectOption);
};

projectsArray.projects.forEach(project => {
    if(!project.display) {
        return;
    }
    appendProjectToDropdown(project)
});

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
