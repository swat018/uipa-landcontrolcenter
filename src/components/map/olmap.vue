<template>
  <div class="menuBar">
    <table>
      <tr>
        <td width="20px"></td>
        <td>
          <select id="brightSelect" v-model="brightSelected">
            <option value='Day' selected>Day</option>
            <option value='Dusk'>Dusk</option>
            <option value='Night'>Night</option>
            <option value='Black'>Black Theme</option>
          </select>
        </td>
        <td width="5px">
        </td>
        <td>
          <select id="modeSelect" v-model="modeSelected">
            <option value='Base' selected>Base</option>
            <option value='Standard'>Standard</option>
            <option value='Full'>Full</option>
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
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from "ol/control";
import { transform } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import { Style, Icon } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point.js';
import { GeoJSON } from 'ol/format'
import Select from 'ol/interaction/Select'
import emitter from '@/composables/eventbus'


const urlBefore = 'http://navioncorp.asuscomm.com:8080/TileMap/';
const urlAfter = '/{z}/{x}/{-y}.png';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "olmap",
  components: {},
  props: {
  },
  data: () => ({
    baselayers: LayerGroup,
    shipSource: VectorSource,
    shipLayer: VectorLayer,
    layerBright: String,
    layerMode: String,
    mapTypeId: String,
    map: null,
  }),
  computed: {
    brightSelected: {
      set(value) {
        this.setMapType(value, this.layerMode);
        this.layerBright = value;
        return value;
      },
      get() {
        return this.layerBright;
      }
    },
    modeSelected: {
      set(value) {
        this.setMapType(this.layerBright, value);
        this.layerMode = value;
        return value;
      },
      get() {
        return this.layerMode;
      }
    }
  },
  mounted() {
    this.layerBright = 'Day';
    this.layerMode = 'Base';
    this.mapTypeId = 'Day_Base';
    this.baselayers =
      new TileLayer({
        source: new XYZ({
          url: urlBefore + 'Day_Base' + urlAfter
        }),
        name: 'Day_Base',
        visible: true
      })
    this.initMap();
    this.setShipLayer();
    this.$emit('init', this.map);
    this.shipSelectEvent();
  },
  methods: {
    initMap: function() {
      this.map = new Map({
        target: "map",
        layers: [this.baselayers],
        view: new View({
          center: transform([128.100, 36.000], 'EPSG:4326', 'EPSG:3857'),
          //zoom: 12,
          zoom: 7,
          minZoom: 2, // 최소 줌 설정
          constrainResolution: true,
        }),
        controls: defaultControls(),
      });
      return this.map;
    },
    setMapType: function(mapBright, mapMode) {
      this.mapTypeId = mapBright + '_' + mapMode;
      this.map.getLayers().clear();
      this.map.addLayer(
        new TileLayer({
          source: new XYZ({
            url: urlBefore + this.mapTypeId + urlAfter
          }),
          name: this.mapTypeId,
          visible: true,
        })
      );
      this.setShipLayer();
    },
    setShipLayer: function() {
      var pointFeature = new Feature({
        geometry: new Point([Number(129.47939163245047),Number(35.343702931513434)])
      });
      pointFeature.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');

      this.shipLayer = new VectorLayer({
        source: new VectorSource({
          // features: [pointFeature]
          url: 'src/assets/mockup/sship.geojson',
          format: new GeoJSON()
        }),
        style: new Style({
          image: new Icon({
            src: 'src/assets/images/shipicons/shipIcon_green.png',
            scale: 0.3,
            anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: 0
          })
        })
      });
      this.map.addLayer(this.shipLayer);
    },
    shipSelectEvent: function() {
      var select = new Select();
      this.map.addInteraction(select);
      select.on('select', function(e) {
        e.selected[0].setStyle(new Style({
          image: new Icon({
            src: 'src/assets/images/shipicons/shipIcon_red.png',
            scale: 0.3,
            anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: 0
          })
        }));
        emitter.emit('clickShipName', '3242311');
      });
    }

  },
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
   background: #24281c;
}
.menuBar select {
  -webkit-appearance: auto;
}
</style>
