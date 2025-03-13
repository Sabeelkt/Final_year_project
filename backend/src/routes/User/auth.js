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

        const { email, message, subject, team_name, Nodal_Officer, password , phone_number , contact_number} = req.body;

        const db = admin.firestore();
        // Store the email and verification code in the NewAccountReq collection
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
        console.error('Error sending verification email:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;