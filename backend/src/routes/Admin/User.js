const express = require('express');
const admin = require('firebase-admin');
const validator = require('validator');
const router = express.Router();

// Add this new route handler for verify endpoint
router.post('/verify', async (req, res) => {
    try {
        const { email, message, team_name, password, Nodal_Officer, phone_number, contact_number, status } = req.body;
        
        // Validate required fields
        if (!email || !team_name || !password || !Nodal_Officer || !phone_number) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        
        // Validate password
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        // Store the request in Firebase
        const db = admin.firestore();
        await db.collection('Clubs').doc(email).set({
            email,
            team_name,
            Nodal_Officer,
            phone_number,
            contact_number: contact_number || '',
            message,
            status: status || 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(200).json({ message: 'Account request submitted successfully' });
    } catch (error) {
        console.error('Error processing verification request:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new user
router.post('/create-user', async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    const role = "student"
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
        res.status(500).json({ message: error.message });
    }
});

// Create a new student user
router.post("/createStudent", async (req, res) => {
  const { name, email, admissionNo, rollNo, department, section, joinedYear, active } = req.body;

  // Check for missing fields
  if (!name || !email || !admissionNo || !rollNo || !department || !section || !joinedYear || !active) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const role = "student";

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password format
  if (admissionNo.length < 6) {
    return res.status(400).json({ message: "Admission number must be at least 6 characters long" });
  }

  try {
    const auth = admin.auth();
    const db = admin.firestore();

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: admissionNo, // Using admission number as password
    });

    // Assign custom claims (role)
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Store the user data in Firestore using admissionNo as the document ID
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid, // Store Firebase Auth UID
      email: email,
      name: name,
      admissionNo: admissionNo, // Doc ID is the same as admissionNo
      rollNo: rollNo,
      department: department,
      section: section,
      joinedYear: joinedYear,
      role: role,
      active: active,
      attendedEvents: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/accept', async (req, res) => {
    try {
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
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;