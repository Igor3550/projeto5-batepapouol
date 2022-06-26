let listaMensagens = undefined;
let listaParticipantes;
let intervalConexaoId;
let intervalMesgId;
let intervalParticipantesId;
let usuario = '';
let visibilidade;
let participanteSelecionado = 'Todos';
let typeMsg = 'message';

function entrarNaSala(name) {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: name});
  res.then((res)=>{
    {
      buscarMensagens();
      buscarParticipantes();
      intervalConexaoId = setInterval(manterConexão, 5000);
      intervalMesgId = setInterval(buscarMensagens, 3000);
      intervalParticipantesId = setInterval(buscarParticipantes, 10000);
    }
  });
  res.catch((error)=>{
    console.log(error.response)
    if(error.response.status === 400){
      alert("Usuario invalido!");
    }else{
      alert(`Ocorreu um: ErrorCode: ${error.response.status}`)
    }
  });
}

function manterConexão() {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: usuario});
  res.then((res) => {
    //console.log(res)
    document.querySelector('.tela-login').classList.add('esconder')
  })
  res.catch((error) => {
    clearInterval(intervalConexaoId);
    clearInterval(intervalMesgId);
    clearInterval(intervalParticipantesId);
    console.log(error)
    if(error.response.status === 400){
      alert("Usuario desconectado!");
      window.location.reload()
    }else{
      alert(`Ocorreu um: ErrorCode: ${error.response.status}`);
      window.location.reload()
    }
  });
}

function enviarMensagem() {

  let elementoPai = document.querySelector('.area-rodape .rodape')
  let mensagem = elementoPai.querySelector('input').value
  if(mensagem !== ''){
    const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
      
      from: usuario,
      to: participanteSelecionado,
      text: mensagem,
      type: typeMsg
      
    });
    res.then((res)=>{
      console.log(res.data)
    })
    res.catch((error)=>{
      console.log(error);
      alert("Erro ao enviar mensagem!");
      //window.location.reload();
    })
  }
  elementoPai.querySelector('input').value = '';
}

function buscarMensagens() {
  const res = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  res.then((res)=>{
    listaMensagens = res.data;
    renderizarMensagens()
  })
  res.catch((error)=>{
    console.log(error)
  })
}

function buscarParticipantes(){
  const res = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
  res.then((res)=>{
    listaParticipantes = res.data
    renderizarParticipantes();
  })
  res.catch((error)=>{
    console.log(error)
  })
}

function renderizarParticipantes() {

  const areaParticipantes = document.querySelector('.tela-participantes .participantes');
  areaParticipantes.innerHTML = ''
  let participante = ''

  for (let i=0; i<listaParticipantes.length; i++){

    if(participanteSelecionado === listaParticipantes[i].name){
      participante = listaParticipantes[i].name
      areaParticipantes.innerHTML += `
      <div class="participante" onclick="checkmarkParticipante(this)">
        <span>
          <ion-icon name="person-circle"></ion-icon> <p>${listaParticipantes[i].name}</p>
        </span>

        <img src="/assets/checkmark.svg" class="checkmark marcar-check">
      </div>
    `
    }else{
      areaParticipantes.innerHTML += `
        <div class="participante" onclick="checkmarkParticipante(this)">
          <span>
            <ion-icon name="person-circle"></ion-icon> <p>${listaParticipantes[i].name}</p>
          </span>
  
          <img src="/assets/checkmark.svg" class="checkmark">
        </div>
      `
    }
  }

  if(participante === ''){
    /* 
    setando o estado do participante online selecionado quando a lista atualizar
    */
    const opcaoTodos = document.querySelector('.tela-participantes .todos');
    opcaoTodos.querySelector('.checkmark').classList.add('marcar-check')
    participanteSelecionado = 'Todos';
    let legendaReservada = document.querySelector('.legenda-reservada');
    legendaReservada.innerHTML = `Enviando para ${participanteSelecionado} (reservadamente)`
  }
  
}

function renderizarMensagens() {
  const elementoChat = document.querySelector('.chat');
  elementoChat.innerHTML = '';
  for (let i=0; i<listaMensagens.length; i++){
    renderizarMensagem(listaMensagens[i]);
  }
}

function renderizarMensagem(msg){
  const elementoChat = document.querySelector('.chat');

  if(msg.type === 'status'){
    elementoChat.innerHTML += `
    <div class="mensagem sistema">
      <div class="texto-mensagem"><em>${msg.time}</em> <strong>${msg.from}</strong> ${msg.text}</div>
    </div>`
  }else if(msg.type === 'message'){
    elementoChat.innerHTML += `
    <div class="mensagem">
      <div class="texto-mensagem"><em>${msg.time}</em> <strong>${msg.from}</strong> para <strong>${msg.to}</strong>: ${msg.text}</div>
    </div>`
  }else if(msg.type === 'private_message'){
    if(msg.to === usuario || msg.from === usuario){
      elementoChat.innerHTML += `
      <div class="mensagem reservada">
        <div class="texto-mensagem"><em>${msg.time}</em> <strong>${msg.from}</strong> para <strong>${msg.to}</strong>: ${msg.text}</div>
      </div>`
    }
  }

  const ultimaMsg = elementoChat.querySelector('.mensagem:last-child');
  if(ultimaMsg !== null){
    ultimaMsg.scrollIntoView();
  }
}

function esconderBarraLateral(){
  let barraLateral = document.querySelector('.tela-participantes')
  barraLateral.classList.toggle('esconder')
}

function checkmarkParticipante(elemento){

  const elementoPai = elemento.parentNode.parentNode
  elementoPai.querySelector('.marcar-check').classList.remove('marcar-check')
  elemento.querySelector('.checkmark').classList.add('marcar-check')
  participanteSelecionado = elemento.querySelector('p').innerHTML

  let legendaReservada = document.querySelector('.legenda-reservada');
  legendaReservada.innerHTML = `Enviando para ${participanteSelecionado} (reservadamente)`

  console.log(participanteSelecionado)
}

function checkmarkVisibilidade(elemento){

  const elementoPai = elemento.parentNode
  const elementoCheck = elementoPai.querySelector('.marcar-check')
  if(elementoCheck !== null){
    elementoCheck.classList.remove('marcar-check')
  }
  elemento.querySelector('.checkmark').classList.add('marcar-check')
  visibilidade = elemento.querySelector('p').innerHTML

  if(visibilidade === 'Público'){
    typeMsg = 'message';
    document.querySelector('.legenda-reservada').classList.add('esconder');
  }else if(visibilidade === 'Privado'){
    typeMsg = 'private_message';
    let legendaReservada = document.querySelector('.legenda-reservada');
    legendaReservada.innerHTML = `Enviando para ${participanteSelecionado} (reservadamente)`
    legendaReservada.classList.remove('esconder')
  }

  console.log(visibilidade, typeMsg)
}

function fazerLogin(){
  usuario = document.querySelector('.tela-login input').value
  entrarNaSala(usuario);
}

let inputTextoElemento = document.querySelector('.rodape input')
inputTextoElemento.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    enviarMensagem();
  }
})