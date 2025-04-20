const navBar = document.getElementById('navBar');
const openButton = document.getElementById('openButton')

const media = window.matchMedia("(width < 700px)")

media.addEventListener('change', (e) => updateNavbar(e))

function updateNavbar(e){
    const isMobile = e.matches
    console.log(isMobile)
    if(isMobile){
        navBar.setAttribute('inert', '')
    }
    else{
        navBar.removeAttribute('inert')
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

updateNavbar()