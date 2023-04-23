import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode, 
    SetStateAction, 
    Dispatch 
} from 'react';

export type Todo = {
	label: string,
	completed: boolean,
	id: string
}

type TodoContextType = {
    renderedTodos: Todo[],
    currentFilter: string,
    itemsLeft: number,
    setCurrentFilter: Dispatch<SetStateAction<string>>,
    addTodo: (todoLabel: string) => void,
    deleteTodo: (id: string) => void,
    toggleTodo: (id: string) => void,
    filterTodos: () => void,
    clearCompletedTodos: () => void
}

const TodoContext = createContext<TodoContextType>(null!);

export function useTodos() {
    return useContext(TodoContext);
}

const initialTodos = [
	{ label: "todo 1", completed: false, id: crypto.randomUUID() },
	{ label: "todo 2", completed: true, id: crypto.randomUUID() },
	{ label: "todo 3", completed: false, id: crypto.randomUUID() }
];

export default function TodoProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
	const [renderedTodos, setRenderedTodos] = useState<Todo[]>(todos);
	const [currentFilter, setCurrentFilter] = useState<string>("all");

    const itemsLeft = todos.filter(todo => !todo.completed).length;

    useEffect(() => {
		setRenderedTodos(todos);
		// setCurrentFilter("all");
	}, [todos]);

	useEffect(() => {
		filterTodos();
	}, [currentFilter]);

    function addTodo(todoLabel: string) {
		setTodos(prevTodos => {
			return [
				...prevTodos,
				{ 
					label: todoLabel, 
					completed: false, 
					id: crypto.randomUUID() 
				}
			];
		});
	}

	function deleteTodo(id: string) {
		setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
	}

	function toggleTodo(id: string) {
		setTodos(prevTodos => {
			const newTodos = [...prevTodos];
			const todoById = newTodos.find(todo => todo.id === id);

			if (!todoById) return newTodos;
			todoById.completed = !todoById.completed;

			return newTodos;
		});
	}

	function filterTodos() {
		setRenderedTodos(() => {
			let newTodos = [...todos];

			if (currentFilter === "all") {
				newTodos = newTodos;
			} else if (currentFilter === "active") {
				newTodos = newTodos.filter(todo => !todo.completed);
			} else if (currentFilter === "completed") {
				newTodos = newTodos.filter(todo => todo.completed);
			}

			return newTodos;
		});
	}

	function clearCompletedTodos() {
		setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
	}

    return (
        <TodoContext.Provider value={{ 
            renderedTodos, 
            currentFilter,
            itemsLeft, 
            setCurrentFilter, 
            addTodo, 
            deleteTodo, 
            toggleTodo, 
            filterTodos, 
            clearCompletedTodos 
        }}>
            { children }
        </TodoContext.Provider>
    );
}