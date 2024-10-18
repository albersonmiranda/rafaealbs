require('dotenv').config(); // Carregar variáveis de ambiente

const { Client, fql, FaunaError } = require('fauna'); // Importando o pacote fauna

const client = new Client({
  secret: process.env.FAUNA_SECRET, // Usando sua chave secreta
});

exports.handler = async (event, context) => {
  const { id, status, collection } = JSON.parse(event.body); // Extraindo id, status e coleção do corpo da requisição

  // Verificando se o ID, coleção e status foram fornecidos
  if (!collection || !id || typeof status !== 'boolean') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Collection, ID, and valid boolean status are required' }),
    };
  }

  // Definindo a coleção correta com base no nome passado
  let collectionQuery;
  if (collection === 'gifts') {
    collectionQuery = fql`gifts.firstWhere(.id == ${id})?.update({ status: ${status} })`;
  } else if (collection === 'prendas') {
    collectionQuery = fql`prendas.firstWhere(.id == ${id})?.update({ status: ${status} })`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid collection name' }),
    };
  }

  try {
    // Executando a consulta para a coleção selecionada
    const result = await client.query(collectionQuery);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `${collection} status updated`, data: result }),
    };
  } catch (error) {
    // Tratamento de erros de FaunaDB
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
