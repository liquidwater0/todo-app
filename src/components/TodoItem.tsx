import { DragEvent } from "react";
import { Todo, useTodos } from "../context/TodoContext";
import checkIcon from "../assets/icon-check.svg";
import crossIcon from "../assets/icon-cross.svg";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

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

    function handleArrangeUp() {
        const currentTodo = todos.find(todo => todo.id === id);

        if (!currentTodo) return;

        const currentTodoIndex = todos.indexOf(currentTodo);
        const nextTodoIndex = currentTodoIndex - 1;
        const nextTodo = todos[nextTodoIndex];

        if (nextTodoIndex < 0) return;

        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo.id === currentTodo.id) return nextTodo;
                if (todo.id === nextTodo.id) return currentTodo;
                return todo;
            });
        });
    }

    function handleArrangeDown() {
        const currentTodo = todos.find(todo => todo.id === id);

        if (!currentTodo) return;

        const currentTodoIndex = todos.indexOf(currentTodo);
        const nextTodoIndex = currentTodoIndex + 1;
        const nextTodo = todos[nextTodoIndex];

        if (nextTodoIndex > todos.length - 1) return;

        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo.id === currentTodo.id) return nextTodo;
                if (todo.id === nextTodo.id) return currentTodo;
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

            <div className="todo-item-side-buttons">
                {/* The list scrolls, so this may be the only solution for drag/drop on mobile */}
                {
                    navigator.maxTouchPoints > 0 &&
                    <div className="arrange-buttons">
                        <button onClick={handleArrangeUp}>
                            <KeyboardArrowUp/>
                        </button>
                        <button onClick={handleArrangeDown}>
                            <KeyboardArrowDown/>
                        </button>
                    </div>
                }

                <button className="delete-todo-button" onClick={() => deleteTodo(id)}>
                    <img src={crossIcon} alt="cross icon" />
                </button>
            </div>
        </li>
    );
}