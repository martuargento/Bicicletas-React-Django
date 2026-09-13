import { Link } from 'react-router-dom'

export default function NuestraHistoria() {
  return (
    <div className="pagina-tiempo-real">
      <header className="site-header">
        <div id="logo">
          <Link to="/">
            <img src="/Logoheader.jpg" alt="Logo Bicileal" />
          </Link>
        </div>

        <div className="secciones">
          <ul>
            <li><Link to="/">Productos</Link></li>
            <li className="active"><Link to="/nuestra-historia">Nuestra historia</Link></li>
            <li><Link to="/contactanos">Contáctenos</Link></li>
          </ul>
        </div>

        <div className="redes-principal">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><img src="/icons/instagram.svg" alt="Instagram" /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><img src="/icons/facebook.svg" alt="Facebook" /></a>
        </div>
      </header>

      <section className="content historia-page">
        <h1 className="nuestrahistoriah1">Nuestra Historia</h1>

        <figure>
          <img src="/nuestrahistoria.jpg" alt="Nuestra historia Bicileal" />
        </figure>

        <p className="nuestrahistoriap">
          Nuestra historia comenzó hace más de 20 años, cuando un grupo de amigos apasionados por las bicicletas se unieron para fundar nuestra empresa.
          En aquellos tiempos, el ciclismo estaba empezando a tomar fuerza en nuestro país, y nos dimos cuenta de que había una oportunidad para ofrecer productos de calidad a precios accesibles.
        </p>
        <p className="nuestrahistoriap">
          Nosotros mismos éramos ciclistas apasionados y conocíamos bien las necesidades del mercado. Así que empezamos a diseñar y fabricar nuestras propias bicicletas,
          con el objetivo de ofrecer una alternativa de calidad a las marcas más conocidas; con el tiempo, nuestra empresa fue creciendo y expandiendo su presencia en el mercado.
        </p>
        <p className="nuestrahistoriap">
          Hoy en día, somos una de las mayores distribuidoras de bicicletas del país, ofreciendo una amplia variedad de modelos para todo tipo de ciclistas.
          Pero lo que no ha cambiado a lo largo de todos estos años es nuestro compromiso con la calidad y el servicio al cliente.
        </p>
      </section>
    </div>
  )
}
