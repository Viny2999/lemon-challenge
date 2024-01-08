# Lemon Challenge

## Instructions to Run Locally
There are two ways to run the application:
* Using Docker Compose:
  ```
  docker-compose up
  ``` 
* Using NPM:
  ```
  npm install
  npm run build & npm start
  ``` 

## Tests
To start jest unit tests run:
```
npm test
```

## Live Deployment
Using Github Action and Fly.io this application is currently live and accessible at [https://lemon-challenge.fly.dev/](https://lemon-challenge.fly.dev/).

### Health Check
To test the health check, perform a GET request to [https://lemon-challenge.fly.dev/v1/health](https://lemon-challenge.fly.dev/v1/health).

### Eligibility Check
To test the eligibility, perform a POST request to [https://lemon-challenge.fly.dev/v1/eligibility](https://lemon-challenge.fly.dev/v1/eligibility).
