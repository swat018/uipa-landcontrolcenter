<template>
  <div class="menuBar">
    <table class="menuTable">
      <tr>
        <td width="20px"></td>
        <td>
          <select id="brightSelect" v-model="brightSelected" style='background-color: black; color: white'>
            <option value='Day' selected>Day</option>
            <option value='Dusk'>Dusk</option>
            <option value='Night'>Night</option>
            <option value='Black'>Black Theme</option>
          </select>
        </td>
        <td width="5px">
        </td>
        <td>
          <select id="modeSelect" v-model="modeSelected" style='background-color: black; color: white'>
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
import { getShipData } from '@/api/worldMap.js'
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, View } from "ol";
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from 'ol/control'
import { transform } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import { Style, Icon } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point.js';
import { GeoJSON } from 'ol/format'
import Select from 'ol/interaction/Select'
import emitter from '@/composables/eventbus'
import { TileWMS } from 'ol/source'


const urlBefore = 'http://navioncorp.asuscomm.com:8080/TileMap/';
const urlAfter = '/{z}/{x}/{-y}.png';

export default {
  name: "olmap",
  components: {},
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
    },
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
        controls: defaultControls({
          attribution: false,
          zoom: false,
          rotate: false,
        }),
      });
      return this.map;
    },
    setMapType: function(mapBright, mapMode) {
      var geoserverWmsUrl = "http://navioncorp.asuscomm.com:8089/geoserver/wms";

      if (mapBright !== 'Black') {
        this.map.getLayers().clear();
        this.map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: urlBefore + mapBright + '_' + mapMode + urlAfter
            }),
            name: mapBright + '_' + mapMode,
            visible: true,
          })
        );
      }
      else if (mapBright === 'Black') {
        this.map.getLayers().clear();
        this.map.addLayer(
          new TileLayer({
            id : 'ocean',
            title: 'ocean',
            opacity: 1,
            zIndex: -1,
            source: new TileWMS({
              url: geoserverWmsUrl,
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              params: {
                'VERSION': '1.1.0' ,
                'LAYERS': 'emap:ocean',
                'CRS' : 'EPSG:3857',
                //'CRS' : 'EPSG:404000',
              },
            })
          })
        );
        this.makeSld("ocean", "Polygon1_1", "17284F", null);
        this.map.addLayer(
          new TileLayer({
            id : 'worldcountries',
            title: 'worldcountries',
            opacity: 1,
            zIndex: -1,
            source: new TileWMS({
              url: geoserverWmsUrl,
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              params: {
                'VERSION': '1.1.0' ,
                'LAYERS': 'emap:worldcountries',
                'CRS' : 'EPSG:3857',
              },
            })
          })
        );
        this.makeSld("worldcountries", "Polygon1_2", "1E1E1E", null);
      }
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
          url:  import.meta.env.DEV ? 'src/assets/mockup/sship.geojson' : '/assets/mockup/sship.geojson',
          format: new GeoJSON()
        }),
        style: new Style({
          image: new Icon({
            src:import.meta.env.DEV ? 'src/assets/images/shipicons/shipIcon_green.png' : '/assets/images/shipicons/shipIcon_green.png',
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
            src: import.meta.env.DEV ? 'src/assets/images/shipicons/shipIcon_red.png' : '/assets/images/shipicons/shipIcon_green.png',
            scale: 0.3,
            anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: 0
          })
        }));
        emitter.emit('clickShipName', '9876543');
      });
    },
    makeSld: function(lynm, type, color1, color2) {
      var text_SLD = "\
					<?xml version='1.0' encoding='UTF-8'?>\
					<StyledLayerDescriptor version='1.0.0' \
					 xsi:schemaLocation='http://www.opengis.net/sld StyledLayerDescriptor.xsd' \
					 xmlns='http://www.opengis.net/sld' \
					 xmlns:ogc='http://www.opengis.net/ogc' \
					 xmlns:xlink='http://www.w3.org/1999/xlink' \
					 xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>\
					  <NamedLayer>\
					    <Name>emap:" + lynm + "</Name>\
					    <UserStyle>\
					      <Title>Default Polygon</Title>\
					      <Abstract>A sample style that draws a polygon</Abstract>\
					      <FeatureTypeStyle>\
					        <Rule>\
					"

      if(type == "Polygon1") {
        text_SLD += "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" + color1 + "</CssParameter>\
					            </Fill>\
					          </PolygonSymbolizer>\
					"
      } else if(type == "Polygon1_1") { // 경도 경계에 흰색 선 생기는 것 방지 : 테두리를 최소화하고 색상 동일화
        text_SLD += "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" + color1 + "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" + color1 + "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					"
      } else if(type == "Polygon1_2") { // 경도 경계에 흰색 선 생기는 것 방지 : 테두리를 최소화하고 색상 동일화
        text_SLD += "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" + color1 + "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#6689CA</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					"
      } else if(type == "Polygon2") {
        text_SLD += "\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" + color1 + "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" + color1 + "</CssParameter>\
					              <CssParameter name='stroke-width'>0</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					        </Rule>\
							<Rule>\
					          <Title>0to20</Title>\
					          <ogc:Filter>\
					            <ogc:And>\
					              <ogc:PropertyIsGreaterThanOrEqualTo>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>0</ogc:Literal>\
					              </ogc:PropertyIsGreaterThanOrEqualTo>\
					              <ogc:PropertyIsLessThan>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>20</ogc:Literal>\
					              </ogc:PropertyIsLessThan>\
					            </ogc:And>\
					          </ogc:Filter>\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" + color1 + "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" + color1 + "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					        </Rule>\
					        <Rule>\
					          <Title>20to100</Title>\
					          <ogc:Filter>\
					            <ogc:And>\
					              <ogc:PropertyIsGreaterThanOrEqualTo>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>20</ogc:Literal>\
					              </ogc:PropertyIsGreaterThanOrEqualTo>\
					              <ogc:PropertyIsLessThan>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>100</ogc:Literal>\
					              </ogc:PropertyIsLessThan>\
					            </ogc:And>\
					          </ogc:Filter>\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" + color2 + "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" + color2 + "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					        </Rule>\
					        <Rule>\
					          <Title>100great</Title>\
					          <ogc:Filter>\
					              <ogc:PropertyIsGreaterThanOrEqualTo>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>100</ogc:Literal>\
					              </ogc:PropertyIsGreaterThanOrEqualTo>\
					          </ogc:Filter>\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" + color2 + "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" + color2 + "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					"
      }

      text_SLD += "\
				        </Rule>\
				      </FeatureTypeStyle>\
				    </UserStyle>\
				  </NamedLayer>\
				</StyledLayerDescriptor>\
				"

      var source = this.getLayer(lynm).getSource();
      //var source = getLayerGroup(lynm).getSource();
      source.updateParams({ 'STYLES': '' ,'SLD_BODY': text_SLD });
    },
    getLayer: function(id) {
      let lyr=null;
      var layers = this.map.getLayers().getArray();
      for(let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if(id === thisLayerId) {
          lyr = l;
          break;
        }
      }
      return lyr;
    },
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
  height: 25px;
  background: #82837f96;
}
.menuBar select {
  -webkit-appearance: listbox;
  border-style: solid;
  background: #82837f96;
}
.menuBar select option {
  background: #82837f96;
}
.menuTable {
  display: inline-block;
  float: right;
  margin-right: 1em;
}
</style>
