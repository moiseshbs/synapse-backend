import db from "../config/db.js";

export const Nota = {
    listar: async () => {
        const [rows] = await db.query(`
            SELECT n.*, 
                   GROUP_CONCAT(DISTINCT c.nome) as categorias,
                   GROUP_CONCAT(DISTINCT t.nome) as tags
            FROM nota n
            LEFT JOIN nota_categoria nc ON n.id = nc.nota_id
            LEFT JOIN categoria c ON nc.categoria_id = c.id
            LEFT JOIN nota_tag nt ON n.id = nt.nota_id
            LEFT JOIN tag t ON nt.tag_id = t.id
            GROUP BY n.id
            ORDER BY n.data_atualizacao DESC
        `);
        
        return rows.map(row => ({
            ...row,
            categorias: row.categorias ? row.categorias.split(',') : [],
            tags: row.tags ? row.tags.split(',') : []
        }));
    },

    listarPorId: async (id) => {
        const [rows] = await db.query(`
            SELECT n.*, 
                   GROUP_CONCAT(DISTINCT c.nome) as categorias,
                   GROUP_CONCAT(DISTINCT t.nome) as tags
            FROM nota n
            LEFT JOIN nota_categoria nc ON n.id = nc.nota_id
            LEFT JOIN categoria c ON nc.categoria_id = c.id
            LEFT JOIN nota_tag nt ON n.id = nt.nota_id
            LEFT JOIN tag t ON nt.tag_id = t.id
            WHERE n.id = ?
            GROUP BY n.id
        `, [id]);
        
        if (rows.length === 0) return null;
        
        const nota = rows[0];
        return {
            ...nota,
            categorias: nota.categorias ? nota.categorias.split(',') : [],
            tags: nota.tags ? nota.tags.split(',') : []
        };
    },

    criar: async (titulo, conteudo, categorias, tags) => {
        try {
            await db.query("START TRANSACTION");
            
            const [result] = await db.query(
                "INSERT INTO nota (titulo, conteudo) VALUES (?, ?)",
                [titulo, conteudo]
            );
            const notaId = result.insertId;
            
            if (categorias && categorias.length > 0) {
                for (const categoriaNome of categorias) {
                    await db.query(
                        "INSERT IGNORE INTO categoria (nome) VALUES (?)",
                        [categoriaNome]
                    );
                    
                    const [catRows] = await db.query(
                        "SELECT id FROM categoria WHERE nome = ?",
                        [categoriaNome]
                    );
                    
                    await db.query(
                        "INSERT INTO nota_categoria (nota_id, categoria_id) VALUES (?, ?)",
                        [notaId, catRows[0].id]
                    );
                }
            }
            
            if (tags && tags.length > 0) {
                for (const tagNome of tags) {
                    await db.query(
                        "INSERT IGNORE INTO tag (nome) VALUES (?)",
                        [tagNome]
                    );
                    
                    const [tagRows] = await db.query(
                        "SELECT id FROM tag WHERE nome = ?",
                        [tagNome]
                    );
                    
                    await db.query(
                        "INSERT INTO nota_tag (nota_id, tag_id) VALUES (?, ?)",
                        [notaId, tagRows[0].id]
                    );
                }
            }
            
            await db.query("COMMIT");
            
            return { id: notaId, titulo, conteudo, categorias, tags };
            
        } catch (error) {
            await db.query("ROLLBACK");
            throw error;
        }
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