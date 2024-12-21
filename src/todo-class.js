export default class ToDoItem{
    constructor(title, desc, dueDate, priority){
		this.title = title;
		this.desc = desc;
		this.dueDate = dueDate;
		this.priority = priority;
    this.completed = false;
    }

    displayItem(){
        console.log(`Title: ${this.title}`);
        console.log(`Description: ${this.desc}`);
        console.log(`Due Date: ${this.dueDate}`);
        console.log(`Priority: ${this.priority}`);
    }
}

