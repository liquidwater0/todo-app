import { useState, useEffect, useRef, FormEvent } from 'react';
import "./scss/App.scss";

import sunIcon from "./assets/icon-sun.svg";
import moonIcon from "./assets/icon-moon.svg";

import TodoItem from './components/TodoItem';
import FilterButton from './components/FilterButton';
import Attribution from './components/Attribution';

/*
	Fix toggling todo not working
	Fix toggling todo resetting filter
	fix off center circle
*/

export type Todo = {
	label: string,
	completed: boolean,
	id: string
}

const initialTodos = [
	{ label: "todo 1", completed: false, id: crypto.randomUUID() },
	{ label: "todo 2", completed: true, id: crypto.randomUUID() },
	{ label: "todo 3", completed: false, id: crypto.randomUUID() }
];

function App() {
	const [theme, setTheme] = useState<string>("dark");
	const [todos, setTodos] = useState<Todo[]>(initialTodos);
	const [renderedTodos, setRenderedTodos] = useState<Todo[]>(todos);
	const [currentFilter, setCurrentFilter] = useState<string>("all");
	const inputRef = useRef<HTMLInputElement>(null!);

	const itemsLeft = todos.filter(todo => !todo.completed).length;

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		setRenderedTodos(todos);
		setCurrentFilter("all");
	}, [todos]);

	useEffect(() => {
		filterTodos();
	}, [currentFilter]);

	function handleTodoFormSubmit(event: FormEvent) {
		event.preventDefault();
		const inputValue = inputRef.current.value;

		if (inputValue.trim() === "") return;

		addTodo(inputValue);
		inputRef.current.value = "";
	}

	function toggleTheme() {
		setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
	}

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
		setTodos(prevTodos => {
			return [...prevTodos].filter(todo => todo.id !== id);
		});
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
    	<>
			<header className='main-header'></header>

			<main className='main'>
				<form className='todo-form' onSubmit={handleTodoFormSubmit}>
					<header className="todo-header">
						<div>
							<h1>TODO</h1>
							<button 
								className='theme-changer-button'
								type="button" 
								onClick={toggleTheme}
							>
								<img 
									src={theme === "dark" ? sunIcon : moonIcon} 
									alt="theme changer icon" 
								/>
							</button>
						</div>
						<div className="add-todo-container todo-section">
							<div className="status-circle"/>
							<input 
								className="add-todo-input" 
								type="text" 
								placeholder='Create a new todo...'
								ref={inputRef}
							/>
						</div>
					</header>

					<div className="todo-body">
						<ul className='todo-list'>
							{renderedTodos.map(todo => 
								<TodoItem 
									key={todo.id} 
									todo={todo} 
									toggleTodo={toggleTodo}
									deleteTodo={deleteTodo}
								/>
							)}
						</ul>

						<div className='todo-filtering'>
							<div className="todos-left">{ itemsLeft } items left</div>
							<div className='todo-filters'>
								<FilterButton
									active={currentFilter === "all"}
									onClick={() => setCurrentFilter("all")}
								>
									All
								</FilterButton>
								<FilterButton
									active={currentFilter === "active"}
									onClick={() => setCurrentFilter("active")}
								>
									Active
								</FilterButton>
								<FilterButton
									active={currentFilter === "completed"}
									onClick={() => setCurrentFilter("completed")}
								>
									Completed
								</FilterButton>
							</div>
							<div>
								<FilterButton onClick={clearCompletedTodos}>
									Clear Completed
								</FilterButton>
							</div>
						</div>
					</div>
				</form>
			</main>

			{/* <Attribution/> */}
    	</>
  	);
}

export default App;