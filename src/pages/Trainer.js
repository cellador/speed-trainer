import { Component } from "react/cjs/react.production.min";
import { Link } from "react-router-dom";

import { withRouter, neutralizeBack, restoreBack } from '../components/HistoryManager';

class Menu extends Component {
  componentDidMount() {
    neutralizeBack(() => {this.props.router.navigate("/")});
  }

  componentWillUnmount() {
    restoreBack();
  }

  render() {
    return (
      <div>
        <button onClick={ () => this.props.router.navigate("/") }>Back</button>
      </div>
    );
  }
}

export default withRouter(Menu);
