const express = require('express');
const cors = require('cors');
const middleware = require('./src/middleware');
const admin = require('firebase-admin');
const authRoutes = require('./src/routes/User/auth');
const AdminuserRoutes = require('./src/routes/Admin/User');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!, This is a attendance app  apis application.');
}
);
app.use('/api/auth', authRoutes);
app.use('/api/admin',  AdminuserRoutes);
// ,middleware.decodeToken, middleware.checkRole('admin'),
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
