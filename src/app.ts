import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import express from "express";
import z from "zod";

const app = express();
dotenv.config();

const apiKey = process.env.GEMINI_AI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_AI_API_KEY não está definida no arquivo .env');
}

const client = new GoogleGenAI({
  apiKey: apiKey
});


app.use(express.json());

app.post("/generate", async(req, res) => {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        text: "Instruções: Liste três produtos que atendam a necessidade do usuário. Responda em JSON no formato { produtos: string[] }" + req.body.prompt,
      }],
      config: {
        responseMimeType: "application/json"
      }
    });
    const output = JSON.parse(response.text || "");
    console.log(output);

    const schema = z.object({
      produtos: z.array(z.string())
    });

    const result = schema.safeParse(output);
    
    if (!result.success) {
      return res.status(500).json({ error: "Formato de resposta inválido" });
    }

    res.json(output);
  }
);

export {app};