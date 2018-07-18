import React from 'react'
import './Modal.css';

class Modal extends React.Component {
	render() {
		let {show, text} = this.props;

		if (!show) {
			return null;
		}
        
        return (
        	<div className="modal-bg">
        	  <div className="modal">
        	    {this.props.children}
        	    <div className="footer">
        	      <button onClick={() => this.props.onClose()}> {text} </button>
        	    </div>
        	  </div>
        	</div>
        );

	}
}

export default Modal;