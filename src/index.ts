import app from './app';
import {createServer} from "http";
import {initializeSocket} from "./api/socket";
import configService from "./common/config/configService";

const port = configService.getNumber('APP_PORT', 5001);
// const httpServer = createServer(app);
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});

export const websocket = initializeSocket(createServer(app));
