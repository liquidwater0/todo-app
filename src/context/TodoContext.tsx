import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode, 
    SetStateAction, 
    Dispatch 
} from 'react';
import { STORAGE_KEY } from '../App';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Todo = {
	label: string,
	completed: boolean,
	id: string

	//all i can think of for drag and drop in react
	draggedOver: boolean
}

type TodoContextType = {
	todos: Todo[],
    renderedTodos: Todo[],
    currentFilter: string,
    itemsLeft: number,
    setTodos: Dispatch<SetStateAction<Todo[]>>,
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

export default function TodoProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useLocalStorage<Todo[]>(`${STORAGE_KEY}-todos`, []);
	const [renderedTodos, setRenderedTodos] = useState<Todo[]>(todos);
	const [currentFilter, setCurrentFilter] = useState<string>("all");

    const itemsLeft = todos.filter(todo => !todo.completed).length;

    useEffect(() => {
		setRenderedTodos(todos);
		filterTodos();
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
					id: crypto.randomUUID(),
					draggedOver: false
				}
			];
		});
        setCurrentFilter("all");
	}

	function deleteTodo(id: string) {
		setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
	}

	function toggleTodo(id: string) {
		setTodos(prevTodos => {
			const updatedTodos = prevTodos.map(todo => {
				if (todo.id === id) return { ...todo, completed: !todo.completed };
				return todo;
			});
			
			return updatedTodos;
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
			todos,
            renderedTodos, 
            currentFilter,
            itemsLeft, 
			setTodos,
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