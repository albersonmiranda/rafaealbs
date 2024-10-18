const { Client, fql, FaunaError } = require('fauna'); // Importando o pacote fauna
const dotenv = require('dotenv'); // Para carregar variáveis de ambiente

dotenv.config(); // Carregando variáveis de ambiente

// Criando um cliente do FaunaDB
const client = new Client({
  secret: process.env.FAUNA_SECRET, // Usando sua chave secreta
});

async function populatePrendas() {
  const prendas = [
    {
      name: 'Naruto Run',
      description: 'A noiva vai correr na festa que nem o Naruto kk',
      price: 200,
      imageUrl: 'assets/img/naruto.jpg',
      status: false,
    },
    // Adicione mais itens conforme necessário
  ];

  try {
    // Iterando sobre os presentes para inserção
    for (const prenda of prendas) {
      // Construindo a consulta para criar um novo presente
      const documentQuery = fql`
        prendas.create({
          name: ${prenda.name},
          description: ${prenda.description},
          price: ${prenda.price},
          imageUrl: ${prenda.imageUrl},
          status: ${prenda.status}
        }) {
          id,
          ts,
          name,
          description,
          price,
          imageUrl,
          status
        }
      `;

      // Executando a consulta
      const response = await client.query(documentQuery);
      console.log('Item adicionado:', response);
    }
    console.log('Todos os itens foram adicionados ao FaunaDB.');
  } catch (error) {
    if (error instanceof FaunaError) {
      console.log('Erro ao adicionar itens:', error);
    } else {
      console.log('Erro desconhecido:', error);
    }
  } finally {
    // Fechar o cliente após a operação
    client.close();
  }
}

populatePrendas();
