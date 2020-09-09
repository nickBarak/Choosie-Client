import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./Nav";
import MovieList from "./MovieList";
import { makeRequest } from "../store/actions/makeRequest.action";
import StarRater from "./StarRater";
import { server } from "../APIs";
import { slideDisplayRow } from "../Functions";
import { uuid } from "uuidv4";

class QueryContent {
	constructor(prompt, buttonSet, nextButton) {
		this.prompt = prompt;
		this.buttonSet = [...buttonSet];
		this.nextButton = nextButton;
	}
}

const phases = [
	new QueryContent(
		"Feeling a particular genre?",
		[["Action", "Comedy", "Drama", "Thriller"]],
		"Show More"
	),
	new QueryContent(
		"You can select more than one if you want",
		[
			["Romance", "Sci-Fi", "Fantasy", "Family", ""],
			["Mystery", "Documentary", "Sport", "Western"],
			["Animation", "Adventure", "Superhero", "War", ""],
			["Crime", "Musical", "Biography", "Horror"],
			["Action", "Comedy", "Drama", "Thriller"],
		],
		"Next"
	),
	new QueryContent(
		"Want to apply any time constraints?",
		[[{ 60: "1 hour" }, { 120: "2 hours" }, { 150: "2.5 hours" }]],
		"None"
	),
	new QueryContent(
		"Time periods preferred?",
		[
			["1970s", "1980s", "Earlier", "Any"],
			["1990s", "2000s", "Later"],
		],
		"Next"
	),
];

/* Order is weird on small screens */
const phase3MobileButtonSet = [
	"Earlier",
	"1970s",
	"1980s",
	"1990s",
	"2000s",
	"Later",
	"Any",
];

function Query({ location }) {
	const user = useSelector(store => store.user.result);
	const [phase, setPhase] = useState(0);
	const { prompt, buttonSet, nextButton } = phase < 4 && phases[phase];
	const answers = useRef([[]]);
	let { result, error } = useSelector(store => store.makeRequest);
	const resultIDs = [];
	result = result.filter(({ id }) => !resultIDs.includes(id) && resultIDs.push(id));
	const [set, setSet] = useState(1);
	const dispatch = useDispatch();
	const mainNextButton = useRef(null);
	const mainNextButton2 = useRef(null);
	const mainPrevButton = useRef(null);
	const mainPrevButton2 = useRef(null);
	const frame = useRef(null);
	const frame2 = useRef(null);
	const mounted = useRef(false);

	useEffect(_ => {
		document.getElementById("root").style.opacity = 1;
	}, []);

	/* If user returning through Nav "Back" button */
	useEffect(_ => {
		if (location.searchValue) {
			answers.current = location.searchValue;
			setPhase(4);
			setSet(location.page);
		}
	}, []);

	/* Get results of query on phase 4 */
	useEffect(
		_ => {
			if (phase > 3) {
				const genres = answers.current[0].length
						? `&genres=${answers.current[0]}`
						: "",
					timeConstraint = answers.current[1].length
						? answers.current[1][0] !== "none" &&
						  `&timeConstraint=${answers.current[1]}`
						: "",
					timePeriods =
						answers.current[2].length &&
						!answers.current[2].includes("Any")
							? `&timePeriods=${answers.current[2]}`
							: "";

				document.getElementsByClassName(
					"transition-frame"
				)[0].style.opacity = 1;
				setTimeout(
					_ =>
						dispatch(
							makeRequest(
								`start`,
								(genres || timeConstraint || timePeriods) &&
									"?set=" +
										set +
										genres +
										timeConstraint +
										timePeriods,
								{},
								slideDisplayRow(200, null, 3)
							)
						),
					300
				);
				if (!mounted.current && location.page > 1) {
					setTimeout(_ => {
						[mainNextButton, mainNextButton2].forEach(btn => {
							if (btn.current)
								btn.current.style.transform =
									"translateX(calc(190px - 1rem))";
						});
						[mainPrevButton, mainPrevButton2].forEach(btn => {
							if (btn.current) {
								btn.current.style.opacity = 1;
								btn.current.style.pointerEvents = "auto";
							}
						});
					}, 200);
					mounted.current = true;
				}
			} else if (phase > 1) answers.current.push([]);
		},
		[phase, set]
	);

	/* Make sure buttons show proper color */
	function manageFilters(e) {
		e.preventDefault();
		let { style } = e.target;
		let index = phase ? phase - 1 : phase;
		if (phase === 2) {
			e.target.style.backgroundColor = "var(--color-offset)";
			e.target.style.color = "var(--bg-color-dark)";
			answers.current[1] = [e.target.value];
			frame.current.style.opacity = 0;
			setTimeout(_ => {
				setPhase(phase + 1);
				frame.current.style.opacity = 1;
			}, 750);
			return;
		}
		if (answers.current[index].includes(e.target.textContent)) {
			answers.current[index] = answers.current[index].filter(filter =>
				index === 1
					? filter !== e.target.value
					: filter !== e.target.textContent
			);
			style.backgroundColor = "var(--color-offset)";
			style.color = "var(--bg-color-dark)";
		} else {
			style.backgroundColor = "var(--bg-color-dark)";
			style.color = "var(--color-offset)";
			answers.current[index] = [
				...answers.current[index],
				e.target.textContent,
			];
		}
	}

	return (
		<div className="query">
			<Nav />

			{phase < 4 && (
				<div
					className="container"
					style={{
						position: "absolute",
						zIndex: "-1",
						height: "100vh",
						top: 0,
					}}
				>
					<div className="frame transition-frame" ref={frame}>
						<h2 className="query-prompt">{prompt}</h2>
						{/* Display buttons differently depending on screen size. Add effects. Make sure button values added to collection of question answers when clicked */}
						{window.innerWidth > 455 || ![1, 3].includes(phase) ? (
							buttonSet.map((set, i) => (
								<ul
									key={uuid()}
									className="button-wrapper button-wrapper-full"
								>
									{(_ => {
										const buttons =
											phase === 0 && user
												? Object.entries(
														user.genre_selection
												  )
														.sort(
															([, a], [, b]) =>
																b - a
														)
														.map(([key]) => key)
														.slice(0, 4)
												: set;
										return buttons.map((button, j) => (
											<li key={uuid()}>
												<button
													className="button"
													onClick={manageFilters}
													style={
														button
															? phase === 1 &&
															  answers.current[0].includes(
																	button
															  )
																? {
																		color:
																			"var(--color-offset)",
																		backgroundColor:
																			"var(--bg-color-dark)",
																  }
																: {
																		color:
																			"var(-bg-color-dark)",
																		backgroundColor:
																			"var(--color-offset)",
																  }
															: {
																	visibility:
																		"hidden",
															  }
													}
													value={
														phase === 2 &&
														Object.keys(button)[0]
													}
													onMouseOver={e => {
														e.target.style.backgroundColor =
															"var(--bg-color-dark)";
														e.target.style.color =
															"var(--color-offset)";
													}}
													onFocus={e => {
														e.target.style.backgroundColor =
															"var(--bg-color-dark)";
														e.target.style.color =
															"var(--color-offset)";
													}}
													onMouseOut={e => {
														if (
															answers.current[
																phase > 0
																	? phase - 1
																	: phase
															] &&
															!answers.current[
																phase > 0
																	? phase - 1
																	: phase
															].includes(
																e.target
																	.textContent
															)
														) {
															e.target.style.backgroundColor =
																"var(--color-offset)";
															e.target.style.color =
																"var(--bg-color-dark)";
														}
													}}
													onBlur={e => {
														if (
															answers.current[
																phase === 1
																	? phase - 1
																	: phase
															] &&
															!answers.current[
																phase > 0
																	? phase - 1
																	: phase
															].includes(
																e.target
																	.textContent
															)
														) {
															e.target.style.backgroundColor =
																"var(--color-offset)";
															e.target.style.color =
																"var(--bg-color-dark)";
														}
													}}
												>
													{phase === 2
														? Object.values(
																button
														  )[0]
														: button}
												</button>
											</li>
										));
									})()}
									{i === buttonSet.length - 1 && (
										<li>
											<button
												className="button query-next"
												onClick={e => {
													if (user && phase === 1)
														fetch(
															server +
																"start?user=" +
																user.username,
															{
																mode: "cors",
																method: "POST",
																headers: {
																	"Content-Type":
																		"application/json",
																},
																body: JSON.stringify(
																	{
																		genres: answers.current[0].map(
																			answer => ({
																				[answer]:
																					user
																						.genre_selection[
																						answer
																					] +
																					1,
																			})
																		),
																	}
																),
															}
														);
													frame.current.style.opacity = 0;
													setTimeout(_ => {
														setPhase(phase + 1);
														if (frame.current)
															frame.current.style.opacity = 1;
														if (frame2.current)
															frame2.current.style.opacity = 1;
													}, 750);
													[
														...e.target
															.parentElement
															.parentElement
															.parentElement
															.children,
													]
														.slice(1)
														.forEach(ul =>
															[
																...ul.children,
															].forEach(li => {
																li.children[0].style.color =
																	"var(--bg-color-dark";
																li.children[0].style.backgroundColor =
																	"var(--color-offset)";
															})
														);
												}}
											>
												{nextButton}
											</button>
										</li>
									)}
								</ul>
							))
						) : (
							<ul className="button-wrappper button-wrapper-mobile">
								{(phase === 3
									? phase3MobileButtonSet
									: buttonSet
											.reduce(
												(acc, cur) => [...acc, ...cur],
												[]
											)
											.filter(btn => btn)
								).map((button, i, buttons) => (
									<>
										<li key={uuid()}>
											<button
												className="button"
												onClick={manageFilters}
												style={
													button
														? phase === 1 &&
														  answers.current[0].includes(
																button
														  )
															? {
																	color:
																		"var(--color-offset)",
																	backgroundColor:
																		"var(--bg-color-dark)",
															  }
															: {
																	color:
																		"var(-bg-color-dark)",
																	backgroundColor:
																		"var(--color-offset)",
															  }
														: {
																visibility:
																	"hidden",
														  }
												}
												value={
													phase === 2 &&
													Object.keys(button)[0]
												}
												onMouseOver={e => {
													e.target.style.backgroundColor =
														"var(--bg-color-dark)";
													e.target.style.color =
														"var(--color-offset)";
												}}
												onFocus={e => {
													e.target.style.backgroundColor =
														"var(--bg-color-dark)";
													e.target.style.color =
														"var(--color-offset)";
												}}
												onMouseOut={e => {
													if (
														answers.current[
															phase > 0
																? phase - 1
																: phase
														] &&
														!answers.current[
															phase > 0
																? phase - 1
																: phase
														].includes(
															e.target.textContent
														)
													) {
														e.target.style.backgroundColor =
															"var(--color-offset)";
														e.target.style.color =
															"var(--bg-color-dark)";
													}
												}}
												onBlur={e => {
													if (
														answers.current[
															phase === 1
																? phase - 1
																: phase
														] &&
														!answers.current[
															phase > 0
																? phase - 1
																: phase
														].includes(
															e.target.textContent
														)
													) {
														e.target.style.backgroundColor =
															"var(--color-offset)";
														e.target.style.color =
															"var(--bg-color-dark)";
													}
												}}
											>
												{phase === 2
													? Object.values(button)[0]
													: button}
											</button>
										</li>
										{i === buttons.length - 1 && (
											<li>
												<button
													className="button query-next"
													onClick={e => {
														if (user && phase === 1)
															fetch(
																server +
																	"start?user=" +
																	user.username,
																{
																	mode:
																		"cors",
																	method:
																		"POST",
																	headers: {
																		"Content-Type":
																			"application/json",
																	},
																	body: JSON.stringify(
																		{
																			genres: answers.current[0].map(
																				answer => ({
																					[answer]:
																						user
																							.genre_selection[
																							answer
																						] +
																						1,
																				})
																			),
																		}
																	),
																}
															);
														frame.current.style.opacity = 0;
														setTimeout(_ => {
															setPhase(phase + 1);
															if (frame.current)
																frame.current.style.opacity = 1;
															if (frame2.current)
																frame2.current.style.opacity = 1;
														}, 750);
														[
															...e.target
																.parentElement
																.parentElement
																.parentElement
																.children,
														]
															.slice(1)
															.forEach(ul =>
																[
																	...ul.children,
																].forEach(
																	li => {
																		li.children[0].style.color =
																			"var(--bg-color-dark";
																		li.children[0].style.backgroundColor =
																			"var(--color-offset)";
																	}
																)
															);
													}}
												>
													{nextButton}
												</button>
											</li>
										)}
									</>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
			<div style={{ color: "red" }}>
				{error && "Error loading movies"}
			</div>
			{phase > 3 && (
				<div
					style={{
						display: phase < 4 ? "none" : "block",
						opacity: 0,
						position: "relative",
					}}
					ref={frame2}
					className="transition-frame"
				>{result && result.length && <>
					<div
						className="button-v2-container"
						style={{
							position: "absolute",
							display: "flex",
							justifyContent: "space-between",
							left: 0,
							top: "1.5rem",
						}}
					>
						<button
							className="button-v2"
							style={{
								pointerEvents: "none",
								opacity: 0,
								left: "1.5rem",
								transition: "opacity 550ms ease-in-out",
							}}
							onClick={e => {
								if (set === 2) {
									[e.target, mainPrevButton2.current].forEach(
										btn => {
											btn.style.opacity = 0;
											btn.parentElement.children[1].style.transform =
												"translateX(0)";
											btn.style.pointerEvents = "none";
										}
									);
								}
								e.target.blur();
								slideDisplayRow(0, null, 2);
								setSet(set - 1);
							}}
							ref={mainPrevButton}
						>
							Previous
						</button>
						<button
							style={{
								left: "1.5rem",
								transition: "transform 550ms ease-in-out",
							}}
							className="button-v2"
							onClick={e => {
								if (set === 1) {
									[e.target, mainNextButton2.current].forEach(
										btn => {
											btn.style.transform =
												"translateX(calc(190px - 1rem))";
											btn.parentElement.children[0].style.opacity = 1;
											btn.parentElement.children[0].style.pointerEvents =
												"auto";
										}
									);
								}
								e.target.blur();
								slideDisplayRow(0, null, 1);
								setSet(set + 1);
							}}
							ref={mainNextButton}
						>
							Next
						</button>
					</div> </>}
					<MovieList
						movies={result || []}
						heading={result ? result.length
							? "Here are some movies you might be interested in"
							: "No results found"
						: "Error loading movies"}
						displaying="Query"
						lowerMargin="4rem"
						headingMargin="3.5rem"
						locationdetails={{
							searchValue: answers.current,
							page: set,
							back: "/query",
						}}
					/>
					{result && result.length && <>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginBottom: "9.25rem",
						}}
					>
						<StarRater />
					</div>
					<div
						className="button-v2-container"
						style={{
							position: "absolute",
							display: "flex",
							justifyContent: "space-between",
							bottom: "5rem",
							left: 0,
						}}
					>
						<button
							className="button-v2"
							style={{
								pointerEvents: "none",
								opacity: 0,
								left: "1.5rem",
								transition: "opacity 550ms ease-in-out",
							}}
							onClick={e => {
								if (set === 2) {
									[e.target, mainPrevButton.current].forEach(
										btn => {
											btn.style.opacity = 0;
											btn.parentElement.children[1].style.transform =
												"translateX(0)";
											btn.style.pointerEvents = "none";
										}
									);
								}
								e.target.blur();
								slideDisplayRow(0, null, 2);
								setSet(set - 1);
							}}
							ref={mainPrevButton2}
						>
							Previous
						</button>
						<button
							style={{
								left: "1.5rem",
								transition: "transform 550ms ease-in-out",
							}}
							className="button-v2"
							onClick={e => {
								if (set === 1) {
									[e.target, mainNextButton.current].forEach(
										btn => {
											btn.style.transform =
												"translateX(calc(190px - 1rem))";
											btn.parentElement.children[0].style.opacity = 1;
											btn.parentElement.children[0].style.pointerEvents =
												"auto";
										}
									);
								}
								e.target.blur();
								slideDisplayRow(0, null, 1);
								setSet(set + 1);
							}}
							ref={mainNextButton2}
						>
							Next
						</button>
					</div>
					</>}
				</div>
			)}
		</div>
	);
}

export default Query;
