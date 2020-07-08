const root = document.getElementById('root');

export async function callAPI(event, endpoint, options, callback, errorhandler) {
    event.persist();
    event.preventDefault();
    try {
        const response = await fetch(endpoint, options || {}),
              json = await response.json();
        callback && callback(json);
    } catch (err) {
        errorhandler
            ? errorhandler(err)
            : console.log(err) 
    };
}

export function transitionPage(history, route) {
    root.style.opacity = 0;
    history && route && setTimeout(async _=> {
        await history.push(route);
        root.style.opacity = 1;
    }, 1500);
}

export function transitionDisplayList() {
    document.getElementById('display-row').style.transform = 'translateY(10vh)';
    setTimeout(_=> document.getElementById('display-row').style.transform = 'translateY(0)', 500);
}