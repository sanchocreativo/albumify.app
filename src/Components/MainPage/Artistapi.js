import React, { Component } from 'react';

// const API_KEY = "afcfad19fac36b2d66cf2f17e37f66ed";
// const SHARED_SECRET = "9b3e2946b4255992627f9f144e25256d";


  export class Artistapi2 extends Component {

    state = {
      activeRecipe: []
    }
  
    componentDidMount = async () => {
      // const title = this.props.location.state.albumapi;
      const req = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=cher&api_key=afcfad19fac36b2d66cf2f17e37f66ed&format=json`);
      const res = await req.json();
      this.setState({ activeRecipe: res.topalbums.album });
      console.log(this.state.activeRecipe);
    }

    render() {

      return (
        this.state.activeRecipe.map((albumimage) => {
          return (
            <React.Fragment>
                { this.state.activeRecipe.length !== 0 &&
                     <img src={albumimage.image[2]['#text']} className="w-50" alt={albumimage.name} key={albumimage.mbid} /> 
                }
            </React.Fragment>
          );
        })
      );

    }
  }


  export default Artistapi2;
