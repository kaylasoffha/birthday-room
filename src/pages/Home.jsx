import {Link} from 'react-router'

function Home() {
    return (
        <div>
            <h1>Birthday Room</h1>
            <Link to="/cake">Decor your cake</Link>
            <br />
            <Link to="/letter">Make a wish</Link>
            <br />
            <Link to="/photobooth">Say cheese!</Link>
        </div>
    )
}

export default Home