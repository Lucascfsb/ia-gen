import { Type } from "@google/genai";
import { produtosEmEstoque, produtosEmFalta } from "./database";

export const produtosEmEstoqueFunctionDeclaration = {
  name: "produtosEmEstoque",
  description: "Retorna os produtos disponíveis em estoque.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
  function: () => {
    return produtosEmEstoque().map((produto) => produto.nome);
  },
};

export const produtosEmFaltaFunctionDeclaration = {
  name: "produtosEmFalta",
  description: "Retorna os produtos que estão em falta no estoque.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
  function: () => {
    return produtosEmFalta().map((produto) => produto.nome);
  },
};