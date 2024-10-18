import { QrCodePix } from 'qrcode-pix';

// Variáveis globais para identificar a página atual
let isGiftsPage = false;
let isPrendasPage = false;

// Função para confirmar pagamento e atualizar o status do item visualmente
function confirmPayment() {
  console.log('confirmPayment called');
  const activeItem = document.querySelector('.gift-item.active'); // Busca o item de presente ativo

  if (activeItem) {
    activeItem.style.backgroundColor = '#d3d3d3'; // Muda o fundo para cinza
    const buyButton = activeItem.querySelector('.buy-button');
    buyButton.textContent = 'Comprado'; // Muda o texto para "Comprado"
    buyButton.disabled = true; // Desativa o botão
  }

  const qrCodeModal = document.getElementById('qrCodeModal');
  if (qrCodeModal) {
    qrCodeModal.style.display = 'none'; // Fecha o modal
  }
}

// Função genérica para buscar e exibir itens (gifts ou prendas)
async function fetchItems(endpoint, containerId) {
  try {
    const response = await fetch(endpoint);
    const items = await response.json();
    const itemContainer = document.getElementById(containerId);

    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('gift-item');
      itemElement.setAttribute('id', `${containerId}-${item.id}`);
      itemElement.setAttribute('data-id', item.id);

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = `Imagem do item ${item.name}`;
      itemElement.appendChild(img);

      itemElement.innerHTML += `
        <p class="description">${item.description}</p>
        <p class="price">R$ ${item.price}</p>
        <p class="name">${item.name}</p>
        <button class="buy-button">Comprar</button>
      `;

      if (item.status === true) {
        itemElement.style.backgroundColor = '#d3d3d3';
        itemElement.querySelector('.buy-button').textContent = 'Comprado';
        itemElement.querySelector('.buy-button').disabled = true;
      }

      itemContainer.appendChild(itemElement);
    });

    addBuyButtonListeners(); // Reutiliza a função existente para os botões
  } catch (error) {
    console.error(`Erro ao buscar itens (${containerId}):`, error);
  }
}

// Função para adicionar os eventos de clique aos botões "Comprar"
function addBuyButtonListeners() {
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      console.log('Botão Comprar clicado');

      const activeItem = event.target.closest('.gift-item');

      document.querySelectorAll('.gift-item').forEach(item => item.classList.remove('active'));
      activeItem.classList.add('active');

      const descriptionText = activeItem.querySelector('.description').textContent;
      const itemName = activeItem.querySelector('.name').textContent;
      const valor = activeItem.querySelector('.price').textContent;
      const itemId = activeItem.getAttribute('data-id');

      console.log('Nome do item:', itemName);
      console.log('Valor do item:', valor);

      const formatPrice = (price) => {
        return parseFloat(price.replace(/[R$\s,]/g, ''));
      };

      const normalizeDescription = (text) => {
        const asciiText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return asciiText.slice(0, 25);
      };

      const userName = prompt("Por favor, digite seu nome:");

      if (!userName) {
        alert("Nome é obrigatório para gerar o QR code.");
        return;
      }

      const generateTransactionId = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `casamentoRA${year}${month}${day}${hours}${minutes}${seconds}`;
      };

      const pixParams = {
        version: '01',
        key: '11364740729',
        name: userName,
        city: 'Vitoria',
        transactionId: generateTransactionId(),
        message: normalizeDescription(itemName),
        value: formatPrice(valor)
      };

      try {
        const qrCodePix = QrCodePix(pixParams);
        const qrCode = await qrCodePix.base64();
        const payload = qrCodePix.payload();

        console.log('QR Code gerado:', qrCode);

        const qrCodeModal = document.getElementById('qrCodeModal');
        const qrCodeImage = document.getElementById('qrCodeImage');
        qrCodeImage.src = qrCode;
        qrCodeModal.style.display = 'block';

        const copyPayloadButton = document.getElementById('copyPayloadButton');
        copyPayloadButton.onclick = function() {
          navigator.clipboard.writeText(payload).then(() => {
            alert("Código Pix copiado!");
          }).catch(err => {
            console.error('Erro ao copiar o código Pix:', err);
          });
        };

        const confirmPaymentButton = document.getElementById('confirmPaymentButton');
        confirmPaymentButton.onclick = function() {
          const collection = isGiftsPage ? 'gifts' : 'prendas'; // Identifica a coleção correta
          updateItemStatus(itemId, true, collection); // Passa o id, status e a coleção
          confirmPayment(); // Chama a função para atualizar a interface
          qrCodeModal.style.display = 'none'; // Fecha o modal após confirmação
        };

        const closeQrCodeModal = document.getElementById('closeQrCodeModal');
        closeQrCodeModal.onclick = function() {
          qrCodeModal.style.display = 'none';
        };

        window.onclick = function(event) {
          if (event.target == qrCodeModal) {
            qrCodeModal.style.display = 'none';
          }
        };

      } catch (error) {
        console.error('Erro ao gerar QR code:', error);
      }
    });
  });
}

// Função para atualizar o status do item no FaunaDB
async function updateItemStatus(id, status, collection) {
  console.log(`Atualizando status do item: id = ${id}, status = ${status}, collection = ${collection}`);
  try {
    const response = await fetch('/.netlify/functions/updateItemStatus', {
      method: 'POST',
      body: JSON.stringify({ id, status, collection }), // Incluindo a coleção no corpo da requisição
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Verifica a resposta
    console.log('Resposta da atualização:', data);

    if (data.error) {
      console.error('Erro do servidor:', data.error);
    } else {
      console.log('Status do item atualizado');
    }
  } catch (error) {
    console.error('Erro ao atualizar status do item:', error);
  }
}

// Identifica a página atual e define as variáveis globais
window.onload = function() {
  isGiftsPage = document.getElementById('gifts-list') !== null;
  isPrendasPage = document.getElementById('prendas-list') !== null;

  if (isGiftsPage) {
    fetchItems('/.netlify/functions/getGifts', 'gifts-list');
  } else if (isPrendasPage) {
    fetchItems('/.netlify/functions/getPrendas', 'prendas-list');
  }
};
