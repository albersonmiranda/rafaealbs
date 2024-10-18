require('dotenv').config(); // Carregar variáveis de ambiente

const { Client, fql, FaunaError } = require('fauna'); // Importando o pacote fauna

const client = new Client({
  secret: process.env.FAUNA_SECRET, // Usando sua chave secreta
});

exports.handler = async (event, context) => {
  try {
    // Consulta para obter todos os documentos da coleção 'gifts'
    const query = fql`gifts.all()`;

    const result = await client.query(query);

    console.log('Resultado da consulta:', result); // Logando o resultado

    // Verificando se a resposta contém a propriedade 'data'
    if (!result || !result.data || !Array.isArray(result.data.data)) {
      console.error('Resposta inesperada: resultado não contém um array', result);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Resposta inesperada' }),
      };
    }

    // Extraindo os documentos da propriedade data
    const documents = result.data.data.flat(); // Usando flat() para garantir que é um array

    // Mapeando os documentos para o formato desejado
    const gifts = documents.map(item => {
      // Verificando se o item contém as propriedades diretamente
      if (!item || typeof item.name === 'undefined') {
        console.warn('Item não possui dados:', item); // Logando itens sem dados
        return null; // Retornando null para itens inválidos
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
    }).filter(Boolean); // Removendo itens nulos

    return {
      statusCode: 200,
      body: JSON.stringify(gifts), // Result já está formatado
    };
  } catch (error) {
    console.error('Erro ao buscar presentes:', error); // Logando o erro
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
