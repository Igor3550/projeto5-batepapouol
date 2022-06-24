let listaMensagens = undefined;
let novaMsg;
let usuario = ''
let intervalConexaoId;
let intervalMesgId;
let participantes;

function entrarNaSala(name) {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: name});
  res.then(retornoDoServidor);
  res.catch(retornoErro);
}

function manterConexão() {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: usuario});
  res.then((res) => {
    //console.log(res)
  })
  res.catch((error) => {
    clearInterval(intervalConexaoId);
    clearInterval(intervalMesgId);
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

function enviarMensagem(elementoButtonEnviar) {

  let elementoPai = elementoButtonEnviar.parentNode
  let mensagem = elementoPai.querySelector('input').value

  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
    
    from: usuario,
    to: "Todos",
    text: mensagem,
    type: "message"
    
  });
  res.then((res)=>{
    console.log(res.data)
  })
  res.catch((error)=>{
    alert("Usuario desconectado!");
    console.log(error);
    window.location.reload();
  })

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
    console.log(res.data)
  })
  res.catch((error)=>{
    console.log(error)
  })
}

function retornoDoServidor(res) {
  //console.log(res.data);
  intervalConexaoId = setInterval(manterConexão, 5000);
  intervalMesgId = setInterval(buscarMensagens, 3000);
}

function retornoErro(error) {
  console.log(error.response)
  if(error.response.status === 400){
    alert("Usuario invalido!")
    iniciar();
  }else{
    alert(`Ocorreu um: ErrorCode: ${error.response.status}`)
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
    elementoChat.innerHTML += `
    <div class="mensagem reservada">
      <div class="texto-mensagem"><em>${msg.time}</em> <strong>${msg.from}</strong> para <strong>${msg.to}</strong>: ${msg.text}</div>
    </div>`
  }

  const ultimaMsg = elementoChat.querySelector('.mensagem:last-child');
  ultimaMsg.scrollIntoView();
}

function iniciar(){
  do {
    usuario = prompt("Digite o seu nome:")
  }while(usuario === '');
  
  entrarNaSala(usuario);
}

iniciar();