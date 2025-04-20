function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('show')
    sidebar.removeAttribute('inert')
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('show')
    sidebar.setAttribute('inert', '')
}