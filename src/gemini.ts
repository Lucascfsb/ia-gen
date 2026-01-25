import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI, FunctionCallingConfigMode } from "@google/genai";
import z from "zod";
import {
  produtosEmEstoqueFunctionDeclaration,
  produtosEmFaltaFunctionDeclaration,
} from "./functions";

const schema = z.object({
  produtos: z.array(z.string()),
});

const apiKey = process.env.GEMINI_AI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_AI_API_KEY não está definida no arquivo .env");
}

const client = new GoogleGenAI({
  apiKey: apiKey,
});

// const handleFunctionCall = (name: string) => {
//   if (name === "produtosEmFalta") {
//     const produtos = produtosEmFaltaFunctionDeclaration.function();
//     console.log("[LOG] Resultado da função 'produtosEmFalta':", produtos);
//     return { produtos };
//   } else if (name === "produtosEmEstoque") {
//     const produtos = produtosEmEstoqueFunctionDeclaration.function();
//     console.log("[LOG] Resultado da função 'produtosEmEstoque':", produtos);
//     return { produtos };
//   } else {
//     console.error(`[LOG] Função desconhecida chamada: ${name}`);
//     throw new Error(`Função desconhecida chamada: ${name}`);
//   }
// };

export const generataProducts = async (message: string) => {
  const messagePrompt = {
    text: `Instruções: Liste os produtos que atendam a necessidade do usuário. Considere apenas os produtos disponíveis em estoque. ${message}`,
  };

  console.log("[LOG] Enviando mensagem para o modelo:", messagePrompt);

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [messagePrompt],
    config: {
      tools: [
        {
          functionDeclarations: [
            produtosEmEstoqueFunctionDeclaration,
            produtosEmFaltaFunctionDeclaration,
          ],
        },
      ],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
        },
      },
    },
  });

  console.log("[LOG] Resposta da API recebida:", response);

  // if (response.functionCalls && response.functionCalls.length > 0) {
  //   console.log("[LOG] Chamadas de função detectadas na resposta:", response.functionCalls);

  //   for (const call of response.functionCalls) {
  //     if (!call.name) {
  //       console.error("[LOG] A chamada de função não possui um nome válido.");
  //       throw new Error("A chamada de função não possui um nome válido.");
  //     }

  //     console.log(`[LOG] Função chamada: ${call.name}, Argumentos: ${JSON.stringify(call.args)}`);
  //     return handleFunctionCall(call.name);
  //   }
  // } else {
  //   console.log("[LOG] Nenhuma chamada de função detectada na resposta.");
  //   throw new Error("Nenhuma função foi chamada pela API.");
  // }
    if (response.candidates && response.candidates.length > 0) {
    const content = response.candidates[0].content;
    console.log("[LOG] Conteúdo gerado pelo modelo:", content);

    // Retornar o conteúdo gerado
    return content;
  } else {
    console.error("[LOG] Nenhuma resposta válida foi gerada pelo modelo.");
    throw new Error("Nenhuma resposta válida foi gerada pelo modelo.");
  }
};