import React from 'react';

class Form extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(event) {
    this.refs.someName.formValue = '';
    event.preventDefault();
  }


  handleChange(event) {

    this.setState({ formValue: event.target.formValue });
  }

  handleSubmit(event) {
    alert(this.props.formValue);
    event.preventDefault();
  }


  render() {
    return (
      <>
        <form onSubmit={this.props.getAlbums} className="fixed-form" style={{ marginBottom: "2rem" }}>
          <label htmlFor="artistsearch" className="ml-2">Search your Artist</label>
          <input className="form__input w-100" type="text"
            placeholder={this.props.formValue}
            onChange={this.handleChange}
            onClick={this.handleInput.bind(this)}
            ref="someName"
            name="albumName"
            id="artistsearch"
          />
        </form>
      </>
    );
  }

}


export default Form;