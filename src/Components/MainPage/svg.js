import React from 'react';
import * as d3 from 'd3';
import { withFauxDOM } from 'react-faux-dom';

class MyReactComponent extends React.Component {



  componentDidMount() {
    // this.props.onRef(this)
    this.createBarChart();
    this.props.animateFauxDOM(800);

  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    // this.props.onRef(undefined)
  }



  createBarChart() {

    curvy()

    function curvy(url) {

      d3.selectAll("#svg_ref").selectAll(".land").remove();

      let s = 500;            // size
      let step = 100;         // x-axis step
      let range = [-50, 50];  // y-axis range

      // add new svg to document.body with origin at 0  
      let svg = d3
        .selectAll('#svg_ref')
        .insert('svg', '.coverfit + *')
        .attr("class", "land")
        .append('svg')
        .attr('viewBox', `0 0 ${s} ${s}`);

      // interpolation algorithm for points used to form masking shape
      let line = d3
        .line()
        .curve(d3.curveCardinalClosed);

      // random values generator function
      let rnd = d3.randomUniform.apply(0, range);

      // here i place points with fixed `step` by `x` axis  
      // and random value in `range` by `y` axis
      // which forms the "original path"
      let pts = d3.range(-1, s / step + 2).map(i => [i * step, rnd()]);

      // shift points down from "original path", 
      // amount of shift depends from point index 
      let pts1 = pts.map((p, i) => [
        p[0], p[1] + s * 0.3 - i * s * 0.08
      ]);

      // reverse order of original and shift points down on 
      // bigger values, depending from point index
      let pts2 = pts.reverse().map((p, i) => [
        p[0], p[1] + s * 0.8 - i * s * 0.03
      ]);

      // forming single interpolated path for all 
      // points from prev steps concatenated in single array
      let d = line(pts2.concat(pts1));

      // append rect sized as viewport with hole formed by interpolated path
      // with random color from hsl palette and opacity 0.9
      svg.append('path')
        .attr('opacity', 0.9)
        .attr('fill', `hsl(${Math.random() * 255}, 50%, 65%)`)
        .attr('d', `M0,0 v${s} h${s} v${-s} z ${d}`)
    }
  }

  render() {
    return (
      <div></div>
    )
  }
}

// MyReactComponent.defaultProps = {
//   chart: 'loading'
// }

export default withFauxDOM(MyReactComponent)