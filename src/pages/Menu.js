import { Component } from "react/cjs/react.production.min";
import { Link } from "react-router-dom";

class Menu extends Component {
    render() {
        return (
            <div>
                <Link to="/metronome">Metronome</Link>
            </div>
        );
    }
}

export default Menu;
