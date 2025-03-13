const express = require('express');
const admin = require('firebase-admin');
const validator = require('validator');
const router = express.Router();

// Create a new user
router.post('/create-user', async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    const role = "admin"
    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password format (e.g., at least 6 characters)
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    try {
        // Create the user using the Firebase Admin SDK
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password
        });

        // Assign custom claims to the user
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

        // Create a document in Firestore for the user
        const db = admin.firestore();
        await db.collection('users').doc(userRecord.uid).set({
            email: email,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Return success response
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        // Return error response
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/accept', async (req, res) => {
    try {
        if (!req.body) {
            throw new Error('No request body provided');
        }

        const { email, password, role } = req.body;
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Assign role (if necessary)
        if (role) {
            await admin.auth().setCustomUserClaims(userRecord.uid, { role });
        }
        const db = admin.firestore();
        await db.collection('Clubs').doc(email).update({
            status: 'verified'
        });
        res.status(201).send('User registered successfully.');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});
