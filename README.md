# Course Connect Project

## Introduction

Welcome to the Course Connect Project! This project serves as a foundation for building database-driven application. It provides a basic setup with essential features to help you get started quickly.

## Getting Started

1. Clone this repository:

git clone <https://github.com/asen0v/courseconnect>


2. Install the dependencies:

npm install


3. Rename `.env.example` to `.env`.

4. Database Configuration:

- If you are using [Atlas](https://www.mongodb.com/cloud/atlas) to host your database, update the `MONGODB_URI` in the `.env` file. Append `/courses` to your connection URL. Example:

  ```
  MONGODB_URI=mongodb+srv://test:<password>@cluster0.x08wt.mongodb.net/courses?retryWrites=true&w=majority
  ```

- If you are using a different database provider or hosting locally, update the appropriate configuration in the `.env` file.

5. Initial Data Setup:

- If this is your first time getting started, run the seeder to populate the database with initial data:

  ```
  node seeder
  ```

- Modify the seeder file (`seeder.js`) to add or customize the initial data according to your project's requirements.

6. Run the project in development mode:

npm run dev


## Project Structure

The project follows a standard structure with the following directories and files:

- `controllers/`: Contains the application logic, handling requests and responses.
- `models/`: Defines the database models and schemas.
- `api/`: Defines the API routes and their associated controller methods.
- `views/`: Contains the EJS files for visualizing the data and rendering HTML templates.
- Customize the views by adding or modifying the EJS files in this directory. These files define the structure and presentation of the HTML pages rendered by the application.
- `seeder.js`: Seeder script to populate the database with initial data.

Feel free to modify the project structure based on your needs and add additional directories or files as your project grows.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.


