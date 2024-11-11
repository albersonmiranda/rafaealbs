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
      price: 2899.90,
      imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT0cjDpJhRcF4ckBu7ifEWQmAcrp4PAEJDkBPirt3gzJ1qsTmVbrIY67o7iVZMQFZWcgoAcmQIkU-5XVidJbeMoxN6doLDM5Mq0Wh0KUAwQvTGJDKNZATybFVhQ_r5OVGUQrHXIb78&usqp=CAc',
      status: false,
    },
    {
      name: 'Melocoton',
      description: 'Um boneco Melocoton pra Rafaela',
      price: 349.90,
      imageUrl: 'https://photos.enjoei.com.br/boneco-melocoton-73354805/800x800/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMDUzMjc1My8zY2MwYTVmZjJiNjk5MDk0YTlkMmZkNzUyMTk3Zjk5Yy5qcGc',
      status: false
    },
    {
      name: 'Adega',
      description: 'Adega pra gente te convidar pra tomar um vinho',
      price: 587.19,
      imageUrl: 'https://lh3.googleusercontent.com/T3zVFkNodUQAIGuzfJgDLZnD7UsU0SNaSFcAkhiZ0ywVGG_PJTU7G_ksB2jcTd1WUusrKNTGc9DvhJWmf7L5ylZvBKC_95aXEUtZfXFYm-PG=s0',
      status: false,
    },
    {
      name: 'Aparelho de Jantar (30 pçs)',
      description: 'Tem que repor porque o alberson quebra tudo lavando',
      price: 331.19,
      imageUrl: 'https://lh3.googleusercontent.com/LosAZ6DuzCNoGFgUXrOml3roRR-o4ladIIeSYiQk_xQe1ioiMC14alUY7LGVciFYTVmNtQL7kDUJxZLenBYV_XK0yobosSRUpJkIsKjIR4tK=s0',
      status: false
    },
    {
      name: 'Ar condicionado',
      description: 'Ar condicionado pra visita ficar no fresquinho',
      price: 1615.76,
      imageUrl: "https://lh3.googleusercontent.com/xgQzYTFZv8e6iDjtR0858GfBgb3NXCCGHB58MH82vXwOPV1jhP1c2j3-LliXUmj1bSYgdeFjML7Cd7OsOcow0BpoIOnuH_ks3ijr2YQWIawGgQ=s0",
      status: false
    },
    {
      name: 'Cota de Lua de Mel 1',
      description: 'Ajudinha pra gente viajar e curtir a lua de mel',
      price: 300.00,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcri8XO3e8tWM5Hav64e_3WwQzeURCze2RVg&s',
      status: false,
    },
    {
      name: 'Cota de Lua de Mel 2',
      description: 'Ajudinha pra gente viajar e curtir a lua de mel',
      price: 500.00,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcri8XO3e8tWM5Hav64e_3WwQzeURCze2RVg&s',
      status: false,
    },
    {
      name: 'Cota de Lua de Mel 3',
      description: 'Ajudinha pra gente viajar e curtir a lua de mel',
      price: 500.00,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcri8XO3e8tWM5Hav64e_3WwQzeURCze2RVg&s',
      status: false,
    },
    {
      name: 'Cota de Lua de Mel 4',
      description: 'Ajudinha pra gente viajar e curtir a lua de mel',
      price: 1000.00,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcri8XO3e8tWM5Hav64e_3WwQzeURCze2RVg&s',
      status: false,
    },
    {
      name: 'Box bipartido',
      description: 'Cama grande pra caber o casal e duas cadelas',
      price: 1651.19,
      imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQJGAaDkFP4qq11TakxEo1lMg9noxRV252xNZ37ctq5WcgeyNIjcJz3ul_Sm_UY6sWTQxz8X0YiCDLnH093EH9ZUxeAYzePzULb-XOHfXkATxtn11Rn7siN&usqp=CAc',
      status: false
    },
    {
      name: 'Cafeteira',
      description: 'Pra gente te convidar pra tomar um café',
      price: 199.90,
      imageUrl: 'https://electrolux.vtexassets.com/arquivos/ids/214556/Coffee_Machine_ECM30_FrontView_Electrolux_1000x1000_principal.jpg?v=637721920607430000',
      status: false
    },
    {
      name: 'Xbox Series X',
      description: 'Pra gente jogar juntos',
      price: 4690.00,
      imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ-_7nZTfttEBhSg-ex9_loOXdJWfB8EhoLHh9zcJBRyCUPkbzf_AeSCRfP0QrwA0Va3RVYPDlhc2Dlk56b3csJmcfJHjm9TajuKuSvfnCOUe8A_75_hpCsnH-pPCkojjD9zwGW9Lw&usqp=CAc',
      status: false
    },
    {
      name: 'Moedor de sal e pimenta',
      description: 'Pra gente te convidar pra jantar',
      price: 150.00,
      imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAdGeujVqKrlpHkiF0sjKn4bPdEsr9pzTL8iy7z_khlqEvoLEWSc2NroZh324At48ln4rIfyh4EE2ThIktT28xH1L6D15esOts3_iGXUWjqJO0AzHS2hLChIGrbnmwjOdgtmhm0HxlCg&usqp=CAc',
      status: false
    },
    {
      name: 'Jogo de Panelas',
      description: 'Mais louça pro Alberson lavar #chorei',
      price: 299.90,
      imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQC3xCDq4dWx-SzmcRulk5gW1FyMyhJHLsYSPMIlHsqfW7ooMBVP8ifbDSBpTyGvJ83iKFXdcwKbRuwse562YWA9eh1oKcKnEFw3GYvETGSsjD1R_KLLUorCVrtyftEIeF0hm21&usqp=CAc',
      status: false
    },
    {
      name: 'Jogo de Toalhas',
      description: 'Pro banho semanal de Rafaela',
      price: 99.90,
      imageUrl: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSYLz3ZaIvogf9d861gHV_YF3akPMhCjk5DiDYACMJRsSQgSBC9BhrB4qU2OPZTsNIQ_G2crnwTa0A-bKXhepN8TKuutZT6qL27n9ajMyeR&usqp=CAc',
      status: false
    },
    {
      name: 'Máquina de Lavar',
      description: 'Pra minhas roupas pararem de encolher',
      price: 1999.90,
      imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTqVZGj9_NBciapveNQyY9QdvWBsp38wEf52ykVlmo0HTdmpbBEJZD0nz75P0ZomN3BF_wwwbrwRiX4DWpjohA--IrJKk0bh9j5eVy_JvzGL_VX7cjP1CB3-rj9b3J1-WeWO7JBosDfwQ&usqp=CAc',
      status: false
    },
    {
      name: 'Microondas',
      description: 'Pra esquentar a comida de ontem',
      price: 799.90,
      imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSY5SW6BSlQYNLKNPcyryl8evTO8KQiLQGx4Unc2_yU4q9ihi1j9KCQsr197KBzB81ozwD3XF_2AkyiUmNPxnwCYq5aTAn0DzDKZ7QdqrSBmDLETJBZ2h1LhT72m4qbO6wNQUFQcg&usqp=CAc',
      status: false
    },
    {
      name: 'Mixer',
      description: 'Queimei o nosso fazendo bobó de camarão',
      price: 199.90,
      imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRFl-_Fhp9G8uae5raXFpRNwssrdpwG-ns14VrRhTGC5DYqdxl73sxLBg_EEPCBSSgi-BvXW1QT56y2YJ18p97k-BrtsV6QuTzozTnwqnf_CfUfBnhlLFohJMZaRp5PF16SX9XlzFkJ&usqp=CAc',
      status: false
    },
    {
      name: 'Pipoqueira',
      description: 'Pra gente te convidar pra assistir um filme',
      price: 199.90,
      imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR9_B7N6rSZ3-SUzC70_p-cGPQN3DhBw-jBEUNgnxqL-p5UImPYesE85lnN1IJnFREPfcnmg798MmzA-pbHmmuXv9wJuvhyotaO2vw_tz0kwHhBLa84aK-q6NQ-OnGnQ5QeTAUNS2w&usqp=CAc',
      status: false
    },
    {
      name: 'Roupa de Cama',
      description: 'Pro Alberson não roubar a coberta',
      price: 299.90,
      imageUrl: 'https://images.yampi.me/assets/stores/todecorando/uploads/images/kit-roupa-de-cama-7-pecas-queen-colorful-summer-soul-amarelo-663b6a6caffbe-medium.jpg',
      status: false
    },
    {
      name: 'Cooktop',
      description: 'Fazer aquele rango',
      price: 499.90,
      imageUrl: 'https://d296pbmv9m7g8v.cloudfront.net/Custom/Content/Products/10/64/1064318_fogao-cooktop-eletrico-philco-pct55vc-volcano-5-queimadores-mesa-vitroceramico-10009096_m102_638620967781426366.webp',
      status: false
    },
    {
      name: 'Kit de Facas',
      description: 'Vamos acabar usando só uma mesmo',
      price: 199.90,
      imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQpnYoGsBCrNwaNrFsaz6tV9ymzIyo1cp94TdGTVdpP2ls4iX3FSqBO3nUTja5wS1HCqc9SUqMfLarYD0PYqV_G0sV0omElsDdOu9TuOO3VKVJkqTdaa1CJK-jkH4CPrrA9_WI1EyLUMw&usqp=CAc',
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
