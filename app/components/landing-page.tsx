import { Link } from '@remix-run/react'

export default function LandingPage() {
  return (
    <article>
      <h1>Welcome to My Bank</h1>
      <Link to='/auth/login'>Login</Link>
      <p>
        {' '}
        Put lots of Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Soluta sit cumque ipsum minus sequi, maxime accusamus similique,
        consequuntur enim iure officia officiis eius in minima aspernatur
        expedita blanditiis vero optio. ipsum dolor sit amet, consectetur
        adipisicing elit. Soluta sit cumque ipsum minus sequi, maxime accusamus
        similique, consequuntur enim iure officia officiis eius in minima
        aspernatur expedita blanditiis vero optio. dolor sit amet, consectetur
        adipisicing elit. Soluta sit cumque ipsum minus sequi, maxime accusamus
        similique, consequuntur enim iure officia officiis eius in minima
        aspernatur expedita blanditiis vero optio.
      </p>
      <p>
        eius in ipsum dolor sit amet, consectetur adipisicing elit. Soluta sit
        cumque ipsum minus sequi, maxime accusamus similique, consequuntur enim
        iure officia officiis eius in minima aspernatur expedita blanditiis vero
        optio.
      </p>
    </article>
  )
}
