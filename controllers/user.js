// Import required models and modules
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Login function to handle user login
exports.login = async (req, res) => {
    try {
        // Find the user with the provided email
        const user = await User.findOne({ email: req.body.email });

        // If user is not found, render the login view with an error message
        if (!user) {
            res.render('login', { errors: { email: { message: 'Email not found' } } });
            return;
        }

        // Compare the provided password with the stored password using bcrypt
        const match = await bcrypt.compare(req.body.password, user.password);

        // If the passwords match, set the user ID in the session and redirect to the homepage
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/');
            return;
        }

        // If the passwords do not match, render the login view with an error message
        res.render('login', { errors: { password: { message: 'Password does not match' } } });
    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

// Create function to handle user registration
exports.create = async (req, res) => {
    try {
        // Create a new User instance with the provided email and password
        const user = new User({ email: req.body.email, password: req.body.password });

        // Save the user to the database
        await user.save();

        // Redirect to the homepage with a success message
        res.redirect('/?message=Registration Successful.');
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('register', { errors: e.errors });
            return;
        }
        return res.status(400).send({
            messageSuccess: JSON.parse(e),
        });
    }
}
