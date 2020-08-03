import React from 'react';
import '../style/commondraw.css';

/**
 * Represent a single error notification.
 * should be able to get error via props.errorstr
 */
class Errorbar extends React.Component {
  render() {
    const errorstring = this.props.errorstr;
    return (
      <>
        {errorstring &&
          <div className="error-inform">{errorstring}</div>
        }
      </>
    )
  }
}

export default Errorbar;