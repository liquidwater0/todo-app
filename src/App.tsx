import { useState, useEffect, useRef, FormEvent } from 'react';
import "./scss/App.scss";
import { useTodos } from './context/TodoContext';

import sunIcon from "./assets/icon-sun.svg";
import moonIcon from "./assets/icon-moon.svg";

import TodoItem from './components/TodoItem';
import FilterButton from './components/FilterButton';
import Attribution from './components/Attribution';

/*
	Fix toggling todo not working
	pressing enter on input calls delete function on todo for some reason
	fix off center circle
*/

function App() {
	const [theme, setTheme] = useState<string>("dark");
	const inputRef = useRef<HTMLInputElement>(null!);
	const { 
		renderedTodos, 
		currentFilter, 
		itemsLeft, 
		addTodo, 
		setCurrentFilter, 
		clearCompletedTodos 
	} = useTodos();

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

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
								<TodoItem key={todo.id} todo={todo}/>
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