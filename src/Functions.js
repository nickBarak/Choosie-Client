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