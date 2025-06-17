import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';
import listRoutes from './routes/list.routes';
import itemRoutes from './routes/item.routes';


import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status'; //importing status codes from utils folder

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet()); //hides information for security
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json()); // convert text to json
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/lists', listRoutes);
app.use('/api/lists/:listId/items', itemRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {                   //get the base route 
  res.status(OK).json({ message: "List & Items API - Welcome!" }) //if the status was OK (200) display this message "List & Items API - Welcome!"
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res
    .status(INTERNAL_SERVER_ERROR) //if the status was 500 (Server error) display this json:
    .json({
      success: false,
      message: "Something went wrong!",
      error: dev ? err.message : undefined,
    })
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
