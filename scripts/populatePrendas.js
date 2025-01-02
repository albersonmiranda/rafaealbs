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
      description: 'A noiva vai correr na festa que nem o Naruto kkk',
      price: 350,
      imageUrl: 'assets/img/naruto.jpg',
      status: true,
    },
    {
      name: 'Tequila',
      description: 'O noivo vai virar uma dose de tequila',
      price: 250,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRBz1_XcpBWu9vkPz13yYONDlNLXqx1VBM572jTXSOflyNVF8RJjWduYG1e56sfXVljkJXL50ukhdTWqZ_7S2e47Cy7chHwDr0348VyhMR5k9jfobUrvRjj388nxm0IU4HHXpVSQHQ&usqp=CAc',
      status: false,
    },
    {
      name: 'Pitty',
      description: 'A noiva vai subir no palco e cantar Pitty (socorro)',
      price: 500,
      imageUrl: 'https://www.grupopetropolis.com.br/grpptrpls/wp-content/uploads/pitty-TNT-parceria03.jpg',
      status: false,
    },
    {
      name: 'Imortal',
      description: 'O noivo vai subir no palco e cantar Sandy & Junior (???)',
      price: 500,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Sandy_Leah_Lima_e_Durval_de_Lima_J%C3%BAnior.jpg',
      status: false
    },
    {
      name: 'Bananinha',
      description: 'A noiva vai virar uma dose de bananinha',
      price: 250,
      imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRn7O58MXgySne7BZyaDbf9hOghN58dCcyc7XqgqRoUZiwGfx0yOhvZlIJRg9MRTU1qwHStkYWVZ6Exbo4IdOGnXyt6C5yJZL5BaluZ221v_Gg_HAGVE43yqojzJDz25l1ekdwEAZP77i0&usqp=CAc',
      status: false,
    },
    {
      name: 'nsync',
      description: 'O noivo vai subir no palco dançar NSYNC (pfvr n compre)',
      price: 500,
      imageUrl: 'https://ew.com/thmb/mdTtLghMg2K2PDMzP-Kg1L5jkOc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/nsync-121323-225d27ef451c496da433e40d310f3664.jpg',
      status: true,
    }
  ];

  try {
    // Truncando tabela e reconstruindo a lista de prendas
    await client.query(fql`Collection.byName("prendas")!.delete()`);
    console.log('Tabela de prendas truncada.');

    // Criando tabela "prendas"
    await client.query(fql`Collection.create({ name: "prendas" })`);
    console.log('Tabela de prendas criada.');

    // Iterando sobre os prendas para inserção
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
