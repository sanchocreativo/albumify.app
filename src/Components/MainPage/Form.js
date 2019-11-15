import React from 'react';

class Form extends React.Component {

    constructor(props) {
      super(props);
      this.state = {value: 'Queen'};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(event) {
      this.refs.someName.value = '';
      event.preventDefault();

    }


     handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
      alert(this.state.value);
      event.preventDefault();
    }


    render() {
      return (
      <React.Fragment>
        <form onSubmit={this.props.getRecipe} className="fixed-form" style={{ marginBottom:"2rem" }}>

          <label htmlFor="artistsearch" className="ml-2">Search your Artist</label>

          <input className="form__input w-100" type="text"  
          value={this.state.value}  
          onChange={this.handleChange} 
          onClick={this.handleInput.bind(this)} 
          ref="someName"
          name="recipeName"
          id="artistsearch"
          />

        </form>
      </React.Fragment>
    );
  }

}


export default Form;