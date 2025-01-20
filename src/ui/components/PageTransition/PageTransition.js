import './PageTransition.style.css'

export const PageTransition = () => {
    document.querySelector('body').classList.add('page-transition')
    setTimeout(() => {
        document.querySelector('body').classList.remove('page-transition')
    }, 1001)
}
