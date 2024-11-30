export default class ToDoItem{
    constructor(title, desc, dueDate, priority){
		this.title = title;
		this.desc = desc;
		this.dueDate = dueDate;
		this.priority = priority;
    }

    getTitle(){
        return this.title;
    }

    displayItem(){
        console.log(`Title: ${this.title}`);
        console.log(`Description: ${this.desc}`);
        console.log(`Due Date: ${this.dueDate}`);
        console.log(`Priority: ${this.priority}`);
    }


}

export function createToDo(title, desc, dueDate, priority) {
    const item = new ToDoItem(title, desc, dueDate, priority);
    currentProject.addTask(item);
}