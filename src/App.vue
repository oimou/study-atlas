<template>
  <div id="app">
    <p v-if="loading">Now Loading...</p>
    <p v-if="!loading">
      ドラッグで表示範囲の移動。ノードをクリックすると関連ノードがハイライトされます
    </p>

    <div id="graph"></div>
  </div>
</template>

<script>
/*global d3*/

import dotSrcOrig from "raw-loader!./data/math.dot";

export default {
  name: "App",

  data () {
    return {
      loading: true
    }
  },

  mounted() {
    const graphviz = d3.select("#graph").graphviz()
    const graphNodes = {}
    const graphEdges = {}

    let dotSrcLines = dotSrcOrig.split("\n").map(l => {
      if (l.includes(" -- ")) {
        return l + " [color=black]"
      } else {
        return l
      }
    })
    let dotSrc = dotSrcLines.join("\n");

    graphviz
      .renderDot(dotSrc)
      .on("end", () => {
        this.loading = false

        d3.selectAll(".node").each(function () {
          d3.select(this).selectAll("ellipse,polygon")
            .style("fill", "white")

          var title = d3.select(this).selectAll("title").text().trim();
          var id = d3.select(this).attr("id");

          graphNodes[title] = {
            id,
            edges: []
          }
        })

        d3.selectAll(".edge").each(function () {
          var title = d3.select(this).selectAll("title").text().trim();
          var id = d3.select(this).attr("id");
          var from = title.match(/^(.+)--/)[1]
          // eslint-disable-next-line no-useless-escape
          var to = title.match(/^.+--(.+)(?:\[|$)/)[1]

          graphNodes[from].edges.push(title)
          graphNodes[to].edges.push(title)

          graphEdges[title] = {
            id,
            from,
            to
          }
        })

        d3.selectAll(".node").on("click", function () {
          var title = d3.select(this).selectAll("title").text().trim();
          var id = d3.select(this).attr("id");

          console.log(
            'Element id="%s" title="%s"',
            id,
            title,
          );

          // reset color
          d3.selectAll(".node").selectAll("ellipse,polygon")
            .style("fill", "white")
            .style("stroke", "#ccc")
          d3.selectAll(".node").selectAll("text")
            .style("fill", "#ccc")
          d3.selectAll(".edge").selectAll("path")
            .style("stroke", "#ccc")

          graphNodes[title].edges.forEach(edgeTitle => {
            const e = graphEdges[edgeTitle]

            d3.select("#" + e.id).selectAll("path")
              .style("stroke", "red")

            const from = d3.select("#" + graphNodes[e.from].id)

            from.selectAll("text")
              .style("fill", "black")
            from.selectAll("ellipse,polygon")
              .style("fill", "#ff9f00")
              .style("stroke", "black")

            const to = d3.select("#" + graphNodes[e.to].id)

            to.selectAll("text")
              .style("fill", "black")
            to.selectAll("ellipse,polygon")
              .style("fill", "#ff9f00")
              .style("stroke", "black")
          })

          // set color of this node
          d3.select(this).selectAll("ellipse,polygon")
            .style("fill", "#cc0000")
        });
      });
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#graph {
  border: 3px solid #ccc;
  overflow: hidden;
}
</style>
