export default class Project{
    constructor(title, tasks = []){
        this.title = title;
        this.tasks = tasks;
    }

    getProject(){
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

export const projectList = [];
