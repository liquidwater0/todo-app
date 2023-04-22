import { useState, useEffect, useRef, FormEvent } from 'react';
import "./scss/App.scss";

import sunIcon from "./assets/icon-sun.svg";
import moonIcon from "./assets/icon-moon.svg";
import checkIcon from "./assets/icon-check.svg";

import Attribution from './components/Attribution';

/*
	Fix toggling todo not working
	style
*/

type Todo = {
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
							<button type="button" onClick={toggleTheme}>
								<img 
									src={theme === "dark" ? sunIcon : moonIcon} 
									alt="theme changer icon" 
								/>
							</button>
						</div>
						<div className="todo-item">
							<input type="text" ref={inputRef}/>
						</div>
					</header>

					<div className="todo-body">
						<ul className='todo-list'>
							{renderedTodos.map(({ label, completed, id }) => 
								<li key={id} onClick={() => toggleTodo(id)} style={{backgroundColor: completed ? "red" : "", cursor: "pointer"}}>
									<div className="todo-item">
										<div className={`todo-status ${completed ? "complete" : ""}`}>
											{ completed && <img src={checkIcon} alt="check icon" /> }
										</div>

										<p className='todo-item-label'>{ label }</p>
									</div>
								</li>
							)}
						</ul>

						<div className='todo-filtering'>
							<div className="todos-left">{ itemsLeft } items left</div>
							<div className='todo-filters'>
								<button type="button" onClick={() => setCurrentFilter("all")}>
									All
								</button>
								<button type="button" onClick={() => setCurrentFilter("active")}>
									Active
								</button>
								<button type="button" onClick={() => setCurrentFilter("completed")}>
									Completed
								</button>
							</div>
							<div>
								<button type="button" onClick={clearCompletedTodos}>Clear Completed</button>
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