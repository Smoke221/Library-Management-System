const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0", // Use the appropriate version (3.0.0 for Swagger 3.0)
    info: {
      title: "Library Management",
      version: "1.0.0",
      description: "Backend application where an admin can update and add details of the books, and can keep a track of books borrowed along with their return dates",
    },
    servers:[
        {
            url: "https://library-managemnet-system.onrender.com/"
        }
    ]
  },
  apis: ["./routes/**/*.js", "./controllers/**/*.js"],
  
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
