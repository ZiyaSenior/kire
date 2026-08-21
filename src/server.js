const app = require('./app');

class Server {
  constructor(app, port) {
    this.app = app;
    this.port = port;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Kire API server running on http://localhost:${this.port}`);
      console.log(`Swagger docs: http://localhost:${this.port}/api-docs`);
    });
  }
}

new Server(app, process.env.PORT || 5000).start();
