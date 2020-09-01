import React, { useEffect, useRef } from "react";
import { Simulate } from "react-dom/test-utils";

function Toggler({ prompt, defaultChecked, onCheck, onUncheck }) {
	const checkbox = useRef(null);

	useEffect(_ => {
		if (defaultChecked) {
			checkbox.current.checked = true;
			Simulate.change(checkbox.current);
		}
	}, []);

	return (
		<div style={{ margin: ".2rem" }}>
			<span>{prompt} </span>
			<label className="toggler">
				<input
					type="checkbox"
					ref={checkbox}
					onChange={e => {
						let { style } = e.target.parentElement.children[1];
						if (e.target.checked) {
							style.backgroundColor = "#2196F3";
							style.boxShadow = "0 0 1px #2196F3";
							style.setProperty(
								"--toggler-translation",
								"12.5px"
							);
							onCheck && onCheck();
						} else {
							style.backgroundColor = "#aaa";
							style.boxShadow = "none";
							style.setProperty("--toggler-translation", 0);
							onUncheck && onUncheck();
						}
					}}
				/>
				<span />
			</label>
		</div>
	);
}

export default Toggler;
