import { DragEvent } from "react";
import { Todo, useTodos } from "../context/TodoContext";
import checkIcon from "../assets/icon-check.svg";
import crossIcon from "../assets/icon-cross.svg";

export default function TodoItem({ todo }: { todo: Todo }) {
    const { label, completed, id } = todo;
    const { todos, setTodos, toggleTodo, deleteTodo } = useTodos();

    function handleDragOver(event: DragEvent) {
        event.preventDefault();

        setTodos(prevTodos => {
            return prevTodos.map(todo => ({ ...todo, draggedOver: false }));
        });

        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo.id === id) return { ...todo, draggedOver: true };
                return todo;
            });
        });
    }

    function handleDragEnd(event: DragEvent) {
        event.preventDefault();

        const currentItem = todos.find(todo => todo.id === id);
        const draggedOverItem = todos.find(todo => todo.draggedOver);

        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (!currentItem || !draggedOverItem) return todo;
                if (todo.id === currentItem.id) return { ...draggedOverItem, draggedOver: false };
                if (todo.id === draggedOverItem.id) return { ...currentItem, draggedOver: false };
                return todo;
            });
        });
    }

    return (
        <li 
            className="todo-item todo-section"
            data-completed={completed}
            onClick={() => toggleTodo(id)} 
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            draggable
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