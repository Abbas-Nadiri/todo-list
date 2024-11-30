export default class Project{
    constructor(title, tasks = []){
        this.title = title;
        this.tasks = tasks;
    }

    getProjectName(){
        return this.title;
    }

    getTasks(){
        return this.tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskTitle){
        let position = this.tasks.findIndex(toDo => toDo.title == taskTitle);
        if (position != -1) {
            this.tasks.splice(position, 1);
        };
    }
} 

export class ProjectList {
    constructor(projects = []){
        this.projects = projects;
    }

}


