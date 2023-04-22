import { Todo } from "../App";
import checkIcon from "../assets/icon-check.svg";

type TodoItemProps = {
    todo: Todo,
    toggleTodo: (id: string) => void
}

export default function TodoItem({ todo, toggleTodo }: TodoItemProps) {
    const { label, completed, id } = todo;

    return (
        <li 
            key={id} 
            onClick={() => toggleTodo(id)} 
            data-completed={completed}
        >
            <div className="todo-item">
                <div className={`todo-status ${completed ? "complete" : ""}`}>
                    { completed && <img src={checkIcon} alt="check icon" /> }
                </div>

                <p className='todo-item-label'>{ label }</p>
            </div>
        </li>
    );
}