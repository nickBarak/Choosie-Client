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

export function slideDisplayRow(timeout=0, down=true, mode=0) {
    setTimeout(_=> {
        if (!document.getElementById('display-row')) slideDisplayRow(timeout, down, mode);

        switch (mode) {
            default: return;
            case 0:
                document.getElementById('display-row').style.transform = `translateY(${down ? '150vh' : 0})`;
                break;
            case 1:
                document.getElementById('display-row').style.transform = `translateX(-150vw)`;
                setTimeout(_=> {
                    document.getElementById('display-row').style.opacity = 0;
                    document.getElementById('display-row').style.transform = `translateX(300vw)`;
                }, 300);
                break;
            case 2:
                document.getElementById('display-row').style.transform = `translateX(150vw)`;
                setTimeout(_=> {
                    document.getElementById('display-row').style.opacity = 0;
                    document.getElementById('display-row').style.transform = `translateX(-300vw)`;
                }, 300);
                break;
            case 3:
                document.getElementById('display-row').style.opacity = 1;
                document.getElementById('display-row').style.transform = `translateX(0)`;
        }
    }, timeout);
}
