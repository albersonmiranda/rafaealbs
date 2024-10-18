require('dotenv').config(); // Carregar variáveis de ambiente

const { Client, fql, FaunaError } = require('fauna'); // Importando o pacote fauna

const client = new Client({
  secret: process.env.FAUNA_SECRET, // Usando sua chave secreta
});

exports.handler = async (event, context) => {
  try {
    // Consulta para obter todos os documentos da coleção 'prendas'
    const query = fql`prendas.all()`;

    const result = await client.query(query);

    console.log('Resultado da consulta:', result);

    if (!result || !result.data || !Array.isArray(result.data.data)) {
      console.error('Resposta inesperada: resultado não contém um array', result);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Resposta inesperada' }),
      };
    }

    const documents = result.data.data.flat();

    const prendas = documents.map(item => {
      if (!item || typeof item.name === 'undefined') {
        console.warn('Item não possui dados:', item);
        return null;
      }

      return {
        id: item.id,
        ts: item.ts,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        status: item.status,
      };
    }).filter(Boolean);

    return {
      statusCode: 200,
      body: JSON.stringify(prendas),
    };
  } catch (error) {
    console.error('Erro ao buscar prendas:', error);
    if (error instanceof FaunaError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro desconhecido' }),
    };
  }
};
