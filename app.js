const formulario = document.getElementById('formulario');
const inputs =  document.querySelectorAll('input');
const txtarea =  document.querySelectorAll('#mensaje');
const captcha =  document.querySelectorAll('token');

const expresiones = { //ver si es necesario cambiar el const por var
	nombre: /^[a-zA-Z\s]{1,40}$/,
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{1,6}$/,
	asunto: /^[a-zA-ZÀ-ÿ\s0-9]{1,40}$/, 
	mensaje: /^[a-zA-ZÀ-ÿ\s\d.+-_\s]{1,}/, 

}
const campos = {
    nombre: false,
    correo: false,
    asunto: false,
    mensaje: false,
}

const validarFormulario = (e) =>{
    //console.log('se ejecuto');
    switch(e.target.name){
        case "nombre":
            validarCampo(expresiones.nombre,e.target, 'nombre');
        break;
        case "correo":
            validarCampo(expresiones.correo,e.target, 'correo');
        break;

        case "asunto":
            //console.log('funciona la validacion asunto');
            validarCampo(expresiones.asunto,e.target, 'asunto');
        break;
        case "mensaje":
            //console.log('funciona la validacion mensaje');
            validarCampo2(expresiones.mensaje,e.target, 'mensaje');
        break;
    }
}

const validarCampo = (expresion, input, campo) =>{
    if(expresion.test(input.value)){
        document.getElementById(`grupo_${campo}`).classList.remove('formulario_grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.add('formulario_grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo_${campo} .formulario_input-error`).classList.remove('formulario_input-error-activo');
        campos[campo] = true;
    }else {
        document.getElementById(`grupo_${campo}`).classList.add('formulario_grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.remove('formulario_grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo_${campo} .formulario_input-error`).classList.add('formulario_input-error-activo');
        campos[campo] = false;
    }
}

const validarCampo2 = (expresion, input) =>{
    if(expresion.test(input.value)){
        document.getElementById('grupo_mensaje').classList.remove('formulario_grupo-incorrecto');
        document.getElementById('grupo_mensaje').classList.add('formulario_grupo-correcto');
        document.querySelector('#grupo_mensaje i').classList.remove('fa-times-circle');
        document.querySelector('#grupo_mensaje i').classList.add('fa-check-circle');
        document.querySelector('#grupo_mensaje .formulario_input-error').classList.remove('formulario_input-error-activo');
        campos['mensaje'] = true;
    }else {
        document.getElementById('grupo_mensaje').classList.add('formulario_grupo-incorrecto');
        document.getElementById('grupo_mensaje').classList.remove('formulario_grupo-correcto');
        document.querySelector('#grupo_mensaje i').classList.add('fa-times-circle');
        document.querySelector('#grupo_mensaje i').classList.remove('fa-check-circle');
        document.querySelector('#grupo_mensaje .formulario_input-error').classList.add('formulario_input-error-activo');
        campos['mensaje'] = false;
    }
}

//sondear cuando dejen de teclear en los inputs y por cuando hagan click en otra parte
inputs.forEach((input) =>{
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

txtarea.forEach((mensaje) =>{
    mensaje.addEventListener('keyup', validarFormulario);
    mensaje.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) =>{ //comprovacion de los campos al darle sumbmit
    e.preventDefault();


    var datos = new FormData(formulario);

    console.log(datos)
    console.log(datos.get('nombre'))
    console.log(datos.get('correo'))
    console.log(datos.get('asunto'))
    console.log(datos.get('mensaje'))
    console.log(datos.get('token'))
    fetch('post.php',{
        method: 'POST',
        body: datos
    })

        .then(res => res.json())
        .then(data => {
            //aca son las validaciones que se hace en post
            console.log(data)
            if(data === 'pasa-form'){
                //alert sweet
                $('#submit').click(function(){
                    Swal.fire({
                        title: 'ok!',
                        text: 'Muchas gracias por su contacto',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        backdrop: true,
                        timer: 5000, //esto es ms es decir 5 seg
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        stopKeydownPropagation: false, 
                        //window: location.reload(),
                    })
                });
                document.querySelectorAll('.formulario_grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formulario_grupo-correcto');
                })
            }else{
                //alert sweet
                $('#submit').click(function(){
                    Swal.fire({
                        title: 'Error!',
                        text: 'Cargue todos los campos',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        backdrop: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        stopKeydownPropagation: false, 
                    })
                });
            }
        })
});

grecaptcha.ready(function() {
    grecaptcha.execute('6Lcd6_4pAAAAAPXiPA6JBg5PVwyoWLsqc1lHxCpR', 
    {action: 'formulario'})
        .then(function(respuesta_token) {
            const itoken = document.getElementById('token');
            const btn = document.getElementById('submit');
            itoken.value = respuesta_token;
            btn.disabled = false;
    });

});




