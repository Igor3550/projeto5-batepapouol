
let usuario = ''
let intervalId;

function entrarNaSala(name) {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: name});
  res.then(retornoDoServidor);
  res.catch(retornoErro);
}

function manterConexão() {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: usuario});
  res.then((res) => {console.log(res)})
  res.catch(retornoErro);
}

function enviarMensagem() {
  const res = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {});
}

function buscarMensagens() {
  const res = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
}

function retornoDoServidor(res) {
  console.log(res);
  intervalId = setInterval(manterConexão, 5000);
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

function iniciar(){
  do {
    usuario = prompt("Digite o seu nome:")
  }while(usuario === '');
  
  entrarNaSala(usuario);
}

iniciar();