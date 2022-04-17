import React, {useEffect, useState, useRef} from 'react';
import { FormGroup, Label, NavbarBrand } from 'reactstrap';
import MyReactComponent from './svg';
import Form from './Form';

function MainPage(props) {


  const getAlbums = async (e) => {
    let albumName = "";
    if (e) {
      e.preventDefault();
      albumName = e.target.elements.albumName.value
    }

    const req = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${albumName ? albumName : formValue}&api_key=afcfad19fac36b2d66cf2f17e37f66ed&format=json&limit=10`);
    const res = await req.json();
    setActiveAlbum(res.topalbums.album);
  }
  const imageRef = useRef();
  const svgRef = useRef();
  const MyReactComponent2 = useRef();
  const [toptext, setTopText] = useState("Queen");
  const [bottomtext, setBottomText] = useState("Best Hits");
  const [isTopDragging, setIsTopDragging] = useState(false);
  const [isBottomDragging, setIsBottomDragging] = useState(false);
  const [topY, setTopY] = useState("80%");
  const [topX, setTopX] = useState("50%");
  const [bottomX, setBottomX] = useState("50%");
  const [bottomY, setBottomY] = useState("90%");
  const [fontSizefront, setFontSizefront] = useState(38);
  const [fontSizeback, setFontSizeback] = useState(38);
  const [activeAlbum, setActiveAlbum] = useState([]);
  const [dataUrl, setDataUrl] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImagebase64, setcurrentImagebase64] = useState(null);
  const formValue = "Queen";

  useEffect(() => {
    getAlbums(null);
    const json = localStorage.getItem("activeAlbum");
    const activeAlbum = JSON.parse(json);
    setActiveAlbum(activeAlbum)
  }, []);

  useEffect(() => {
    setcurrentImagebase64(dataUrl);
  }, [dataUrl]);

  // useEffect(() => {
  //   const activeAlbum = JSON.stringify(activeAlbum);
  //   localStorage.setItem("activeAlbum", activeAlbum);
  // }, [activeAlbum]);


  const incrementScore = (e) => {
    setFontSizefront( fontSizefront + 2 );

  }

  const decrementScore = (e) => {
    setFontSizefront(  fontSizefront - 2 );
  }

  const incrementScoreback = (e) => {
     setFontSizeback( fontSizeback + 2 );
  }

  const decrementScoreback = (e) => {
     setFontSizeback( fontSizeback - 2 );
  }


  const createBarChart = () => {
    MyReactComponent.createBarChart();
  }

  const openImage = (index) => {
    const image = activeAlbum[index];
    const base_image = new Image();
    base_image.setAttribute('crossOrigin', 'anonymous');
    base_image.src = image.image[3]['#text'];
    
    base_image.onload = function() {
       setDataUrl(getBase64Image(base_image));
    }
    setModalIsOpen(!modalIsOpen);
    
  }


  const changeTopText = (event) => {
     setTopText(event.currentTarget.value);
  }

  const changeBottomText = (event) => {
    setBottomText(event.currentTarget.value);
  }

  const getStateObj = (e, type) => {
    let rect = imageRef.getBoundingClientRect();
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


  const switchMovements = (stateObj) => {
    switch (stateObj) {
      case isBottomDragging:
        setIsBottomDragging(isBottomDragging)
        break;
      case isTopDragging:
        setIsTopDragging(isTopDragging)
        break;
      case topX:
        setTopX(topX)
        break;
      case topY:
        setTopY(topY)
        break;
      case bottomX:
        setBottomX(bottomX)
        break;
      case bottomY:
        setBottomY(bottomY)
        break;
      default:
        break;
    }
  }
  const handleMouseDown = (e, type) => {
    const stateObj = getStateObj(e, type);
    document.addEventListener('mousemove', (event) => handleMouseMove(event, type));
    switchMovements(stateObj)

  }

  const handleMouseMove = (e, type) => {
    if (isTopDragging || isBottomDragging) {
      let stateObj = {};
      if (type === "bottom" && isBottomDragging) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && isTopDragging) {
        stateObj = this.getStateObj(e, type);
      }
      switchMovements(stateObj)
    }
  };

  const handleMouseUp = (event) => {
    document.removeEventListener('mousemove', handleMouseMove);
    setIsTopDragging(false);
    setIsBottomDragging(false);
  }


  const convertSvgToImage = () => {

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
              url: url.replace(/"/g, '')
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

    const svg = svgRef;
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

        img.onload = function (e) {
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

  const getBase64Image = (img) => {
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


  const image = activeAlbum;
  const base_image = new Image();
  base_image.crossOrigin = "anonymous";  // This enables CORS
  base_image.src = image;
  base_image.setAttribute('crossOrigin', 'anonymous');
  var newWidth = "100%";
  var newHeight = "100%";

  let textStyle = {
    fontFamily: "'Poppins'",
    fill: "#FFF",
    userSelect: "none",
    zIndex: '40000000',
    fontWeight: 600
  }


  return (
    <React.Fragment>
      <div>
        <div  className="main-content">
          <div className="sidebar d-flex flex-column">
            <NavbarBrand href="/">Albumify</NavbarBrand>
            <p className="text-center d-block">
              This is a fun project inspired by ReplaceCover.com
            </p>

            <p className="text-center d-block">
              <a className=" mt-0 " target="_blank" rel="noopener noreferrer" href={'mailto:hi@santih.me'} > Contact the creator</a>
            </p>
            <div className="row mt-auto text-center">
              <p>
                Created by <a className=" mt-0 white " rel="noopener noreferrer" target="_blank" href={'//santih.me'} >santih.me </a> MIT Licensed
              </p>
            </div>

          </div>

          <div className="meme-gen-modal mx-auto w-100" >
            <Form
              getAlbums={getAlbums.bind(this)}
              formValue={formValue}
            />

            <h2 className="my-4">
              Choose an Album and Go!
            </h2>

            <div className="pedidosya">
              <svg
                width={newWidth}
                id="svg_ref"
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="svg_container"
                viewBox="0 0 500 500"
              >

                <foreignObject x={0} y={0} width={newWidth} height={newHeight} >
                  <MyReactComponent onRef={() => MyReactComponent2} />
                </foreignObject>

                <image
                  crossOrigin="anonymous"
                  ref={imageRef}
                  xlinkHref={currentImagebase64}
                  height={newHeight}
                  width={newWidth}
                  preserveAspectRatio="xMidYMid slice"
                  className="svg2 coverfit"
                />

                <text
                  style={{ ...textStyle, zIndex: isTopDragging ? 4 : 1, fontSize: fontSizefront + 'px' }}
                  x={topX}
                  y={topY}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  onMouseDown={event => handleMouseDown(event, 'top')}
                  onMouseUp={event => handleMouseUp(event, 'top')}

                >
                  {toptext}
                </text>
                <text
                  style={{ ...textStyle, fontSize: fontSizeback + 'px' }}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  x={bottomX}
                  y={bottomY}
                  onMouseDown={event => handleMouseDown(event, 'bottom')}
                  onMouseUp={event => handleMouseUp(event, 'bottom')}

                >
                  {bottomtext}
                </text>

              </svg>
              <div className="meme-form mx-auto">
                <div className="d-block">
                  <FormGroup>
                    <Label className="d-block" for="toptext">First line of Text</Label>
                    <button className="counter-action decrement" onClick={decrementScore}>-</button>
                    <input className="form-control" type="text" name="toptext" id="toptext" onClick={props.moveToBack} placeholder="Artist name" onChange={changeTopText} />
                    <button className="counter-action increment" onClick={incrementScore}>+</button>
                  </FormGroup>
                </div>
                <FormGroup>
                  <Label for="bottomtext">Second line of Text</Label>
                  <div>
                    <button className="counter-action decrement" onClick={decrementScoreback}>-</button>
                    <input className="form-control" type="text" name="bottomtext" id="bottomtext" onClick={props.moveToBack} placeholder="Album name" onChange={changeBottomText} />
                    <button className="counter-action increment" onClick={incrementScoreback}>+</button>
                  </div>


                </FormGroup>
                <button onClick={() => convertSvgToImage()} className="btn btn-success mt-3 w-100">Download Album Cover!</button>
              </div>
            </div>

          </div>

          <div className="content">
            {activeAlbum && activeAlbum.map((image, index) => (
              <div className="image-holder" onClick={() => createBarChart} key={`${index}`}
              >
                {activeAlbum.length !== 0 &&
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
                    onClick={() => openImage(index)}
                    role="presentation"
                    key={index}
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

export default MainPage;
