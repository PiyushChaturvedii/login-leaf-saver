
/**
 * MongoDB Configuration
 * 
 * This configuration file sets up the MongoDB connection settings.
 * The MongoDB URI can be provided as an environment variable or can be set directly here.
 */

export const mongoConfig = {
  // MongoDB connection URI - can be customized by setting the VITE_MONGODB_URI environment variable
  uri: import.meta.env.VITE_MONGODB_URI || "mongodb+srv://piyush1chatur:FUIKmUSspZjT7iBW@cluster0.bmyydmt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", 
  
  // For frontend apps, we'd use an API endpoint instead of direct MongoDB connection
  apiUrl: import.meta.env.VITE_API_URL || "https://api.yourbackend.com",
  
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
