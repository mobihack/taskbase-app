import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { Server as HttpServer } from 'http';
import https, { Server as HttpsServer } from 'https';
import path from 'path';

import { app } from './app';
import { config } from './config';
import { logger } from './middleware';

type Server =
  | HttpsServer<typeof IncomingMessage, typeof ServerResponse>
  | HttpServer<typeof IncomingMessage, typeof ServerResponse>;

let server: Server;

if (process.env.NODE_ENV === 'production') {
  server = app.listen(parseInt(config.port), () => {
    logger.log('info', `Server is running on Port: ${config.port}`);
  });
} else {
  // Read the certificate and key files
  const key = fs.readFileSync(
    path.join(__dirname, '../certificates/localhost-key.pem')
  );
  const cert = fs.readFileSync(
    path.join(__dirname, '../certificates/localhost.pem')
  );

  // Create an HTTPS server
  const httpsServer = https.createServer({ key, cert }, app);

  server = httpsServer.listen(parseInt(config.port), () => {
    logger.log('info', `Server is running on Port: ${config.port}`);
  });
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing http server.');
  server.close((err) => {
    logger.info('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});
