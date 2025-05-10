//NavBar

const navBar = document.getElementById('navBar');
const openButton = document.getElementById('openButton')
const navLinks = document.querySelectorAll('nav a')

const media = window.matchMedia("(width < 700px)")

media.addEventListener('change', (e) => updateNavbar(e))

function updateNavbar(e){
    const isMobile = e.matches
    console.log(isMobile)
    if(isMobile){
        navBar.setAttribute('inert', '')
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hidenavBar()
            })
        });
    }
    else{
        navBar.removeAttribute('inert')
        navLinks.forEach(link => {
            link.removeEventListener('click', () => {
                hidenavBar()
            })
        });
    }
}

function shownavBar(){
    navBar.classList.add('show')
    navBar.removeAttribute('inert')
    openButton.setAttribute('aria-expanded', 'true')
}

function hidenavBar(){
    navBar.classList.remove('show')
    navBar.setAttribute('inert', '')
    openButton.setAttribute('aria-expanded', 'false')
}

updateNavbar(media)

// formulario validaciones

const formulario = document.getElementById('form');
const inputs = document.querySelectorAll('#form input');
const textArea = document.querySelector('#form textarea');

const expresiones = {
	user: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{4,12}$/, // 4 a 12 digitos.
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	phone: /^(0?424-?\d{7}|424-?\d{7})$/, // 7 a 14 numeros.
    message: /^.{1,400}$/, // Letras y espacios, pueden llevar acentos.
}

const validInputs = {
    name: false,
    email: false,
    phone: false,
    message: false
}

const validationForm = (e) => {
    console.log(e.target.name)
	switch (e.target.name) {
		case "name":
			validateInput(expresiones.name, e.target, 'name');
		break;
		case "email":
			validateInput(expresiones.email, e.target, 'email');
		break;
		case "phone":
			validateInput(expresiones.phone, e.target, 'phone');
		break;
	}
}

const validateInput = (expresion, input, campo) => {
	if(expresion.test(input.value)){
		document.getElementById(`${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#error_${campo}`).classList.remove('formulario__input-error-activo');
		validInputs[campo] = true;
	} else {
		document.getElementById(`${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#error_${campo}`).classList.add('formulario__input-error-activo');
		validInputs[campo] = false;
	}
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validationForm);
    input.addEventListener('blur', validationForm);
});

textArea.addEventListener('keyup', (e) => {
    if(expresiones.message.test(e.target.value)){
        document.getElementById('message').classList.remove('formulario__grupo-incorrecto');
        document.getElementById('message').classList.add('formulario__grupo-correcto');
        document.querySelector(`#error_message`).classList.remove('formulario__input-error-activo');
        validInputs.message = true;
    } else {
        document.getElementById('message').classList.add('formulario__grupo-incorrecto');
        document.getElementById('message').classList.remove('formulario__grupo-correcto');
        document.querySelector(`#error_message`).classList.add('formulario__input-error-activo');
        validInputs.message = false;
    }
});

textArea.addEventListener('blur', (e) => {
    if(expresiones.message.test(e.target.value)){
        document.getElementById('message').classList.remove('formulario__grupo-incorrecto');
        document.getElementById('message').classList.add('formulario__grupo-correcto');
        document.querySelector(`#error_message`).classList.remove('formulario__input-error-activo');
        validInputs.message = true;
    } else {
        document.getElementById('message').classList.add('formulario__grupo-incorrecto');
        document.getElementById('message').classList.remove('formulario__grupo-correcto');
        document.querySelector(`#error_message`).classList.add('formulario__input-error-activo');
        validInputs.message = false;
    }
});

formulario.addEventListener('submit', (e) => {
	if(!(validInputs.name && validInputs.email && validInputs.phone)) {
		e.preventDefault();
    } else {
        e.defaultPrevented = false;
    }

	
});
