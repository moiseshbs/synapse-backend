import { Nota } from "../models/notaModel.js";

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
                res.status(404).json({ error: "Nota não encontrada" });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao listar nota" });
        }
    },

    criarNota: async (req, res) => {
        const { titulo, conteudo } = req.body;
        try {
            const novaNota = await Nota.criar(titulo, conteudo);
            res.status(201).json(novaNota);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar nota" });
        }
    },

    atualizarNota: async (req, res) => {
        const { id } = req.params;
        const { titulo, conteudo } = req.body;
        try {
            const notaAtualizada = await Nota.atualizar(id, titulo, conteudo);
            res.json(notaAtualizada);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar nota" });
        }
    },

    deletarNota: async (req, res) => {
        const { id } = req.params;
        try {
            await Nota.deletar(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar nota" });
        }
    }
};