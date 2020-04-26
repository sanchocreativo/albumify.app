import React from 'react';
import {  FormGroup, Label, NavbarBrand } from 'reactstrap';
import MyReactComponent from './svg';
import Form from './Form';

const initialState = {
  toptext: "",
  bottomtext: "",
  isTopDragging: false,
  isBottomDragging: false,
  topY: "80%",
  topX: "50%",
  bottomX: "50%",
  bottomY: "90%"
}

class MainPage extends React.Component {

  getAlbums = async (e) => {
    e.preventDefault();
    const albumName = e.target.elements.albumName.value;
    const req = await fetch(`https://cors-anywhere.herokuapp.com/https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${albumName}&api_key=afcfad19fac36b2d66cf2f17e37f66ed&format=json&limit=10`);
    const res = await req.json();
    this.setState({ activeAlbum: res.topalbums.album });
    console.log(this.state.activeAlbum)
  }

  componentDidMount = () => {
    const json = localStorage.getItem("activeAlbum");
    const activeAlbum = JSON.parse(json);
    this.setState({ activeAlbum });
  }
  componentDidUpdate = () => {
    const activeAlbum = JSON.stringify(this.state.activeAlbum);
    localStorage.setItem("activeAlbum", activeAlbum);
  }

  constructor(props) {
    super(props);
    this.MyReactComponent = React.createRef();
    this.state = {
      fontSizefront: 38,
      fontSizeback: 38,
      getAlbums: "",
      activeAlbum: [],
      currentImage: 0,
      modalIsOpen: false,
      currentImagebase64: null,
      formValue: 'Queen',
      ...initialState
    };
    this.convertSvgToImage = this.convertSvgToImage.bind(this.state.formValue)

  }

  incrementScore = (e) => {
    this.setState({ fontSizefront: this.state.fontSizefront + 2 });

  }

  decrementScore = (e) => {
    this.setState({ fontSizefront: this.state.fontSizefront - 2 });

  }

  incrementScoreback = (e) => {
    this.setState({ fontSizeback: this.state.fontSizeback + 2 });

  }

  decrementScoreback = (e) => {
    this.setState({ fontSizeback: this.state.fontSizeback - 2 });

  }


  onClick = () => {
    this.MyReactComponent.createBarChart(); 
  }

  openImage = (index) => {
    const image = this.state.activeAlbum[index];
    const base_image = new Image();
    base_image.setAttribute('crossOrigin', 'anonymous');
    base_image.src = image.image[3]['#text'];
    const base64 = this.getBase64Image(base_image);
    this.setState(prevState => ({
      currentImage: index,
      modalIsOpen: !prevState.modalIsOpen,
      currentImagebase64: base64,
      ...initialState
    }));
  }

  toggle = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen
    }));
  }

  changeText = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  getStateObj = (e, type) => {
    let rect = this.imageRef.getBoundingClientRect();
    const xOffset = e.clientX - rect.left + 20;
    const yOffset = e.clientY - rect.top + 40;
    let stateObj = {};
    if (type === "bottom") {
      stateObj = {
        isBottomDragging: true,
        isTopDragging: false,
        bottomX: `${xOffset}px`,
        bottomY: `${yOffset}px`
      }
    } else if (type === "top") {
      stateObj = {
        isTopDragging: true,
        isBottomDragging: false,
        topX: `${xOffset}px`,
        topY: `${yOffset}px`
      }
    }
    return stateObj;
  }

  handleMouseDown = (e, type) => {
    const stateObj = this.getStateObj(e, type);
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, type));
    this.setState({
      ...stateObj
    })
  }

  handleMouseMove = (e, type) => {
    if (this.state.isTopDragging || this.state.isBottomDragging) {
      let stateObj = {};
      if (type === "bottom" && this.state.isBottomDragging) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && this.state.isTopDragging){
        stateObj = this.getStateObj(e, type);
      }
      this.setState({
        ...stateObj
      });
    }
  };

  handleMouseUp = (event) => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.setState({
      isTopDragging: false,
      isBottomDragging: false
    });
  }

 
convertSvgToImage = () => {

  const GFontToDataURI = (url) => {
    return fetch(url) 
      .then(resp => resp.text()) 
      .then(text => {
        let s = document.createElement('style');
        s.innerHTML = text;
        document.head.appendChild(s);
        let styleSheet = s.sheet
  
        let FontRule = rule => {
          let src = rule.style.getPropertyValue('src') || rule.style.cssText.match(/url\(.*?\)/g)[0];
          if (!src) return null;
          let url = src.split('url(')[1].split(')')[0];
          return {
            rule: rule,
            src: src,
            url: url.replace(/\"/g, '')
          };
        };
        let fontRules = [],
          fontProms = [];
  
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
          let r = styleSheet.cssRules[i];
          let fR = FontRule(r);
          if (!fR) {
            continue;
          }
          fontRules.push(fR);
          fontProms.push(
            fetch(fR.url) // fetch the actual font-file (.woff)
            .then(resp => resp.blob())
            .then(blob => {
              return new Promise(resolve => {
  
                let f = new FileReader();
                f.onload = e => resolve(f.result);
                f.readAsDataURL(blob);
              })
            })
            .then(dataURL => {
            
              return fR.rule.cssText.replace(fR.url, dataURL);
            })
          )
        }
        document.head.removeChild(s); // clean up
        return Promise.all(fontProms); // wait for all this has been done
      });
  }

    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const ctx = canvas.getContext('2d');
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");

    let svgDoc = new DOMParser().parseFromString(svgData, 'image/svg+xml');
    GFontToDataURI('https://fonts.googleapis.com/css?family=Poppins:600')
      .then(cssRules => { // we've got our array with all the cssRules
        let svgNS = "http://www.w3.org/2000/svg";
        let defs = svgDoc.createElementNS(svgNS, 'defs');
        let style = svgDoc.createElementNS(svgNS, 'style');
        style.innerHTML = cssRules.join('\n');
        defs.appendChild(style);
        svgDoc.documentElement.appendChild(defs);
        let str = new XMLSerializer().serializeToString(svgDoc.documentElement);
        let uri = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(str);

         img.onload = function(e) {
          URL.revokeObjectURL(this.src);
          ctx.drawImage(this, 0, 0);
          canvas.getContext("2d").drawImage(img, 0, 0);
          const canvasdata = canvas.toDataURL("image/jpeg");
          const a = document.createElement("a");
          a.download = `album.jpg`;
          a.href = canvasdata;
          document.body.appendChild(a);
          a.click();
        }
        img.src = uri;
        img.setAttribute('crossOrigin', 'anonymous'); 

      })
      .catch(reason => console.log(reason))
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute('crossOrigin', 'anonymous');
    img.setAttribute('crossOrigin', 'anonymous');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
  }

  render() {
    const image = this.state.activeAlbum;
    const base_image = new Image();
    base_image.crossOrigin = "anonymous";  // This enables CORS
    base_image.src = image;
    base_image.setAttribute('crossOrigin', 'anonymous'); 
    var newWidth = "100%";
    var newHeight = "100%";
   
    let textStyle = {
      fontFamily:  "'Poppins'",
      fill: "#FFF",
      userSelect: "none",
      zIndex: '40000000',
      fontWeight:600
    }


    return (
      <React.Fragment>
      <div>
        <div onClick={this.svgFont} className="main-content">
          <div className="sidebar d-flex flex-column">
            <NavbarBrand href="/">Albumify</NavbarBrand>
            <p className="text-center d-block">
              This is a fun project inspired by ReplaceCover.com
            </p>
        
            <p className="text-center d-block">
              <a className=" mt-0 " target="_blank" href={'mailto:hi@santih.me'} > Contact the creator</a>
            </p>
            <div className="row mt-auto text-center">
              <p>
                Created by <a className=" mt-0 white "  target="_blank" href={'//santih.me'} >santih.me </a> MIT Licensed
              </p>
            </div>

          </div>

          <div className="meme-gen-modal mx-auto w-100" >
          <Form 
            getAlbums={this.getAlbums.bind(this)}
            formValue={this.state.formValue}
          /> 

          <h2 className="my-4">
            Choose an Album and Go!
          </h2>

          <div className="pedidosya">
              <svg 
                width={newWidth}
                id="svg_ref"
                ref={el => { this.svgRef = el }}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="svg_container"
                viewBox="0 0 500 500" 
              >

              <foreignObject x={0} y={0} width={newWidth} height={newHeight} >
                <MyReactComponent onRef={ref => (this.MyReactComponent = ref)}  /> 
              </foreignObject>

              <image
                crossOrigin="anonymous"
                ref={el => { this.imageRef = el }}
                xlinkHref={this.state.currentImagebase64}
                height={newHeight}
                width={newWidth}
                preserveAspectRatio="xMidYMid slice"
                className="svg2 coverfit"
              />

              <text
                style={{ ...textStyle, zIndex: this.state.isTopDragging ? 4 : 1, fontSize: this.state.fontSizefront+'px' }}
                x={this.state.topX}
                y={this.state.topY}
                dominantBaseline="middle"
                textAnchor="middle"
                onMouseDown={event => this.handleMouseDown(event, 'top')}
                onMouseUp={event => this.handleMouseUp(event, 'top')}

              >
                  {this.state.toptext}
              </text>
              <text
                style={{ ...textStyle, fontSize: this.state.fontSizeback+'px' }}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.bottomX}
                y={this.state.bottomY}
                onMouseDown={event => this.handleMouseDown(event, 'bottom')}
                onMouseUp={event => this.handleMouseUp(event, 'bottom')}

              >
                  {this.state.bottomtext}
              </text>

            </svg>
            <div className="meme-form mx-auto">
              <div className="d-block">
                <FormGroup>
                  <Label className="d-block" for="toptext">First line of Text</Label>
                    <button className="counter-action decrement" onClick={this.decrementScore}>-</button>
                    <input className="form-control" type="text" name="toptext" id="toptext" onClick={this.props.moveToBack} placeholder="Artist name"  onChange={this.changeText} />
                    <button className="counter-action increment" onClick={this.incrementScore}>+</button>
                </FormGroup>
              </div>
              <FormGroup>
                <Label  for="bottomtext">Second line of Text</Label>
                <div>
                  <button className="counter-action decrement" onClick={this.decrementScoreback}>-</button>
                  <input className="form-control" type="text" name="bottomtext" id="bottomtext" onClick={this.props.moveToBack} placeholder="Album name" onChange={this.changeText} />
                  <button className="counter-action increment" onClick={this.incrementScoreback}>+</button>
                </div>

              
              </FormGroup>
              <button onClick={() => this.convertSvgToImage()} className="btn btn-success mt-3 w-100">Download Album Cover!</button>
            </div>
          </div>

        </div>

          <div className="content">
            
              
              {  this.state.activeAlbum &&  this.state.activeAlbum.map((image, index) => (

              <div className="image-holder" onClick={this.onClick} key={index.src} 
              >
          
                { this.state.activeAlbum.length !== 0 &&
                <img      
                style={{
                  width: "100%",
                  cursor: "pointer",
                  height: "100%"
                }}
                crossOrigin="anonymous"
                alt={image.name} 
                src={image.image[3]['#text']} 
                className="w-100 first-second" 
                onClick={() => this.openImage(index)}
                role="presentation"
                key={index.src}
                title={image.name}
                 /> 
                }

              </div>
            ))}
          </div>
        </div>
      
      </div>
      </React.Fragment>

    )

  }
}

export default MainPage;
