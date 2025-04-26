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