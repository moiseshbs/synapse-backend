import { Router } from "express";
import { notaController } from "../controllers/notaController.js";

const router = Router();

router.get("/", notaController.listarNotas);
router.get("/:id", notaController.listarNotaPorId);
router.post("/", notaController.criarNota);
router.put("/:id", notaController.atualizarNota);
router.delete("/:id", notaController.deletarNota);

export default router;