export default class Project{
    constructor(title, tasks = []){
        this.title = title;
        this.tasks = tasks;
    }

    addTask(task) {
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

    addProject(project){
        this.projects.push(project);
    }

    removeProject(project){
        let position = this.projects.indexOf(project);
        if (position != -1) {
            this.projects.splice(position, 1);
        };
    }
}

export const projectsArray = new ProjectsArray();
const defaultProject = new Project("Default");
projectsArray.addProject(defaultProject);