const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const validator = require('validator');

// Verify endpoint
router.post('/verify', async (req, res) => {
    try {
        if (!req.body) {
            throw new Error('No request body provided');
        }

        const { email, message, subject, team_name, Nodal_Officer, password, phone_number, contact_number } = req.body;
        
        // Check if email is valid
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Check if the email already exists in Firebase Authentication
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            // If we get here, the email exists
            return res.status(409).json({ message: 'Email already registered in authentication system' });
        } catch (error) {
            // If error.code === 'auth/user-not-found', the email doesn't exist
            if (error.code !== 'auth/user-not-found') {
                throw error; // Re-throw if it's a different error
            }
            // If we get here, the email doesn't exist in Authentication, proceed
        }

        const db = admin.firestore();
        
        // Store the email and other details in the Clubs collection
        await db.collection('Clubs').doc(email).set({
            email,
            message,
            subject,
            team_name,
            Nodal_Officer,
            password,
            phone_number,
            contact_number,
            status: 'pending'
        });

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Error in verification process:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;