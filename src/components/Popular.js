import React, { useState, useEffect, useRef } from "react";
import Nav from "./Nav";
import MovieList from "./MovieList";
import { makeRequest } from "../store/actions/makeRequest.action";
import { useDispatch, useSelector } from "react-redux";
import { slideDisplayRow } from "../Functions";

// let mounted;

function Popular({ location }) {
	const dispatch = useDispatch();
	const { error, result } = useSelector(store => store.makeRequest);
	const [heading, setHeading] = useState(
		"Here's what movies are currently trending"
	);
	const [set, setSet] = useState(1);
	const [column, setColumn] = useState("trending");
	const nextButton = useRef(null),
		previousButton = useRef(null);
	const scrollYRef = useRef(0);
	const [scrollY, setScrollY] = useState(0);

	// v Was cacheing due to SQL ORDER BY clauses being non-deterministic but currently pulling from pre-filled database table v

	// !sessionStorage.getItem('popularCache') && sessionStorage.setItem('popularCache', JSON.stringify({
	//     trending: [[]],
	//     release_date: [[]],
	//     times_saved: [[]],
	//     times_saved_this_month: [[]]
	// }));

	// useEffect(_=> {
	//     let cache = JSON.parse(sessionStorage.getItem('popularCache'));
	//     if (mounted && (!cache[column][set] || !cache[column][set].length)) {
	//         cache[column].push( result.map(({ id }) => id) );
	//         sessionStorage.setItem('popularCache', JSON.stringify(cache));
	//     }
	// }, [result]);

	useEffect(_ => {
		document.getElementById("root").style.opacity = 1;
		// mounted = true;
		dispatch(
			makeRequest(`popular`, `?column=${column}&set=${set}`, {}, _ =>
				slideDisplayRow(150, false)
			)
		);
	}, []);

	useEffect(_ => {
		setTimeout(_ => {
			if (1 || (result && result.length < 19)) {
				nextButton.current.style.opacity = 1;
				nextButton.current.style.pointerEvents = "auto";
			}
		}, 150);
	}, []);

	useEffect(_ => {
		window.addEventListener("scroll", _ => {
			scrollYRef.current = window.scrollY;
		});
	}, []);

	useEffect(_ => setScrollY(scrollYRef.current), [scrollYRef.current]);

	/* If user returning from "Back" */
	useEffect(_ => {
		setTimeout(_ => {
			location.searchValue && setColumn(location.searchValue);
			location.page && setSet(location.page);
			location.scrollY && window.scrollTo(0, location.scrollY);
			nextButton.current.style.opacity = 1;
			nextButton.current.style.pointerEvents = "auto";
			if (location.page > 1) {
				nextButton.current.style.transform = `translateX(calc(${
					window.innerWidth > 850 ? "190" : "140"
				}px - 1rem))`;
				nextButton.current.parentElement.children[0].style.opacity = 1;
				nextButton.current.parentElement.children[0].style.pointerEvents =
					"auto";
			}
		}, 155);
	}, []);

	useEffect(
		_ => {
			// const cache = JSON.parse(sessionStorage.getItem('popularCache'))[column][set];
			// cache
			//     ? dispatch( makeRequest(`movies/list`, `?movies=${cache.join(',')}`, {}, _=> slideDisplayRow(150, false)) )
			dispatch(
				makeRequest(`popular`, `?column=${column}&set=${set}`, {}, _ =>
					slideDisplayRow(150, false)
				)
			);
			switch (column) {
				default:
					break;
				case "trending":
					setHeading("Here's what movies are currently trending");
					break;
				case "recent_releases":
					setHeading("Here are the newest movies on record");
					break;
				case "most_saved_this_month":
					setHeading("Here are the most popular movies this month");
					break;
				case "most_saved":
					setHeading("Here are the most saved movies to date");
					break;
			}
		},
		[column, set]
	);

	useEffect(
		_ => {
			(async _ => {
				if (result && result.length < 20 && nextButton.current) {
					nextButton.current.style.opacity = 0;
					nextButton.current.style.pointerEvents = "none";
				} else if (result && nextButton.current) {
					nextButton.current.style.opacity = 1;
					nextButton.current.style.pointerEvents = "auto";
				}
				if (set === 1 && previousButton.current) {
					previousButton.current.style.opacity = 0;
					previousButton.current.style.pointerEvents = "none";
					nextButton.current.style.transform = "translateX(0)";
				} else if (previousButton.current) {
					previousButton.current.style.opacity = 1;
					previousButton.current.style.pointerEvents = "auto";
				}
				if (set === 2)
					nextButton.current.style.transform =
						"translate(calc(190px - 1rem))";
			})();
		},
		[column]
	);

	const onClickOrEnter = (e, column) => {
		if (!e || e.keyCode === 13) {
			slideDisplayRow();
			setSet(1);
			setColumn(column);
		}
	};

	return (
		<>
			<div
				className="popular"
				style={{ display: "flex", overflow: "hidden" }}
			>
				<div
					className="popular-full-sidebar"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Nav />
					{/* Show movies from one of four categories */}
					<ul className="sidebar">
						<li
							tabIndex="0"
							onKeyDown={e =>
								column !== "trending" &&
								onClickOrEnter(e, "trending")
							}
							className="sidebar-li-hover"
							key="0"
							onClick={_ =>
								column !== "trending" &&
								onClickOrEnter(null, "trending")
							}
						>
							Trending
						</li>
						<li
							tabIndex="0"
							onKeyDown={e =>
								column !== "recent_releases" &&
								onClickOrEnter(e, "recent_releases")
							}
							className="sidebar-li-hover"
							key="1"
							onClick={_ =>
								column !== "recent_releases" &&
								onClickOrEnter(null, "recent_releases")
							}
						>
							Recent Releases
						</li>
						<li
							tabIndex="0"
							onKeyDown={e =>
								column !== "most_saved_this_month" &&
								onClickOrEnter(e, "most_saved_this_month")
							}
							className="sidebar-li-hover"
							key="2"
							onClick={_ =>
								column !== "most_saved_this_month" &&
								onClickOrEnter(null, "most_saved_this_month")
							}
						>
							Most Saved This Month
						</li>
						<li
							tabIndex="0"
							onKeyDown={e =>
								column !== "most_saved" &&
								onClickOrEnter(e, "most_saved")
							}
							className="sidebar-li-hover"
							key="3"
							onClick={_ =>
								column !== "most_saved" &&
								onClickOrEnter(null, "most_saved")
							}
						>
							Most Saved All Time
						</li>
						<li
							className="popular-button-container"
							style={{ width: "100%" }}
						>
							<div
								style={{
									posiiton: "relative",
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									height: "100%",
								}}
							>
								<button
									className="button-v2"
									style={{
										pointerEvents: "none",
										opacity: 0,
										transition: "opacity 550ms ease-in-out",
									}}
									onClick={e => {
										if (set === 2) {
											e.target.style.opacity = 0;
											e.target.parentElement.children[1].style.transform =
												"translateX(0)";
											e.target.style.pointerEvents =
												"none";
										}
										e.target.blur();
										slideDisplayRow();
										setSet(set - 1);
									}}
									ref={previousButton}
								>
									Previous
								</button>
								<button
									style={{
										transition:
											"transform 550ms ease-in-out",
									}}
									className="button-v2"
									onClick={e => {
										if (set === 1) {
											e.target.style.transform = `translateX(calc(${
												window.innerWidth > 850
													? "190"
													: "140"
											}px - 1rem))`;
											e.target.parentElement.children[0].style.opacity = 1;
											e.target.parentElement.children[0].style.pointerEvents =
												"auto";
										}
										e.target.blur();
										slideDisplayRow();
										setSet(set + 1);
									}}
									ref={nextButton}
								>
									Next
								</button>
							</div>
						</li>
					</ul>
				</div>

				<div style={{ flex: 4, marginBottom: "2rem" }}>
					{
						<MovieList
							movies={result}
							heading={error ? "Error loading movies" : heading}
							headingMargin="4rem"
							displaying={"Popular"}
							locationdetails={{
								searchValue: column,
								page: set,
								back: "/popular",
								scrollY,
							}}
						/>
					}
				</div>
			</div>
		</>
	);
}

export default Popular;
