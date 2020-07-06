import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import HistoryContext from "../store/contexts/History.context";

function DelayLink({ to, className, children }) {
  let timeout = null;
  const history = useContext(HistoryContext);
  const location = useLocation();

  useEffect(_=> _=> timeout && clearTimeout(timeout), [timeout]);

  const onClick = e => {
    // if trying to navigate to current page stop everything
    if (location && location.pathname === to) return;
    document.getElementById('root').style.opacity = 0;
    if (e.defaultPrevented) { return }
    e.preventDefault();
    timeout = setTimeout(async _=> {
        await history.push(to);
        document.getElementById('root').style.opacity = 1;
    }, 1500);
  };

  return <Link className={className} to={to} onClick={onClick}>{children}</Link>;
};

DelayLink.propTypes = {
  to: PropTypes.string
};

export default DelayLink;