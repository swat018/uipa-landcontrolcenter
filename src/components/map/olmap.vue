<template>
  <div class="menuBar">
    <table>
      <tr>
        <td width="20px"></td>
        <td>
          <select id="brightSelect">
            <option value=1 selected>DAY</option>
            <option value=2>DUSK</option>
            <option value=3>NIGHT</option>
            <option value=4>Black Theme</option>
          </select>
        </td>
        <td width="5px">
        </td>
        <td>
          <select id="modeSelect">
            <option value=1 selected>Base</option>
            <option value=2>Standard</option>
            <option value=3>Full</option>
          </select>
        </td>
      </tr>
    </table>
  </div>
  <div id="map" class="map" ref="rootmap"></div>
</template>

<script>
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, View } from "ol";
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from "ol/source/OSM";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import { transform } from 'ol/proj'
import Collection from 'ol/Collection'
import "./layer.js"

const urlBefore = 'http://navioncorp.asuscomm.com:8080/TileMap/';
const urlAfter = '/{z}/{x}/{-y}.png';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "olmap",
  components: {},
  props: {
    center: {
      type: Array,
      default: () => ([0,0])
    },
    zoom: {
      type: Number,
      default: 0
    },
    // baselayers: LayerGroup,
    controls: Collection,
    interactions: Collection,
  },
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap();
    this.$emit('init', this.map);
  },
  methods: {
    initMap: function() {
      //const mapcontainer = this.$refs.rootmap;
      const map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new XYZ({
              url: urlBefore + 'Day_Base' + urlAfter
            }),
            name: 'Day_Base',
            visible: true
          })
      ],
        view: new View({
          center: transform([128.100, 36.000], 'EPSG:4326', 'EPSG:3857'),
          //zoom: 12,
          zoom: 7,
          minZoom: 2, // 최소 줌 설정
          constrainResolution: true,
        }),
        controls: this.controls,
      });

      return map;
    },
  }
};
</script>

<style scoped>
#map {
  position: fixed;
  width: 100%;
  height: 100%;
}
.menuBar {
   width: 100%;
   height: 30px;
   background-color: #24281c;
}
.menuBar select {
  -webkit-appearance: auto;
}
</style>
