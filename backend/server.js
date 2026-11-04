
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Helper: Get today's date at midnight
function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Medicine Schema
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  expiry: { type: Date, required: true }
}, { timestamps: true });

const Medicine = mongoose.model("Medicine", medicineSchema);

// Sale Schema
const saleSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },
  medicineName: String,
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model("Sale", saleSchema);

// Home API
app.get("/", (req, res) => {
  res.json({
    message: "Pharmacy Management System API is running!",
    status: "Success"
  });
});

// Get all medicines
app.get("/api/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add medicine
app.post("/api/medicines", async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update medicine
app.put("/api/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete medicine
app.delete("/api/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all sales
app.get("/api/sales", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record a sale
app.post("/api/sales", async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;

    const quantityNumber = Number(quantity);

    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({
        message: "Invalid medicine ID"
      });
    }

    if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
      return res.status(400).json({
        message: "Invalid quantity"
      });
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    // Compare calendar dates, not the current time.
    // A medicine expiring today can still be sold today.
    const todayStart = getTodayStart();

    if (new Date(medicine.expiry) < todayStart) {
      return res.status(400).json({
        message: "Expired medicine cannot be sold"
      });
    }

    if (medicine.stock < quantityNumber) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    // Reduce medicine stock
    medicine.stock -= quantityNumber;
    await medicine.save();

    // Save sale in MongoDB
    const sale = await Sale.create({
      medicineId: medicine._id,
      medicineName: medicine.name,
      quantity: quantityNumber,
      total: medicine.price * quantityNumber
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      remainingStock: medicine.stock
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Dashboard statistics
app.get("/api/dashboard", async (req, res) => {
  try {
    const medicines = await Medicine.find();

    const todayStart = getTodayStart();

    const totalMedicines = medicines.length;

    const totalStock = medicines.reduce(
      (sum, m) => sum + m.stock, 0
    );

    const lowStock = medicines.filter(
      m => m.stock > 0 && m.stock <= 15
    ).length;

    const expired = medicines.filter(
      m => new Date(m.expiry) < todayStart
    ).length;

    const sales = await Sale.find();

    const totalSales = sales.reduce(
      (sum, s) => sum + s.total, 0
    );

    res.json({
      totalMedicines,
      totalStock,
      lowStock,
      expired,
      totalSales,
      totalTransactions: sales.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Database connection and server startup
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });
