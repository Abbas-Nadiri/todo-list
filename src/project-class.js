export default class Project{
    constructor(title, tasks = []){
        this.title = title;
        this.tasks = tasks;
        this.tasks.forEach(obj => {
            obj.getContainingProject = () => this;
        });
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
const defaultProject = new Project("Default");
projectsArray.addProject(defaultProject);

// functions for button eventListeners
export function addProject(project) {
    projectsArray.addProject(project);
}

export function removeProject(project) {
    projectsArray.removeProject(project);
}

export function moveTask(task, destination) {
    task.getContainingProject().removeTask(task);
    projectsArray.getProject(destination).addTask(task);
}