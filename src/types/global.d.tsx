// global.d.tsx

declare global {
  // Declare a variable for the MongoDB client promise
  var _mongoClientPromise: Promise<any> | undefined;
}

// This line ensures that TypeScript treats this file as a module.
export {};
