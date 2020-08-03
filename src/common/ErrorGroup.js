import React from 'react';
import Errorbar from './Errorbar.js';

/**
 * Represent an error notification group.
 * should be able to get error list (list where each entry is an error string)
 *  via props.errorlist
 */
class ErrorGroup extends React.Component {
  render() {
    const errorList = this.props.errorList;
    // hopefully unique
    let errfragment = errorList.map((lsterrorstr) =>
      <Errorbar key={"key" + lsterrorstr} errorstr={lsterrorstr}/>
    );
    return (
      <>
        {errfragment.length > 0 &&
          <div className="error-grouper">
            {errfragment}
          </div>
        }
      </>
    )
  }
}

export default ErrorGroup;