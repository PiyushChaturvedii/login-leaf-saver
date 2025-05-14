
/**
 * MongoDB Configuration
 * 
 * Note: In a real application, these values should be loaded from environment variables
 * and the actual MongoDB connection should be established on the backend server.
 * 
 * This is just a placeholder for demonstration purposes.
 */

export const mongoConfig = {
  // In a real application with a backend server, the URI would be used server-side
  uri: "mongodb+srv://your_mongodb_uri_here", 
  
  // For frontend apps, we'd use an API endpoint instead of direct MongoDB connection
  apiUrl: "https://api.yourbackend.com",
  
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};

// Sample schema definitions that would be used on a backend server
// These are just for reference and don't actually connect to MongoDB in the frontend
export const schemaDefinitions = {
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'instructor', 'student', 'sales', 'accounting'], required: true },
    password: { type: String, required: true },
    profileCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  
  attendance: {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
    code: { type: String },
    submissionTime: { type: Date },
  },
  
  payment: {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], required: true },
    description: { type: String },
  },
  
  project: {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: String },
    dueDate: { type: Date },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed', 'delayed'] },
  }
};
