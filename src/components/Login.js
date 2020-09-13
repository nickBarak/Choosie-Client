import React, { useState, useContext, useEffect, useRef } from "react";
import { server } from "../APIs";
import HistoryContext from "../store/contexts/History.context";
import { updateUser } from "../store/actions/updateUser.action";
import { useDispatch, useSelector } from "react-redux";
import { destroySession, transitionPage } from "../Functions";
import { useLocation } from 'react-router-dom';

function Login() {
	const dispatch = useDispatch();
	const user = useSelector(store => store.user.result);
	const history = useContext(HistoryContext);
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const [error, setError] = useState(null);
	const loginForm = useRef(null);
	const errorRef = useRef(null);

	useEffect(
		_ => {
			if (error && loginForm.current) {
				loginForm.current.style.transform = "translateY(1rem)";
				errorRef.current.style.transform = "translateY(1.4rem)";
			} else if (loginForm.current) {
				loginForm.current.style.transform = "translateY(0)";
				errorRef.current.style.transform = "translateY(0)";
			}
		},
		[error]
	);

	const onLogin = async e => {
		e.persist();
		e.preventDefault();
		const username = e.target.children[0].value,
			password = e.target.children[2].value;
		if (!username && !password) {
			setError(null);
			setOpen(false);
			return;
		}
		try {
			await destroySession();
			const response = await fetch(server + `users/validate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: 'include',
				body: JSON.stringify({
					username,
					password,
				}),
			});
			const validLogin = await response.json();
			if (!(await validLogin)) {
				setError("Invalid login");
				return;
			} else {
				dispatch(updateUser(username));
				setError(null);
			}
		} catch (e) {
			setError("Something went wrong");
			console.log(e);
		}
	};

	function mouseOverLogin(e) {
		e.target.style.color = "red";
	}

	function mouseOutLogin(e) {
		e.persist();
		setTimeout(_ => (e.target.style.color = "white"), 250);
	}

	return (
		<div
			className="login"
			style={{ position: "absolute", left: "1rem", top: "1rem" }}
		>
			{user ? (
				<>
					<div
						className="login-welcome"
						style={{ color: "var(--color-offset)" }}
					>
						Welcome, {user.name || user.username}
					</div>
					<span
						style={{
							padding: "0 2rem",
							display: "flex",
							flexWrap: "nowrap",
						}}
					>
						<button
							onClick={_=> {
								setOpen(false);
								destroySession()
									.then(_=> console.log(open) || location.reload());
							}}
							style={{
								color: "white",
								cursor: "pointer",
								backgroundColor: "transparent",
								border: "none",
								marginRight: ".5rem",
								whiteSpace: "nowrap",
							}}
							onMouseOver={e => (e.target.style.color = "silver")}
							onMouseOut={e => (e.target.style.color = "white")}
							onFocus={e => (e.target.style.color = "silver")}
							onBlur={e => (e.target.style.color = "white")}
						>
							Log out
						</button>
						<button
							onClick={_ =>
								transitionPage(
									history,
									`profile/${user.username}`
								)
							}
							style={{
								color: "white",
								cursor: "pointer",
								backgroundColor: "transparent",
								border: "none",
								marginLeft: ".5rem",
								whiteSpace: "nowrap",
							}}
							onMouseOver={e => (e.target.style.color = "silver")}
							onMouseOut={e => (e.target.style.color = "white")}
							onFocus={e => (e.target.style.color = "silver")}
							onBlur={e => (e.target.style.color = "white")}
						>
							View profile
						</button>
					</span>
				</>
			) : open ? (
				<>
					<div
						ref={errorRef}
						style={{
							position: "absolute",
							top: "-2rem",
							left: "1.8rem",
							color: "red",
							transition: "transform 300ms ease-in-out",
							whiteSpace: "nowrap",
						}}
					>
						{error}
					</div>
					<form
						onSubmit={onLogin}
						ref={loginForm}
						style={{
							backgroundColor: "transparent",
							display: "inline-block",
							transition: "transform 300ms ease-in-out",
							width: "100%",
						}}
					>
						<input
							style={{
								padding: ".25rem",
								height: "1.25rem",
								marginBottom: ".2rem",
								width: "100%",
							}}
							type="text"
							placeholder="username"
						/>
						<br />
						<input
							style={{
								padding: ".25rem",
								height: "1.25rem",
								width: "100%",
							}}
							type="password"
							placeholder="password"
						/>
						<br />
						<div
							style={{
								marginTop: ".25rem",
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<button
								className="button-manage-movie"
								onClick={e => e.target.blur()}
							>
								Log in
							</button>
							<button
								className="button-manage-movie"
								onClick={e => {
									e.preventDefault();
									transitionPage(history, "/register");
								}}
							>
								Sign up
							</button>
						</div>
					</form>
				</>
			) : (
				/* For stylistic effect */
				<button className="button-login" onClick={_ => setOpen(true)}>
					<span
						style={{ transition: "color 250ms ease-in" }}
						onMouseOver={mouseOverLogin}
						onMouseOut={mouseOutLogin}
					>
						L
					</span>
					<span
						style={{ transition: "color 250ms ease-in" }}
						onMouseOver={mouseOverLogin}
						onMouseOut={mouseOutLogin}
					>
						o
					</span>
					<span
						style={{ transition: "color 250ms ease-in" }}
						onMouseOver={mouseOverLogin}
						onMouseOut={mouseOutLogin}
					>
						g
					</span>
					<span
						style={{
							transition: "color 250ms ease-in",
							marginLeft: ".35rem",
						}}
						onMouseOver={mouseOverLogin}
						onMouseOut={mouseOutLogin}
					>
						i
					</span>
					<span
						style={{ transition: "color 250ms ease-in" }}
						onMouseOver={mouseOverLogin}
						onMouseOut={mouseOutLogin}
					>
						n
					</span>
				</button>
			)}
		</div>
	);
}

export default Login;
