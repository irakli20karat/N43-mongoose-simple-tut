/* 
    Mongoose is a MongoDB object modeling tool 
    designed to work in an asynchronous environment.
*/

// ----------------------------------------------
// Before we start, make sure you have MongoDB installed and running on your machine.
// Then install Mongoose in your project using npm:
// npm install mongoose
// ----------------------------------------------

// ----------------------------------------------
// 1. Connect to MongoDB
// At first, we need to connect to the MongoDB database using Mongoose.
const mongoose = require('mongoose'); // Import Mongoose library
// Now we will create a function to connect to the database.
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:11111/your_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB'); // Connection successful
    } catch (err) {
        console.error('Connection error:', err); // Connection failed
        process.exit(1);
    }
}
// ----------------------------------------------

// ----------------------------------------------
// 2. Defining a schema
// Schema defines the structure of the documents in a MongoDB collection.
// We will create a User schema with fields: username, age, email, and createdAt.
const userSchema = new mongoose.Schema({ // Define a new schema
    username: { // Field name
        type: String, // Data type
        required: true, // Validation: required
        unique: true, // Validation: unique
        minlength: 3 // Validation: minimum length
    },
    age: { // Field name
        type: Number, // Data type
        min: 0 // Validation: minimum value
    },
    email: { // Field name
        type: String, // Data type
        required: true // Validation: required
    },
    createdAt: { // Field name
        type: Date, // Data type
        default: Date.now // Default value: current date
    }
});
// ----------------------------------------------

// ----------------------------------------------
// 3. Creating a model
// A model is a compiled version of the schema and provides an interface to interact with the database.
// In simple words: We will create a User object based on the userSchema.
const User = mongoose.model('User', userSchema);
// ----------------------------------------------

// ----------------------------------------------
// 4. (CRUD) Create, Read, Update, Delete operations
// Now we will create functions to perform CRUD operations on the User model.
// CREATE
async function createUser() {
    // Create a new user instance
    const user = new User({
        username: 'test_user',
        age: 18,
        email: 'test@example.com'
    });

    await user.save(); // Save the user to the database
    console.log('User created:', user);
}

// READ
async function getUsers() {
    // Find all users in the database
    const users = await User.find();
    console.log('All users:', users);
}

// READ with filter
async function findUserByName(name) {
    // Find a specific user by username
    const user = await User.findOne({ username: name });
    console.log('Found user:', user);
}

// UPDATE
async function updateUser(name) {
    // findOneAndUpdate(filter, update, options)
    const updated = await User.findOneAndUpdate(
        { username: name }, // Filtering (condition)
        { age: 25 }, // Update operation
        { new: true } // Option to return the updated document
    );
    console.log('Updated user:', updated);
}

// DELETE
async function deleteUser(name) {
    const result = await User.deleteOne({ username: name });
    console.log('Delete result:', result);
}
// ----------------------------------------------

// ----------------------------------------------
// 5. Querying with Mongoose
// Mongoose provides powerful querying capabilities. You can chain methods to filter, sort, limit, and select fields.
async function queryExamples() {
    const users = await User
        .find({ age: { $gte: 18 } }) // filter: age greater than or equal to 18
        .sort({ age: -1 }) // sort by age in descending order
        .limit(5) // limit results to 5 documents
        .select('username age'); // select only username and age fields

    console.log('Query results:', users);
}
// ----------------------------------------------

// ----------------------------------------------
// 6. Testing the functions
// Finally, we will run the functions in sequence to demonstrate the CRUD operations and querying.
async function run() {
    await connectDB(); // Connect to the database

    await createUser(); // Create a new user
    await getUsers(); // Get all users
    await findUserByName('test_user'); // Find a user by name
    await updateUser('test_user'); // Update a user
    await queryExamples(); // Run query examples
    await deleteUser('test_user'); // Delete a user

    await mongoose.connection.close(); // Close the database connection !!
    console.log('Connection closed');
}

run();
// ----------------------------------------------