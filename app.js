
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
            <img src="${jogo.thumbnail}" alt="${jogo.thumbnail}"  width="180" height="150" loading="lazy" decoding="async">
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