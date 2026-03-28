// aqui guardo lo que el usuario va presionando
var pinUsuario = ''

// reglas de validación con validatejs
var reglas = {
  pin: {
    presence: {
      allowEmpty: false,
      message: 'Debe ingresar un PIN'
    },
    // tiene que ser exactamente 4 números
    length: {
      is: 4,
      message: 'El PIN debe ser de 4 dígitos'
    },
    // no acepta letras ni símbolos
    format: {
      pattern: /^[0-9]{4}$/,
      message: 'Solo se aceptan números'
    }
  }
}

// cuando presiono un numero del teclado
function tecla(num) {
  if (pinUsuario.length >= 4) return
  pinUsuario = pinUsuario + num
  pintarPuntos()
}

// borra el ultimo numero
function borrar() {
  pinUsuario = pinUsuario.slice(0, -1)
  pintarPuntos()
}

// pinta los puntitos según cuantos números llevo
function pintarPuntos() {
  for (var i = 0; i < 4; i++) {
    var punto = document.getElementById('p' + i)
    if (i < pinUsuario.length) {
      punto.classList.add('lleno')
    } else {
      punto.classList.remove('lleno')
    }
  }
}

// valida el pin cuando presiono OK
function validar() {

  var errores = validate({ pin: pinUsuario }, reglas)

  // si hay errores los muestro
  if (errores) {
    mostrarAviso(errores.pin[0], 'danger')
    pinUsuario = ''
    pintarPuntos()
    return
  }

  // verifico si el pin es correcto
  if (pinUsuario == '1234') {
    mostrarAviso('Bienvenido Ash Ketchum!', 'success')
    setTimeout(function() {
      window.location.href = 'dashboard.html'
    }, 2000)
  } else {
    mostrarAviso('PIN incorrecto', 'danger')
    pinUsuario = ''
    pintarPuntos()
  }
}

// muestra el mensaje de error o éxito
function mostrarAviso(texto, tipo) {
  var aviso = document.getElementById('aviso')
  aviso.style.display = 'block'
  aviso.className = 'alert alert-' + tipo
  aviso.textContent = texto
}