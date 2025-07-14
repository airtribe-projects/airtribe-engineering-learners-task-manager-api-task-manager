const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ Allow CORS (cross-origin access)
app.use(express.json()); // ✅ Parse JSON bodies

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


