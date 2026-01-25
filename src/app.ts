import express from "express";
import {generataProducts} from "./gemini";

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const produtos = await generataProducts(req.body.prompt);
    res.json(produtos);
  } catch (error) {
      console.error("Erro interno:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
});

export { app };


// app.post("/generate", async (req, res) => {
//   try {
//     const response = await client.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: [
//         {
//           text: `Instruções: Liste três produtos que atendam a necessidade do usuário. ${req.body.prompt}`,
//         },
//       ],
//       config: {
//         responseMimeType: "application/json",
//       },
//     });

//     //console.log("Resposta da API:", response.text);

//     const output = JSON.parse(response.text || "[]");

//     const transformedOutput = {
//       produtos: Array.isArray(output)
//         ? output.map((item: any) => item.produto ?? item.nome ?? item)
//         : [],
//     };

//     //console.log("Resposta transformada:", transformedOutput);

//     const result = schema.safeParse(transformedOutput);

//     if (!result.success) {
//       console.error("Erro de validação do Zod:", result.error);
//       return res.status(500).json({ error: "Formato de resposta inválido", details: result.error });
//     }

//     res.json(result.data.produtos);
//   } catch (error) {
//     console.error("Erro interno:", error);
//     res.status(500).json({ error: "Erro interno do servidor" });
//   }
// });