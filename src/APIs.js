export const server = new URL(
    process.env.NODE_ENV !== 'production'
        ? 'http://choosie-env.eba-zrvb6h9m.us-west-1.elasticbeanstalk.com/'
        : 'http://localhost:8082'
);

export default { server };