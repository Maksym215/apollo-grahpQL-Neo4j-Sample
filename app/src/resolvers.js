export const resolvers = {
    Query: {
        frontPage: () => [
            { name: 'orange', count: 10 },
            { name: 'apple', count: 1 },
        ],
    },
}