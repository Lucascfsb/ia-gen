import express from 'express';
import { embedProducts, generateCart, generateEmbedding, generateProducts } from "./openai";
import { produtosSimilares, todosProdutos } from "./database";

const app = express();

app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const products = await generateProducts(req.body.message);
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/cart', async (req, res) => {
  const {message} = req.body;
  const embedding = await generateEmbedding(message);
  if (!embedding) {
    return res.status(500).json({ error: 'Failed to generate embedding' });
  }
  const produtos = produtosSimilares(embedding)

  res.json({ produtos: produtos.map(p => ({ nome: p.nome, similaridade: p.similaridade })) });
})

app.post('/embeddings', async (req, res) => {
  await embedProducts();
  console.log(todosProdutos());
  res.status(201).end();
});

app.post('/embedding', async (req, res) => {
  const { input } = req.body;
  await generateEmbedding(input);
  res.status(201).end();
});

app.post('/response', async (req, res) => {
  const {input} = req.body;

  const cart = await generateCart(input, ['feijão', 'detergente']);

  res.json(cart);
})

export { app };