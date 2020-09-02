import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import searchActions from "../store/actions/search.action";
import Nav from "./Nav";
import DelayLink from "./DelayLink";
import StarRater from "./StarRater";
import imageAlt from "../img/image-alt.png";
import { uuid } from "uuidv4";

function Search({ location }) {
	const mounted = useRef(0);
	const [page, setPage] = useState(1);
	const searchTitle = useSelector(store => store.searchTitle);
	const searchPeople = useSelector(store => store.searchPeople);
	const searchGenre = useSelector(store => store.searchGenre);
	const searchDescription = useSelector(store => store.searchDescription);
	const searchResultIDs = [];
	const searchResults = [searchTitle, searchPeople, searchGenre, searchDescription]
		.reduce((acc, cur) => [...acc, ...cur.result], [])
		.filter(({ id }) => !searchResultIDs.includes(id) && searchResultIDs.push(id))
		.slice((page - 1) * 10, page * 11);
	const dispatch = useDispatch();
	const user = useSelector(store => store.user.result);

	const nextButton1 = useRef(null),
		nextButton2 = useRef(null),
		previousButton1 = useRef(null),
		previousButton2 = useRef(null);

	useEffect(_ => {
		!sessionStorage.getItem("searchCache") &&
			sessionStorage.setItem(
				"searchCache",
				JSON.stringify({ [searchTitle.searchValue]: [[]] })
			);
	});

	useEffect(
		_ => {
			let cache = JSON.parse(sessionStorage.getItem("searchCache"));
			if (
				mounted.current &&
				cache[searchTitle.searchValue] &&
				!cache[searchTitle.searchValue][page]
			) {
				cache[searchTitle.searchValue][page] = searchResults.map(movie => movie.id);
				sessionStorage.setItem("searchCache", JSON.stringify(cache));
			}
		},
		[searchTitle, searchPeople, searchGenre, searchDescription]
	);

	useEffect(_ => {
		document.getElementById("root").style.opacity = 1;
	}, []);

	/* Show buttons appropriately while restoring place if they're returning through "Back" in Nav */
	useEffect(_ => {
		if (!mounted.current && location.page > 1) {
			setTimeout(_ => {
				[nextButton1, nextButton2].forEach(
					btn =>
						(btn.current.style.transform =
							"translateX(calc(190px - 1rem))")
				);
				[previousButton1, previousButton2].forEach(btn => {
					btn.current.style.opacity = 1;
					btn.current.style.pointerEvents = "auto";
				});
			}, 150);
		}
		// if (!mounted.current && location.withNext)
		!mounted.current && location.page && setPage(location.page);
	}, []);

	useEffect(
		_ => {
			if (!location.page || mounted.current++) {
				const cache =
				sessionStorage.getItem("searchCache")[searchTitle.searchValue] &&
				sessionStorage.getItem("searchCache")[searchTitle.searchValue][page];

				Object.values(searchActions).forEach(action => {
					cache
						? dispatch(
								action(
									user ? user.username : null,
									searchTitle.searchValue,
									page,
									cache.join(",")
								)
						)
						: dispatch(
								action(
									user ? user.username : null,
									searchTitle.searchValue,
									page
								)
						);
				});
			}
		},
		[page]
	);

	useEffect(
		_ => {
			if (searchResults.length < 11 && nextButton1.current) {
				[nextButton1, nextButton2].forEach(btn => {
					btn.current.style.opacity = 0;
					btn.current.style.pointerEvents = "none";
				});
			} else if (searchResults && nextButton1.current) {
				[nextButton1, nextButton2].forEach(btn => {
					btn.current.style.opacity = 1;
					btn.current.style.pointerEvents = "auto";
				});
			}
			if (page === 1 && previousButton1.current) {
				[previousButton1, previousButton2].forEach(btn => {
					btn.current.style.opacity = 0;
					btn.current.style.pointerEvents = "none";
				});
				[nextButton1, nextButton2].forEach(
					btn => (btn.current.style.transform = "translateX(0)")
				);
			} else if (previousButton1.current) {
				[previousButton1, previousButton2].forEach(btn => {
					btn.current.style.opacity = 1;
					btn.current.style.pointerEvents = "auto";
				});
			}
			if (page === 2)
				[nextButton1, nextButton2].forEach(
					btn =>
						(btn.current.style.transform =
							"translateX(calc(190px - 1rem))")
				);
		},
		[searchTitle]
	);

	function onSearch(e) {
		e.persist();
		e.preventDefault();
		setPage(1);
		if (!e.target.children[0].value) return;
		const cache =
			sessionStorage.getItem("searchCache")[searchTitle.searchValue] &&
			sessionStorage.getItem("searchCache")[searchTitle.searchValue][page];
		
		Object.values(searchActions).forEach(action => {
			cache
				? dispatch(
						action(
							user ? user.username : null,
							e.target.children[0].value,
							page,
							cache.join(",")
						)
				)
				: dispatch(
						action(
							user ? user.username : null,
							e.target.children[0].value,
							page
						)
				);
		});
		e.target.reset();
	}

	return (
		<div className="search-page">
			<Nav />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						width: "60vw",
						marginBottom: "1.5rem",
					}}
				>
					<label style={{ margin: ".4rem 0", fontSize: "1.3rem" }}>
						"{searchTitle.searchValue}"
					</label>
					<StarRater />
					<form onSubmit={onSearch}>
						<input
							style={{ marginTop: ".8rem" }}
							className="search"
							type="text"
							placeholder="Search actors, genres, directors"
						/>
					</form>
				</div>
				<div
					style={{
						visibility:
						(searchTitle.loading || searchPeople.loading || searchGenre.loading || searchDescription.loading) || !searchResults.length ? "visible" : "hidden",
					}}
				>
					{mounted && (searchTitle.loading || searchPeople.loading || searchGenre.loading || searchDescription.loading)
						? "Loading..."
						: !searchResults.length
							? "No results found"
							: "Results Below"}
				</div>
				<div
					className="search-results-container"
					style={{ display: searchTitle.result ? "block" : "none" }}
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
							ref={previousButton1}
							className="button-v2"
							style={{
								pointerEvents: "none",
								opacity: 0,
								transition: "opacity 550ms ease-in-out",
							}}
							onClick={e => {
								e.target.blur();
								setPage(page - 1);
							}}
						>
							Previous
						</button>
						<button
							ref={nextButton1}
							className="button-v2"
							style={{
								opacity: 1,
								transition:
									"opacity 550ms ease-in-out, transform 550ms ease-in-out",
							}}
							onClick={e => {
								e.target.blur();
								setPage(page + 1);
							}}
						>
							Next
						</button>
					</div>
					{!searchResults.length ? null : (
						<ul className="search-results">
							{searchResults.slice(0, 10).map(movie => (
								<li key={uuid()}>
									{/* Image Link */}
									<DelayLink
										to={{
											pathname: `movies/${movie.id}`,
											searchValue: searchTitle.searchValue,
											page,
											back: "/search",
										}}
									>
										<picture>
											<source
												srcSet={movie.cover_file}
											/>
											<source srcSet={imageAlt} />
											<img
												alt="thumbnail"
												type="image/gif"
											/>
										</picture>
									</DelayLink>
									<span className="search-results-info">
										{/* Text Link*/}
										<DelayLink
											to={{
												pathname: `movies/${movie.id}`,
												searchValue: searchTitle.searchValue,
												page,
												back: "/search",
											}}
										>
											<span
												style={{
													color: "white",
													position: "relative",
													zIndex: "5",
												}}
											>
												<label>{movie.title}</label>
												{movie.genres && (
													<span>
														{" "}
														|{" "}
														{movie.genres.join(
															", "
														)}
													</span>
												)}
												{movie.mpaa_rating !==
													"Not available" && (
													<span>
														{" "}
														| {movie.mpaa_rating}
													</span>
												)}
												{movie.duration_in_mins ? (
													movie.duration_in_mins %
													60 ? (
														movie.duration_in_mins >=
														60 ? (
															<span>
																{" "}
																|{" "}
																{Math.floor(
																	movie.duration_in_mins /
																		60
																)}
																h{" "}
																{movie.duration_in_mins %
																	60}{" "}
																min
															</span>
														) : (
															<span>
																{" "}
																|{" "}
																{
																	movie.duration_in_mins
																}{" "}
																min
															</span>
														)
													) : (
														<span>
															{" "}
															|{" "}
															{movie.duration_in_mins %
																60}
															h
														</span>
													)
												) : null}
												{movie.release_date && (
													<span>
														{" "}
														|{" "}
														{movie.release_date.slice(
															0,
															4
														)}
													</span>
												)}
											</span>
										</DelayLink>
									</span>
								</li>
							))}
						</ul>
					)}

					<div
						style={{
							posiiton: "relative",
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
							height: "100%",
							marginBottom: "4rem",
						}}
					>
						<button
							ref={previousButton2}
							className="button-v2"
							style={{
								pointerEvents: "none",
								opacity: 0,
								transition: "opacity 550ms ease-in-out",
							}}
							onClick={e => {
								e.target.blur();
								setPage(page - 1);
							}}
						>
							Previous
						</button>
						<button
							ref={nextButton2}
							style={{
								transition:
									"transform 550ms ease-in-out, opacity 550ms ease-in-out",
							}}
							className="button-v2"
							onClick={e => {
								e.target.blur();
								setPage(page + 1);
							}}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Search;
