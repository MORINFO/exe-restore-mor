let configs = {}

async function start() {

    try {
        const buscaConfigs = await axios.get('http://127.0.0.1:3435/consulta-configs')

        const loop = document.getElementById(`loop`)

        if (buscaConfigs.data) {
            configs = buscaConfigs.data
            loop.className = 'loopOff'
        } else {
            alert('Erro ao consultar informações')
            window.close()
        }

        const horarios = document.getElementById('horarios')

        console.log(configs)

        configs.horarios_bio.map((horario) => {

            let novaDivHora = document.createElement('div')
            let id_novaDivHora = new Date().getTime()
            novaDivHora.id = id_novaDivHora
            novaDivHora.className = 'divHora'

            let novoInputHora = document.createElement('input');
            novoInputHora.id = 'inputHora'
            novoInputHora.className = 'hora'
            novoInputHora.type = 'time'
            novoInputHora.value = horario.hora_minuto
            novaDivHora.appendChild(novoInputHora)

            let novoImgDeleteHora = document.createElement('img')
            novoImgDeleteHora.setAttribute('onclick', `deleteInput(${id_novaDivHora})`)
            novoImgDeleteHora.src = 'x.svg'
            novoImgDeleteHora.className = 'lixo'

            novaDivHora.appendChild(novoImgDeleteHora)

            horarios.appendChild(novaDivHora);
        })

        configs.emails_bio.map((email, index) => {
            const emails = document.getElementById('emails')

            let novaDivEmail = document.createElement('div')
            let id_novaDivEmail = new Date().getTime() + index
            novaDivEmail.id = id_novaDivEmail
            novaDivEmail.className = 'divEmail'

            let novoInputEmail = document.createElement('input');
            novoInputEmail.id = 'inputEmail'
            novoInputEmail.className = 'email'
            novoInputEmail.type = 'email'
            novoInputEmail.value = email.email
            novaDivEmail.appendChild(novoInputEmail)

            let novoImgDeleteEmail = document.createElement('img')

            novoImgDeleteEmail.setAttribute('onclick', `deleteInput(${id_novaDivEmail})`)
            novoImgDeleteEmail.src = 'x.svg'
            novoImgDeleteEmail.className = 'lixo'

            novaDivEmail.appendChild(novoImgDeleteEmail)

            emails.appendChild(novaDivEmail);
        })

        

    } catch (error) {
        alert('Erro ao consultar informações')
    }

}

start()

async function salvaConfigs() {

    event.preventDefault();


    let emailInputs = document.getElementsByClassName('email');
    let emails = []

    let horaInputs = document.getElementsByClassName('hora');
    let horas = [];

    if (emailInputs.length < 1) {
        alert("obrigatório preencher no mínimo um email")
        return
    }

    if (horaInputs.length < 1) {
        alert("obrigatório preencher no mínimo uma hora")
        return
    }

    Array.from(emailInputs).map(email => {
        if (email.value.length > 0) {
            emails.push({ email: email.value })
        }
    })

    Array.from(horaInputs).map(hora => {
        if (hora.value.length > 0) {
            horas.push({ hora_minuto: hora.value })
        }
    })

    await axios.post('http://127.0.0.1:3435/edita-configs', {
        emails,
        horarios: horas
    }).then(response => {
        alert(response.data)
        window.close()
    })
        .catch(error => {
            alert('Erro ao salvar informações')
        })
}

async function deleteInput(id) {

    let elemento = document.getElementById(id);
    if (elemento) {
        elemento.remove()
    }
}

async function geraInputHora() {

    const horaInputs = document.getElementsByClassName('hora');

    if (horaInputs.length >= 12) {
        erroMessage('Limite máximo de horários atingido')
        return
    }

    const horarios = document.getElementById('horarios')

    let novaDivHora = document.createElement('div')
    let id_novaDivHora = new Date().getTime()
    novaDivHora.id = id_novaDivHora
    novaDivHora.className = 'divHora'

    let novoInputHora = document.createElement('input');
    novoInputHora.id = 'inputHora'
    novoInputHora.className = 'hora'
    novoInputHora.type = 'time'
    novoInputHora.placeholder = '0'
    novaDivHora.appendChild(novoInputHora)

    let novoImgDeleteHora = document.createElement('img')

    novoImgDeleteHora.setAttribute('onclick', `deleteInput(${id_novaDivHora})`)
    novoImgDeleteHora.src = 'x.svg'
    novoImgDeleteHora.className = 'lixo'

    novaDivHora.appendChild(novoImgDeleteHora)

    horarios.appendChild(novaDivHora);
}

async function geraInputEmail() {

    const emails = document.getElementById('emails')
    const emailInputs = document.getElementsByClassName('email');

    if (emailInputs.length >= 4) {
        erroMessage('Limite máximo de emails atingido')
        return
    }

    let novaDivEmail = document.createElement('div')
    let id_novaDivEmail = new Date().getTime()
    novaDivEmail.id = id_novaDivEmail
    novaDivEmail.className = 'divEmail'

    let novoInputEmail = document.createElement('input');
    novoInputEmail.id = 'inputEmail'
    novoInputEmail.className = 'email'
    novoInputEmail.type = 'email'
    novoInputEmail.placeholder = 'email'
    novaDivEmail.appendChild(novoInputEmail)

    let novoImgDeleteEmail = document.createElement('img')

    novoImgDeleteEmail.setAttribute('onclick', `deleteInput(${id_novaDivEmail})`)
    novoImgDeleteEmail.src = 'x.svg'
    novoImgDeleteEmail.className = 'lixo'

    novaDivEmail.appendChild(novoImgDeleteEmail)

    emails.appendChild(novaDivEmail);
}

function validarHora() {
    var horaInicio = document.getElementById("hora-inicio").value;
    var horaFim = document.getElementById("hora-fim").value;

    // Converter as horas para objetos Date
    var dataInicio = new Date("2000-01-01T" + horaInicio);
    var dataFim = new Date("2000-01-01T" + horaFim);

    // Verificar a diferença em milissegundos
    var diferenca = dataFim - dataInicio;

    // Verificar se a diferença é menor que 1 hora (3600000 milissegundos)
    if (diferenca < 3600000) {
        document.getElementById("hora-inicio").disabled = true;
        document.getElementById("hora-fim").disabled = true;
        alert("A diferença entre as horas deve ser de pelo menos 1 hora.");
    }
}

function erroMessage(message) {

    const errorMax = document.getElementById('errorMax')
    errorMax.className = 'toast'

    const messageError = document.getElementById('messageError')
    messageError.innerText = message

    setTimeout(() => {
        errorMax.className = 'toastOff'
    }, 3000);
}