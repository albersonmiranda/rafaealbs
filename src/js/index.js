// Importa módulos necessários
import '../styles/style.css';
import '../js/qr_code.js';

// Importar imagens de forma recursiva
function importAll(r) {
  let images = {};
  
  r.keys().forEach((item) => {
    // Verifica se o item é um diretório
    if (item.endsWith('/')) {
      // Chama a função recursivamente para importar imagens desse diretório
      const subImages = importAll(r(item));
      images = { ...images, ...subImages };
    } else {
      images[item.replace('./', '')] = r(item);
    }
  });

  return images;
}

const images = importAll(require.context('../assets', true, /\.(png|jpe?g|svg|ico)$/));

// Função para revelar elementos ao rolar a página
//const parallax = document.getElementById("home-img-lg");
const parallax1 = document.getElementById("parallax1");
const parallax2 = document.getElementById("parallax2");
const parallax3 = document.getElementById("parallax3");

//if (parallax) {
//window.addEventListener("scroll", function () {
//  let offset = window.pageYOffset;
//    parallax.style.backgroundPositionX = offset * (-0.08) - 100 + "px";
//  });
//}

if (parallax1) {
  window.addEventListener("scroll", function () {
    let offset = window.pageYOffset;
    offset -= 3100;
    parallax1.style.backgroundPositionY = offset * (0.1) + "px";
  });
}

if (parallax2) {
  window.addEventListener("scroll", function () {
    let offset = window.pageYOffset;
    offset -= 4800;
    parallax2.style.backgroundPositionX = offset * (-0.1) + "px";
  });
}

if (parallax3) {
  window.addEventListener("scroll", function () {
    let offset = window.pageYOffset;
    offset -= 6000;
    parallax3.style.backgroundPositionX = offset * (0.09) + "px";
  });
}

function myFunction() {
  document.getElementById("check").checked = false;
}

// Adicione a função ao objeto window
window.myFunction = myFunction;

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);
