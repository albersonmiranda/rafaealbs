const { Client, fql, FaunaError } = require('fauna'); // Importando o pacote fauna
const dotenv = require('dotenv'); // Para carregar variáveis de ambiente

dotenv.config(); // Carregando variáveis de ambiente

// Criando um cliente do FaunaDB
const client = new Client({
  secret: process.env.FAUNA_SECRET, // Usando sua chave secreta
});

async function populateGifts() {
  const gifts = [
    {
      name: 'Lava Louças',
      description: 'Lava Louças para o Alberson parar de sofrer',
      price: 2899,
      imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT0cjDpJhRcF4ckBu7ifEWQmAcrp4PAEJDkBPirt3gzJ1qsTmVbrIY67o7iVZMQFZWcgoAcmQIkU-5XVidJbeMoxN6doLDM5Mq0Wh0KUAwQvTGJDKNZATybFVhQ_r5OVGUQrHXIb78&usqp=CAc',
      status: false,
    },
    {
      name: 'Adega',
      description: 'Adega pra gente te convidar pra tomar um vinho',
      price: 587.19,
      imageUrl: 'https://lh3.googleusercontent.com/T3zVFkNodUQAIGuzfJgDLZnD7UsU0SNaSFcAkhiZ0ywVGG_PJTU7G_ksB2jcTd1WUusrKNTGc9DvhJWmf7L5ylZvBKC_95aXEUtZfXFYm-PG=s0',
      status: false,
    },
    {
      name: 'Aparelho de Jantar - 30 peças',
      description: 'Tem que repor porque o alberson quebra tudo lavando',
      price: 331.19,
      imageUrl: 'https://lh3.googleusercontent.com/LosAZ6DuzCNoGFgUXrOml3roRR-o4ladIIeSYiQk_xQe1ioiMC14alUY7LGVciFYTVmNtQL7kDUJxZLenBYV_XK0yobosSRUpJkIsKjIR4tK=s0',
      status: false
    },
  ];

  try {
    // Truncando tabela e reconstruindo a lista de presentes
    await client.query(fql`Collection.byName("gifts")!.delete()`);
    console.log('Tabela de presentes truncada.');

    // Criando tabela "gifts"
    await client.query(fql`Collection.create({ name: "gifts" })`);
    console.log('Tabela de presentes criada.');

    // Iterando sobre os presentes para inserção
    for (const gift of gifts) {
      const documentQuery = fql`
        gifts.create({
          name: ${gift.name},
          description: ${gift.description},
          price: ${gift.price},
          imageUrl: ${gift.imageUrl},
          status: ${gift.status}
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

populateGifts();
