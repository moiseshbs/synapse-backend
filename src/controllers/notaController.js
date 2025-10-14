import { Nota } from "../models/notaModel.js";
import { analisarNota } from "../services/geminiService.js";

export const notaController = {
    listarNotas: async (req, res) => {
        try {
            const notas = await Nota.listar();
            res.json(notas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    listarNotaPorId: async (req, res) => {
        const { id } = req.params;

        try {
            const nota = await Nota.listarPorId(id);
            if (nota) {
                res.json(nota);
            } else {
                res.status(404).json({ error: error.message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    criarNota: async (req, res) => {
        const { conteudo } = req.body;
        try {
            const { titulo: tituloGerado, categorias, tags } = await analisarNota(conteudo);

            const novaNota = await Nota.criar(tituloGerado, conteudo, categorias, tags);

            res.status(201).json(novaNota);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    atualizarNota: async (req, res) => {
        const { id } = req.params;
        const { titulo, conteudo } = req.body;
        try {
            const notaAtualizada = await Nota.atualizar(id, titulo, conteudo);
            res.json(notaAtualizada);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deletarNota: async (req, res) => {
        const { id } = req.params;
        try {
            await Nota.deletar(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};