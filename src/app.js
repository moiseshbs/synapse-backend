import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notaRoutes from "./routes/notaRoutes.js";
import "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notes", notaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Synapse API rodando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
