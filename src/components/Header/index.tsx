import './Header.css'
import publitasLogo from '../../assets/logo-publitas.png'

const Header = () => {
    return (
        <header>
            <img className="logo" src={publitasLogo} alt="Publitas" />
            <small>Frontend Challenge</small>
        </header>
    )
}

export default Header