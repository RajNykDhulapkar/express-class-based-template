export default {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
    },
    apis: [
        "src/modules/**/*.route.ts",
        "src/modules/**/*.schema.ts",
        "src/utils/server.ts",
        "src/modules/**/__docs__/*.doc.yaml",
        "src/utils/docs/*.doc.yaml",
    ],
};
