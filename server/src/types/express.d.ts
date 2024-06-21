export {}; // https://stackoverflow.com/a/59499895

declare global {
  namespace Express {
    interface Request {
      currentUser: { id: string };
    }
  }
}
