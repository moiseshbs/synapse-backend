import db from "../config/db.js";

export const Nota = {
    listar: async () => {
        const [rows] = await db.query("SELECT * FROM nota ORDER BY data_atualizacao DESC");
        return rows;
    },

    listarPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM nota WHERE id = ?", [id]);
        return rows[0];
    },

    criar: async (titulo, conteudo) => {
        const [result] = await db.query(
            "INSERT INTO nota (titulo, conteudo) VALUES (?, ?)",
            [titulo, conteudo]
        );
        return { id: result.insertId, titulo, conteudo };
    },

    atualizar: async (id, titulo, conteudo) => {
        await db.query(
            "UPDATE nota SET titulo = ?, conteudo = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?",
            [titulo, conteudo, id]
        );
        return { id, titulo, conteudo };
    },

    deletar: async (id) => {
        await db.query("DELETE FROM nota WHERE id = ?", [id]);
    }
};