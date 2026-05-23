// inicializa datos de los usuarios en localStorage si no existen
function inicializarUsuario() {
  // usuario 1 - sin movimientos
  if (!localStorage.getItem('usuario')) {
    var usuario = {
      nombre: 'Ash Ketchum',
      pin: '1234',
      cuenta: '0987654321',
      saldo: 500.00,
      movimientos: []
    }
    localStorage.setItem('usuario', JSON.stringify(usuario))
  }

  // usuario 2 - con movimientos previos para pruebas
  if (!localStorage.getItem('usuario2')) {
    var usuario2 = {
      nombre: 'Misty Waterflower',
      pin: '0000',
      cuenta: '1234567890',
      saldo: 1500.00,
      movimientos: []
    }
    localStorage.setItem('usuario2', JSON.stringify(usuario2))
  }
}

// se ejecuta al cargar la pagina
inicializarUsuario()

// pin que el usuario va ingresando
var pinUsuario = ''

// contador de intentos fallidos
var intentosFallidos = 0

// reglas de validacion con validatejs
var reglas = {
  pin: {
    presence: {
      allowEmpty: false,
      message: 'Debe ingresar un PIN'
    },
    // tiene que ser exactamente 4 numeros
    length: {
      is: 4,
      message: 'El PIN debe ser de 4 digitos'
    },
    // no acepta letras ni simbolos
    format: {
      pattern: /^[0-9]{4}$/,
      message: 'Solo se aceptan numeros'
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

// pinta los puntitos segun cuantos numeros llevo
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

// bloquea o desbloquea el teclado
function bloquearTeclado(bloquear) {
  var botones = document.querySelectorAll('#teclado button')
  botones.forEach(function(btn) {
    btn.disabled = bloquear
    btn.style.opacity = bloquear ? '0.4' : '1'
  })
}

// valida el pin cuando presiono OK
function validar() {
  // si el teclado esta bloqueado no hace nada
  if (document.querySelector('#teclado button').disabled) return

  var errores = validate({ pin: pinUsuario }, reglas)

  // si hay errores de formato los muestro con SweetAlert
  if (errores) {
    Swal.fire({
      title: 'Error',
      text: errores.pin[0],
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#cc0000'
    })
    pinUsuario = ''
    pintarPuntos()
    return
  }

  // leo los datos de ambos usuarios desde localStorage
  var usuario1 = JSON.parse(localStorage.getItem('usuario'))
  var usuario2 = JSON.parse(localStorage.getItem('usuario2'))

  // verifico cual usuario ingreso
  var usuarioActivo = null
  if (pinUsuario === usuario1.pin) {
    usuarioActivo = usuario1
    localStorage.setItem('usuarioActivo', 'usuario')
  } else if (pinUsuario === usuario2.pin) {
    usuarioActivo = usuario2
    localStorage.setItem('usuarioActivo', 'usuario2')
  }

  if (usuarioActivo) {
    // guardar sesion en localStorage
    localStorage.setItem('usuarioLogueado', 'true')
    intentosFallidos = 0
    Swal.fire({
      title: '¡Bienvenido!',
      text: 'Bienvenido ' + usuarioActivo.nombre,
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#28a745',
      timer: 2000,
      timerProgressBar: true
    })
    setTimeout(function() {
      window.location.href = 'dashboard.html'
    }, 2000)
  } else {
    intentosFallidos++
    pinUsuario = ''
    pintarPuntos()

    // bloquear despues de 3 intentos fallidos
    if (intentosFallidos >= 3) {
      Swal.fire({
        title: 'Cuenta bloqueada',
        text: 'Demasiados intentos fallidos. Espere 30 segundos.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#cc0000'
      })
      bloquearTeclado(true)
      document.getElementById('intentosMsg').style.display = 'none'
      // desbloquear despues de 30 segundos
      setTimeout(function() {
        intentosFallidos = 0
        bloquearTeclado(false)
        mostrarAviso('Ya puede intentarlo de nuevo.', 'warning')
      }, 30000)
    } else {
      // mostrar cuantos intentos quedan
      var restantes = 3 - intentosFallidos
      Swal.fire({
        title: 'PIN incorrecto',
        text: 'El PIN ingresado no es válido. Intentos restantes: ' + restantes,
        icon: 'error',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#cc0000'
      })
      var intentosMsg = document.getElementById('intentosMsg')
      intentosMsg.style.display = 'block'
      intentosMsg.textContent = 'Intentos restantes: ' + restantes
    }
  }
}

// muestra el mensaje de error o exito en el dropdown
function mostrarAviso(texto, tipo) {
  var aviso = document.getElementById('aviso')
  aviso.style.display = 'block'
  aviso.className = 'alert alert-' + tipo
  aviso.textContent = texto
}

// escucha teclado fisico para ingresar el PIN
document.addEventListener('keydown', function(event) {
  var cajaLogin = document.getElementById('cajaLogin')
  if (cajaLogin && cajaLogin.classList.contains('show')) {
    var teclaPresionada = event.key
    if (/^[0-9]$/.test(teclaPresionada)) {
      tecla(teclaPresionada)
    } else if (teclaPresionada === 'Backspace') {
      borrar()
    } else if (teclaPresionada === 'Enter') {
      validar()
    }
  }
})

// muestra informacion del grupo
function mostrarAcercaDe() {
  Swal.fire({
    title: 'Acerca de Nosotros',
    html: `
      <div style="text-align:left; font-size: 0.95rem; line-height: 1.6;">
        <p style="text-align:center; margin-bottom:10px"><strong>Pokémon Bank ATM</strong><br>
        <small style="color:#888">Desarrollo de Aplicaciones Web (DAW)</small></p>
        <hr>
        <p><strong>Integrantes:</strong></p>
        <ul style="list-style:none; padding:0;">
          <li>👤 <strong>Carlos Alberto Cornejo Calderón</strong> — CC251978</li>
          <li>👤 <strong>Norma Susana García Galdamez</strong> — GG253588</li>
          <li>👤 <strong>Kevin Alexander Del Cid Ponce</strong> — DP191337</li>
          <li>👤 <strong>David Antonio Leiva Martinez</strong> — LM160828</li>
        </ul>
        <hr>
        <p style="text-align:center; color:#888; margin:0"><small>Universidad Don Bosco © 2026</small></p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#cc0000'
  })
}