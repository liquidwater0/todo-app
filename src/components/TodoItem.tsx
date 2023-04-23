import { Todo, useTodos } from "../context/TodoContext";
import checkIcon from "../assets/icon-check.svg";
import crossIcon from "../assets/icon-cross.svg";

export default function TodoItem({ todo }: { todo: Todo }) {
    const { label, completed, id } = todo;
    const { toggleTodo, deleteTodo } = useTodos();

    return (
        <li 
            className="todo-item todo-section"
            onClick={() => toggleTodo(id)} 
            data-completed={completed}
        >
            <div className="status-circle">
                { completed && <img src={checkIcon} alt="check icon" /> }
            </div>

            <p className='todo-item-label'>{ label }</p>

            <button className="delete-todo-button" onClick={() => deleteTodo(id)}>
                <img src={crossIcon} alt="cross icon" />
            </button>
        </li>
    );
}