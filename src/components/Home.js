import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login";
import Footer from "./Footer";
import searchActions from "../store/actions/search.action";
import { updateUser } from "../store/actions/updateUser.action";
// import UserContext from "../store/contexts/User.context";
import HistoryContext from "../store/contexts/History.context";
import { server } from "../APIs";
import { transitionPage } from "../Functions";

function Home() {
	const dispatch = useDispatch();
	/* Used for redirects */
	const history = useContext(HistoryContext);
	const user = useSelector(store => store.user.result);

	/* Enables fading transitions */
	useEffect(_ => {
		document.getElementById("root").style.opacity = 1;

		/* Session/Cookie Authentication disabled due to differing domain on server */
		
		// fetch(server + '/cached-user', {
		// 	mode: 'cors',
		// 	credentials: true
		// })
		// 	.then(res => res.json())
		// 	.then(username => dispatch( updateUser(username) ))
		// 	.catch(e => console.log(e));

		/* !!!! UNSAFE DATA RETRIEVAL !!!! */
		sessionStorage.getItem('username') && dispatch( updateUser(sessionStorage.getItem('username')) );
	}, []);

	const onSearch = async e => {
		e.persist();
		e.preventDefault();
		try {
			Object.values(searchActions).forEach(action =>
				dispatch(
					action(
						user ? user.username : null,
						e.target.children[0].value,
						1
					)
				)
			);
			e.target.reset();
			history.push("/search");
		} catch (e) {
			console.log(e);
		}
	};

	/* Page transition */
	function onClick(button, route) {
		user &&
			fetch(`${server}home/${user.username}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ button }),
			})
				.then(res => !res.ok && console.log("Something went wrong"))
				.catch(e => console.log(e));
		transitionPage(history, route);
	}

	return (
		<div className="container home">
			<Login history={history} />
			<div className="frame home-frame">
				<h1 className="logo main-logo" style={{ userSelect: "none" }}>
					Choosie
				</h1>
				<form onSubmit={onSearch}>
					<input
						className="search"
						type="text"
						placeholder="Search actors, genres, directors"
						style={{ margin: "1.5rem 1.5rem" }}
					/>
				</form>
				<ul className="button-wrapper">
					<li>
						<button
							className="button"
							onClick={_ => onClick("my_list", "/my-list")}
						>
							My List
						</button>
					</li>
					<li>
						<button
							className="button"
							onClick={_ => onClick("start", "/query")}
						>
							Start
						</button>
					</li>
					<li>
						<button
							className="button"
							onClick={_ => onClick("popular", "/popular")}
						>
							Popular
						</button>
					</li>
				</ul>
			</div>
			<Footer />
		</div>
	);
}

export default Home;
