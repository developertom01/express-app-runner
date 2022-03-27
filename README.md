# Express worker manager

Node js runtime is the same as the v8 chrome engine which uses the event loop technique. 
This means a node js application uses 1 core of your cpu for an instance.

Nodejs gives a lot of APIs that allows us to manage processes in order to prevent programs from blocking when CPU intensive tasks are running.


This package allows you to spin up multiple instances of your express application on host machine based on the number of CPU cores the host has. This improves the performance of your application.

### Example 

The code below shows a simple example on how to run your app with express worker manager express-worker-manager.

``` js
import express from "express";
import AppRunner from "express-worker-manager";

const app = express();

app.get("/hello", (_, res) =>
  res.send(`Hello response from app running in process ${process.pid}`)
);

const runner = new AppRunner(app, { env: "production",port:4000});
runner.listen(() => {
  console.log("App running");
});


```

app  -- Express app instance
env -- production, test or development.
When env is set to production or test, app runs in just one single process just as express would have. When env is set to production app runs on spawned process equal to the number od CPU cores available.

## Run example
 #### Prerequisite
 - Nodejs version 14 or 16

#### Run
```sh
$ cd example
$ yarn install
$ yarn link express-worker-manager
$ yarn start

```

### Issues with node 15