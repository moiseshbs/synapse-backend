import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function analisarNota(conteudo) {
    const prompt = `
        Você é um assistente inteligente de organização de anotações pessoais chamado Synapse.

        Dado o texto de uma anotação, sua tarefa é:
        1. Analisar o conteúdo e gerar um **título curto e descritivo** (5 a 10 palavras).
        2. Identificar de 1 a 3 **categorias gerais** (ex: Programação, Trabalho, Estudos, Pessoal, Saúde, Finanças, Ideias, etc.).
        3. Sugerir de 3 a 5 **tags específicas** (palavras-chave) que representem bem o conteúdo.
        4. Retornar tudo em **formato JSON válido**, sem explicações adicionais.

        Texto da anotação: """${conteudo}"""

        Responda APENAS com um JSON estruturado assim:

        {
        "titulo": "string",
        "categorias": ["string"],
        "tags": ["string"]
        }
    `;

    try {
        console.log("Analisando nota com Gemini 2.5 Flash...");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
        console.log("Resposta da IA:", text);
        const cleanText = text.trim().replace(/```json\n?|\n?```/g, '');
        const resultado = JSON.parse(cleanText);

        console.log("Análise concluída:", resultado);
        return resultado;
    } catch (error) {
        console.error("Erro ao analisar nota:", error);
        console.error("Response text:", error.response?.text || 'N/A');

        // Fallback: se a IA falhar, retorna categoria baseada em palavras-chave simples
        const categoria = inferirCategoria(conteudo);
        const tags = extrairTagsSimples(conteudo);

        return { categoria, tags };
    }
}

function inferirCategoria(conteudo) {
    const texto = conteudo.toLowerCase();

    if (texto.includes('programação') || texto.includes('código') || texto.includes('javascript') || texto.includes('python')) {
        return 'programação';
    }
    if (texto.includes('trabalho') || texto.includes('reunião') || texto.includes('projeto')) {
        return 'trabalho';
    }
    if (texto.includes('estudo') || texto.includes('aprender') || texto.includes('curso')) {
        return 'estudo';
    }
    if (texto.includes('pessoal') || texto.includes('família') || texto.includes('casa')) {
        return 'pessoal';
    }

    return 'geral';
}

function extrairTagsSimples(conteudo) {
    const palavrasChave = [
        'javascript', 'python', 'node', 'react', 'api', 'database',
        'trabalho', 'reunião', 'projeto', 'cliente',
        'estudo', 'curso', 'aprender', 'livro',
        'pessoal', 'família', 'casa', 'viagem'
    ];

    const texto = conteudo.toLowerCase();
    const tags = palavrasChave.filter(palavra => texto.includes(palavra));

    return tags.slice(0, 5);
}