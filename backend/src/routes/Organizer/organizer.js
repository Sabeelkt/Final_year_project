const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./secret.json");

// Initialize Firebase Admin
initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "final-year-project-bc800.appspot.com",
});

const db = getFirestore();
const storage = getStorage().bucket();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Create Event Endpoint
app.post("/api/events", upload.single("poster"), async (req, res) => {
  try {
    const { name, date, time, venue, description, participantLimit } = req.body;
    let posterURL = "";

    // Upload poster if provided
    if (req.file) {
      const file = req.file;
      const fileName = `eventPosters/${Date.now()}_${file.originalname}`;
      const fileUpload = storage.file(fileName);
      
      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      posterURL = await fileUpload.getSignedUrl({ action: "read", expires: "03-01-2030" });
    }

    // Save event to Firestore
    await db.collection("events").add({
      name,
      date,
      time,
      venue,
      description,
      participantLimit: parseInt(participantLimit, 10) || null,
      posterURL,
    });

    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
