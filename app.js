

const API = "https://www.gamerpower.com/api/giveaways"; // gamerpower api   

const installBtn = document.querySelector("#installBtn");
let deferredPrompt;


async function carregarJogos() {

    const resposta = await fetch(API);
    const jogos = await resposta.json();
    console.log(jogos);
    const grid = document.querySelector("#games");
    grid.innerHTML = "";

    grid.innerHTML = jogos.map(jogo => `
                
        <article class="game">
            <img src="${jogo.thumbnail}" alt="${jogo.thumbnail}"   loading="lazy" decoding="async">
            <h3>${jogo.title}</h3>
        </article>
    
    `).join("");



    // Outra forma de fazer utilizando ForEach

    //     para cada jogo na lista de jogos faça!!!
    //   jogos.forEach(jogo => {
    //      grid.innerHTML += `
    //           <article class="game">
    //           <img src="${jogo.thumbnail}" alt="${jogo.thumbnail}"  width="180" height="150" loading="lazy" decoding="async">
    //          <h3>${jogo.title}</h3>
    //         </article>
    //      `
    // })

}

carregarJogos();



// -------------------------
// PWA
// -------------------------

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js");
    });
}

window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.classList.add("hidden");



    // Captura o evento de instalação concluída
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA instalado com sucesso!', event);
    });
});



// -------------------------
// Funcionalidade hardware
// Buscar jogo
// -------------------------

let jogos = [];

// Carrega a API em segundo plano
fetch(API)
    .then(res => res.json())
    .then(data => { jogos = data; });

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function iniciarBuscaPorVoz() {
    if (!SpeechRecognition) {
        alert("Seu navegador não suporta busca por voz.");
        return;
    }

    const reconhecimento = new SpeechRecognition();
    reconhecimento.lang = "pt-BR";

    const btnVoz = document.getElementById("btnVoz");
    const resultado = document.getElementById("resultado");

    // 1. Muda o texto IMEDIATAMENTE ao clicar no botão
    btnVoz.innerText = "🔴 Ouvindo...";
    resultado.innerHTML = "<p><i>Escutando... Pode falar o nome do jogo.</i></p>";

    reconhecimento.start();

    // 2. Quando reconhecer a fala
    reconhecimento.onresult = (event) => {
        const nomeFalado = event.results[0][0].transcript;
        document.getElementById("busca").value = nomeFalado;
        buscarJogo(nomeFalado);
    };

    // 3. Quando a gravação parar (por término ou erro)
    reconhecimento.onend = () => {
        btnVoz.innerText = "🎤 Voz";
    };

    // 4. Caso aconteça erro de permissão do microfone
    reconhecimento.onerror = (event) => {
        btnVoz.innerText = "🎤 Voz";
        if (event.error === "not-allowed") {
            resultado.innerHTML = "<p>Permissão do microfone foi negada.</p>";
        } else {
            resultado.innerHTML = "<p>Não entendi o que você falou. Tente de novo.</p>";
        }
    };

}

// Função de busca
function buscarJogo(nome) {
    const termo = nome || document.getElementById("busca").value;

    if (!termo.trim()) return;

    const jogo = jogos.find(j =>
        j.title.toLowerCase().includes(termo.toLowerCase())
    );

    const resultado = document.getElementById("resultado");

    if (!jogo) {
        resultado.innerHTML = "<p>Jogo não encontrado</p>";
        return;
    }

    resultado.innerHTML = `
        <h2>${jogo.title.replace(" Giveaway", "")}</h2>
        <img src="${jogo.image || jogo.thumbnail}" width="200" alt="${jogo.title}">
    `;
}




