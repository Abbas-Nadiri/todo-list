import { currentProject } from "./index";
import ToDoItem from "./todo-class";

//class for creating project objects to store tasks
 export default class Project{
    constructor(title, tasks = []){
        this.title = title;
        this.tasks = tasks;
        this.display = true;

    }

    getTask(taskTitle) {
        const position = this.tasks.findIndex(task => task.title = taskTitle);
        if (position != -1) {
            return this.tasks[position];
        }
    }

    addTask(task) {
        task.getContainingProject = () => this;
        this.tasks.push(task);
    }

    removeTask(task){
        let position = this.tasks.indexOf(task);
        if (position != -1) {
            this.tasks.splice(position, 1);
        };
    }
} 

//class for creating single projectsArray object to store all projects
class ProjectsArray {
    constructor(projects = []){
        this.projects = projects;
    }

    getProject(projectTitle){
        const position = this.projects.findIndex(project => project.title == projectTitle);
        if (position != -1) {
            return this.projects[position];
        };
    }

    addProject(project){
        this.projects.push(project);
    }

    removeProject(project){
        let position = this.projects.indexOf(project);
        if (position != -1 && this.projects.length > 0) {
            this.projects.splice(position, 1);
        };
    }
}

export const projectsArray = new ProjectsArray();

createProject("Default");

// functions for button eventListeners
export function createProject(projectName) {
    let newProject = new Project(projectName);
    projectsArray.addProject(newProject);
    return newProject;
}

export function removeProject(project) {
    projectsArray.removeProject(project);
}

export function moveTask(task, destination) {
    task.getContainingProject().removeTask(task);
    projectsArray.getProject(destination).addTask(task);
}
//maybe needs to be refactored once DOM stuff is implemented
export function createToDo(title, desc, dueDate, priority) {
    const item = new ToDoItem(title, desc, dueDate, priority);
    currentProject.addTask(item);
    return item;
}
