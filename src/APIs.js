export const server = new URL(
    process.env.NODE_ENV === 'production'
        ? 'https://choosie-api.herokuapp.com'
        : 'http://localhost:8082'
);

export default { server };