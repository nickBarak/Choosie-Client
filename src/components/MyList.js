import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeRequest } from "../store/actions/makeRequest.action";
import { getCurrentlySaved } from "../store/actions/getCurrentlySaved.action";
import Nav from "./Nav";
import MovieList from "./MovieList";
import BinManager from "./BinManager";
import BinManagerContext from "../store/contexts/BinManager.context.js";
import DelayLink from "./DelayLink";
import { server } from "../APIs";
import { updateUser } from "../store/actions/updateUser.action";
import { slideDisplayRow } from "../Functions";
import { uuid } from "uuidv4";

export default function MyList() {
	const dispatch = useDispatch();
	const { result, error } = useSelector(store => store.makeRequest);
	const [binManagerOpen, setBinManagerOpen] = useContext(BinManagerContext);
	const [showBins, setShowBins] = useState(false);
	const user = useSelector(store => store.user.result);
	const currentlySaved = useSelector(store => store.currentlySaved.result);
	const [displaying, setDisplaying] = useState("Currently Saved");
	const [creatingBin, setCreatingBin] = useState(false);
	const [creatingBinError, setCreatingBinError] = useState(null);
	const [updatingBinError, setUpdatingBinError] = useState(null);

	useEffect(_ => {
		document.getElementById("root").style.opacity = 1;
	}, []);

	useEffect(_ => {
		if (user) {
			dispatch(
				makeRequest(
					"movies/list",
					"?movies=" + user.currently_saved.join(","),
					{},
					_ => slideDisplayRow(50, false)
				)
			);
			dispatch(getCurrentlySaved(user.currently_saved));
		}
	}, []);

	useEffect(
		_ => {
			if (!showBins) setCreatingBin(false);
		},
		[showBins]
	);

	async function createBin(e) {
		e.persist();
		e.preventDefault();
		const binName = e.target.children[0].value;
		try {
			if (Object.keys(user.bins).includes(binName))
				return setCreatingBinError("Bin already exists");
			setCreatingBinError(null);
			const response = await fetch(
				server + `users/${user.username}/bins`,
				{
					headers: { "Content-Type": "application/json" },
					method: "POST",
					credentials: 'include',
					body: JSON.stringify({ bin: { [binName]: [] } }),
				}
			);
			if (response.ok) {
				dispatch(updateUser(user.username));
			} else setCreatingBinError("Error creating bin");
		} catch (e) {
			console.log(e);
		} finally {
			if (!Object.keys(user.bins).includes(binName)) {
				setCreatingBin(false);
				e.target.reset();
			}
		}
	}

	/* Add movie to bin on drag and drop */
	async function updateBin(e) {
		e.persist();
		e.preventDefault();
		setUpdatingBinError(null);
		let res;
		const id = e.dataTransfer.getData("text/plain").split("/movies/")[1];
		try {
			if (!user.currently_saved.includes(Number(id))) {
				res = await fetch(server + `movies?user=${user.username}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					credentials: 'include',
					body: JSON.stringify({
						movieID: Number(id),
						inRecent: true,
					}),
				});
				!res.ok && setUpdatingBinError("Error updating bin");
			}

			res = await fetch(server + `users/${user.username}/bins`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: 'include',
				body: JSON.stringify({
					bin: {
						[e.target.textContent]: [
							...user.bins[e.target.textContent],
							id,
						],
					},
				}),
			});
			res.ok
				? dispatch(updateUser(user.username))
				: setUpdatingBinError("Error updating bin");
		} catch (e) {
			console.log(e);
		}
	}

	const onClickYourBins = e => {
		e.preventDefault();
		let { style } = e.target.parentElement.children[1];
		if (showBins) {
			style.maxHeight = 0;
			style.transform = "scaleY(0)";
		} else {
			style.maxHeight = "100%";
			style.transform = "scaleY(1)";
		}
		setShowBins(!showBins);
		setCreatingBinError(null);
	};

	return (
		<div
			className="my-list"
			style={{ display: "flex", overflow: "hidden" }}
		>
			<div style={{ display: "flex", flexDirection: "column " }}>
				<Nav />
				{user && (
					<ul className="sidebar">
						{
							<li
								className="sidebar-li-hover"
								onClick={e => {
									if (displaying !== "Currently Saved")
										slideDisplayRow();
									setTimeout(
										_ =>
											dispatch(
												makeRequest(
													"movies/list",
													"?movies=" +
														user.currently_saved.join(
															","
														),
													{},
													_ =>
														slideDisplayRow(
															150,
															false
														)
												)
											),
										150
									);
									setDisplaying("Currently Saved");
								}}
								tabIndex="0"
							>
								Currently Saved
							</li>
						}
						{user.show_save_history && (
							<li
								className="sidebar-li-hover"
								onClick={e => {
									if (displaying !== "Save History")
										slideDisplayRow();
									setTimeout(
										_ =>
											dispatch(
												makeRequest(
													"movies/list",
													"?movies=" +
														user.recent_save_history.join(
															","
														),
													{},
													_ =>
														slideDisplayRow(
															150,
															false
														)
												)
											),
										150
									);
									setDisplaying("Save History");
								}}
								tabIndex="0"
							>
								Save History
							</li>
						)}
						<li>
							{
								<div>
									<label
										onFocus={e =>
											(e.target.style.color = showBins
												? "white"
												: "var(--color-offset)")
										}
										onBlur={e =>
											(e.target.style.color = showBins
												? "var(--color-offset)"
												: "red")
										}
										tabIndex="0"
										style={{
											outline: "none",
											cursor: "pointer",
										}}
										onClick={onClickYourBins}
										onKeyDown={e =>
											e.keyCode === 13 &&
											onClickYourBins(e)
										}
										onMouseOver={e =>
											(e.target.style.color = showBins
												? "white"
												: "var(--color-offset)")
										}
										onMouseOut={e =>
											(e.target.style.color = showBins
												? "var(--color-offset)"
												: "red")
										}
									>
										Your Bins
									</label>
									<ul
										style={{
											maxHeight: 0,
											transform: "scaleY(0)",
											transformOrigin: "top",
											transition:
												"max-height 175ms ease-out, transform 175ms ease-out",
										}}
									>
										{/* Highlight displayed bin. Allow drag and drop movies */}
										{Object.keys(user.bins).map(
											(bin, i) => (
												<li
													onFocus={e =>
														(e.target.style.color =
															"var(--color-offset)")
													}
													onBlur={e =>
														(e.target.style.color =
															"red")
													}
													tabIndex={
														showBins ? 0 : "-1"
													}
													onMouseOver={e => {
														e.target.style.color =
															"var(--color-offset)";
														e.target.style.cursor =
															"pointer";
													}}
													onMouseOut={e =>
														(e.target.style.color =
															"red")
													}
													style={{
														marginLeft: "1.25rem",
														outline: "none",
													}}
													key={uuid()}
													onClick={e => {
														e.preventDefault();
														if (displaying !== bin)
															slideDisplayRow();
														setTimeout(
															_ =>
																dispatch(
																	makeRequest(
																		"movies/list",
																		"?movies=" +
																			user.bins[
																				bin
																			].join(
																				","
																			),
																		{},
																		_ =>
																			slideDisplayRow(
																				150,
																				false
																			)
																	)
																),
															150
														);
														setDisplaying(bin);
														setShowBins(!showBins);
														setCreatingBinError(
															null
														);
													}}
													onKeyDown={e => {
														e.preventDefault();
														if (e.keyCode === 13) {
															if (
																displaying !==
																bin
															)
																slideDisplayRow();
															setTimeout(
																_ =>
																	dispatch(
																		makeRequest(
																			"movies/list",
																			"?movies=" +
																				user.bins[
																					bin
																				].join(
																					","
																				),
																			{},
																			_ =>
																				slideDisplayRow(
																					150,
																					false
																				)
																		)
																	),
																150
															);
															setDisplaying(bin);
															setShowBins(
																!showBins
															);
															setCreatingBinError(
																null
															);
														}
													}}
													onDrop={e => {
														e.preventDefault();
														!user.currently_saved.includes(
															Number(
																e.dataTransfer
																	.getData(
																		"text/plain"
																	)
																	.split(
																		"/movies/"
																	)[1]
															)
														)
															? window.confirm(
																	"Save movie and add to bin?"
															  ) && updateBin(e)
															: updateBin(e);
													}}
													onDragOver={e => {
														e.preventDefault();
														e.target.style.color =
															"white";
													}}
													onDragLeave={e => {
														e.preventDefault();
														e.target.style.color =
															"red";
													}}
												>
													{bin}
												</li>
											)
										)}
										<li style={{ marginLeft: "1.25rem" }}>
											{creatingBin ? (
												<form onSubmit={createBin}>
													<input
														style={{
															borderRadius: "2px",
															padding: ".25rem",
															height: "1.3rem",
															width: "110px",
														}}
														type="text"
														placeholder="Enter bin name"
													/>
												</form>
											) : (
												<button
													tabIndex="0"
													onClick={_ =>
														setCreatingBin(true)
													}
													onFocus={e =>
														(e.target.style.transform =
															"scale(1.15)")
													}
													onBlur={e =>
														(e.target.style.transform =
															"scale(1)")
													}
													onKeyDown={e =>
														e.keyCode === 13 &&
														setCreatingBin(true)
													}
													style={{
														backgroundColor:
															"transparent",
														border: "none",
														color: "red",
														fontWeight: "bold",
														fontSize: "1.1rem",
														transition:
															"transform 50ms ease-out",
													}}
													onMouseOver={e => {
														e.target.style.transform =
															"scale(1.15)";
														e.target.style.cursor =
															"pointer";
													}}
													onMouseOut={e =>
														(e.target.style.transform =
															"scale(1)")
													}
												>
													+
												</button>
											)}
										</li>
										{creatingBinError && (
											<div style={{ color: "red" }}>
												{creatingBinError}
											</div>
										)}
									</ul>
								</div>
							}
						</li>
						<li>
							<button
								onMouseOver={e =>
									(e.target.style.backgroundColor =
										"var(--bg-color-light)")
								}
								onMouseOut={e => {
									if (document.activeElement !== e.target)
										e.target.style.backgroundColor =
											"var(--color-offset)";
								}}
								onFocus={e =>
									(e.target.style.backgroundColor =
										"var(--bg-color-light)")
								}
								onBlur={e => {
									if (
										![
											...document.querySelectorAll(
												":hover"
											),
										].includes(e.target)
									)
										e.target.style.backgroundColor =
											"var(--color-offset)";
								}}
								style={{
									marginTop: "1rem",
									marginLeft: ".25rem",
								}}
								className="button"
								onClick={e => {
									e.target.blur();
									setBinManagerOpen(!binManagerOpen);
								}}
							>
								Manage Bins
							</button>
						</li>
						<li>{updatingBinError}</li>
					</ul>
				)}
			</div>

			{user ? (
				error ? (
					<div
						style={{
							marginTop: "25%",
							width: "100%",
							textAlign: "center",
						}}
					>
						Error loading movies
					</div>
				) : (
					<MovieList
						withFilter
						displaying={displaying}
						movies={result}
						headingMargin="2rem"
						heading={(_ => {
							switch (displaying) {
								default:
									return result.length
										? `This is what was in "${displaying}"`
										: "This bin was empty!";
								case "Currently Saved":
									return result.length
										? "Here's your complete list of movies"
										: "Save movies by going to their page";
								case "Save History":
									return result.length
										? "These are all the movies you've ever saved"
										: "Save movies by going to their page";
							}
						})()}
					/>
				)
			) : (
				<h2
					style={{
						flex: 4,
						position: "absolute",
						margin: "7rem 0 0 2.5rem",
					}}
				>
					<DelayLink to="/register">
						<span
							style={{ color: "#cc0000" }}
							onMouseOver={e => {
								e.target.style.textDecoration = "underline";
							}}
							onMouseOut={e => {
								e.target.style.textDecoration = "none";
							}}
						>
							Log in
						</span>
					</DelayLink>{" "}
					to see your saved movies
				</h2>
			)}
			{user && binManagerOpen && (
				<BinManager
					movies={currentlySaved}
					displaying={displaying}
					setDisplaying={setDisplaying}
				></BinManager>
			)}
		</div>
	);
}
