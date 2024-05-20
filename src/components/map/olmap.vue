<template>
  <div class="menuBar" style="background-color:#b1b1b180">
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
import { Map, View } from "ol";
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from 'ol/control'
import { transform } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import { Style, Icon, Fill, Stroke, Circle, RegularShape } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point.js';
import Select from 'ol/interaction/Select'
import emitter from '@/composables/eventbus'
import { TileWMS } from 'ol/source'
import { useMapStore } from '@/stores/mapStore'
import { getShipData, getShipWakeCurrent, getShipWakePast } from '@/api/worldMap'
import { getAisData } from '@/api/aisData'
import { storeToRefs } from 'pinia'
import { singleClick } from 'ol/events/condition'


// const urlBefore = 'http://navioncorp.asuscomm.com:8080/TileMap/'
// const urlAfter = '/{z}/{x}/{-y}.png?v='+ Math.random();
const urlBefore = import.meta.env.VITE_TILE_MAP_URL + '/';
const urlAfter = '/{z}/{x}/{-y}.png';

export default {
  name: "olmap",
  data: () => ({
    baselayers: LayerGroup,
    shipSource: VectorSource,
    shipLayer: VectorLayer,
    shipWakeLayer: VectorLayer,
    shipPastWakeLayer: VectorLayer,
    aisAtonLayer: VectorLayer,
    aisBasestationLayer: VectorLayer,
    aisClassLayer: VectorLayer,
    layerBright: String,
    layerMode: String,
    mapTypeId: String,
    map: null,
    imoNumbers: [],
    isClick: false,
  }),
  props: ['propsdata', 'isShow', 'vesselTrack', 'startDate', 'endDate', 'isPastVesselTracks' ],
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
  watch: {
    propsdata: function() {
      this.imoNumbers = this.propsdata;
      this.setShipLayer();
    },
    isShow: function() {
      this.shipSelectEvent();
    },
    vesselTrack: function() {
      this.vesselTrackCurrent();
    },
    isPastVesselTracks: function() {
      this.vesselTrackCurrent();
    }

  },
  mounted: async function() {
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
    this.$emit('init', this.map);
    this.shipSelectEvent();
    this.vesselTrackCurrent();
    this.vesselTrackPast();
    this.aisData();
  },
  methods: {
    initMap: function() {
      this.map = new Map({
        target: "map",
        layers: [this.baselayers],
        view: new View({
          center: transform([128.100, 36.000], 'EPSG:4326', 'EPSG:3857'),
          zoom: 2,
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
      } else if (mapBright === 'Black') {
        this.map.getLayers().clear();
        this.map.addLayer(
          new TileLayer({
            id: 'ocean',
            title: 'ocean',
            opacity: 1,
            zIndex: -1,
            source: new TileWMS({
              url: geoserverWmsUrl,
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              params: {
                'VERSION': '1.1.0',
                'LAYERS': 'emap:ocean',
                'CRS': 'EPSG:3857',
                //'CRS' : 'EPSG:404000',
              },
            })
          })
        );
        this.makeSld("ocean", "Polygon1_1", "17284F", null);
        this.map.addLayer(
          new TileLayer({
            id: 'worldcountries',
            title: 'worldcountries',
            opacity: 1,
            zIndex: -1,
            source: new TileWMS({
              url: geoserverWmsUrl,
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              params: {
                'VERSION': '1.1.0',
                'LAYERS': 'emap:worldcountries',
                'CRS': 'EPSG:3857',
              },
            })
          })
        );
        this.makeSld("worldcountries", "Polygon1_2", "1E1E1E", null);
      }
      this.setShipLayer();
      this.aisData();
    },
    setShipLayer: function() {
      this.map.removeLayer(this.shipLayer);
      var temp;
      if (this.propsdata.length !== 0) {
        this.propsdata.forEach((imoNumber) => {
          if (temp !== undefined) temp = temp + ',' + imoNumber;
          else temp = imoNumber;
        });
        this.shipData(temp);
      }
    },
    shipSelectEvent: function() {
      this.isClick = !this.isClick;
      if (this.isClick) {
        var select = new Select({
            condition: singleClick
          }
        );
        this.map.addInteraction(select);
        select.on('select', function(e) {
          e.selected[0].setStyle(new Style({
            image: new Icon({
              src: import.meta.env.DEV ? 'src/assets/images/shipicons/shipIcon_red.png' : '/assets/images/shipicons/shipIcon_red.png',
              scale: 0.3,
              anchor: [0.5, 0.5],
            })
          }));
          emitter.emit('clickShipName', e.selected[0].values_.name);
        });
      }
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

      if (type == "Polygon1") {
        text_SLD += "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" + color1 + "</CssParameter>\
					            </Fill>\
					          </PolygonSymbolizer>\
					"
      } else if (type == "Polygon1_1") { // 경도 경계에 흰색 선 생기는 것 방지 : 테두리를 최소화하고 색상 동일화
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
      } else if (type == "Polygon1_2") { // 경도 경계에 흰색 선 생기는 것 방지 : 테두리를 최소화하고 색상 동일화
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
      } else if (type == "Polygon2") {
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
      source.updateParams({ 'STYLES': '', 'SLD_BODY': text_SLD });
    },
    getLayer: function(id) {
      let lyr = null;
      var layers = this.map.getLayers().getArray();
      for (let i in layers) {
        const l = layers[i];
        const thisLayerId = layers[i].get('id');

        if (id === thisLayerId) {
          lyr = l;
          break;
        }
      }
      return lyr;
    },
    shipData: async function(imoNumbers) {
      const mapStore = useMapStore();
      await mapStore.fetchShipData(imoNumbers);
      getShipData(imoNumbers).then((response) => {
        if (response.data.data.length === 0) return;
        var shipDataList = response.data.data;

        shipDataList.forEach((shipData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
            name: shipData.imoNumber,
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.shipLayer = new VectorLayer({
            source: new VectorSource({
              features: [pointFeature]
              // url: import.meta.env.DEV ? 'src/assets/mockup/sship.geojson' : '/assets/mockup/sship.geojson',
              // format: new GeoJSON()
            }),
            style: new Style({
              image: new Icon({
                src: import.meta.env.DEV ? 'src/assets/images/shipicons/shipIcon_green.png' : '/assets/images/shipicons/shipIcon_green.png',
                scale: 0.3,
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: shipData.course
              })
            })
          });
          this.map.addLayer(this.shipLayer);
        })
      });
    },
    vesselTrackCurrent: function() {
      const mapStore = useMapStore();
      const { clickedShipInfo, vesselTrackStatus } = storeToRefs(mapStore);

      if (vesselTrackStatus._value) {
        console.log('clickedShipInfo', clickedShipInfo.value.imoNumber);
        getShipWakeCurrent(clickedShipInfo.value.imoNumber).then((response) => {
          var shipWakeList = response.data.data;
          console.log(shipWakeList);
          shipWakeList.forEach((shipData) => {
            var pointFeature = new Feature({
              geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
              name: shipData.imoNumber,
              label: shipData.time
            });
            pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

            this.shipWakeLayer = new VectorLayer({
              source: new VectorSource({
                features: [pointFeature]
              }),
              // style: new Style({
              //   text: new Text({
              //     font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
              //     placement: 'line',
              //     fill: new Fill({
              //       color: 'white'
              //     })
              //   })
              // })
            });
            this.map.addLayer(this.shipWakeLayer);
          })
        });
      } else {
        this.map.removeLayer(this.shipWakeLayer);
      }
    },
    vesselTrackPast: function() {
      const mapStore = useMapStore();
      const { clickedShipInfo, vesselTrackStatus, startDate, endDate } = storeToRefs(mapStore);

      const startDateTime = startDate._value + ' ' + '16:00';
      const endDateTime = endDate._value + ' ' + '18:00';

      console.log(startDateTime);
      console.log(endDateTime);

      // if(vesselTrackStatus._value) {
      //   console.log('clickedShipInfo', clickedShipInfo.value.imoNumber);
      //   getShipWakePast(clickedShipInfo.value.imoNumber).then((response) => {
      //     var shipWakeList = response.data.data;
      //     console.log(shipWakeList);
      //     shipWakeList.forEach((shipData) => {
      //       var pointFeature = new Feature({
      //         geometry: new Point([Number(shipData.longitude),Number(shipData.latitude)]),
      //         name: shipData.imoNumber,
      //         label: shipData.time
      //       });
      //       pointFeature.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
      //
      //       this.shipWakeLayer = new VectorLayer({
      //         source: new VectorSource({
      //           features: [pointFeature]
      //         }),
      //         // style: new Style({
      //         //   text: new Text({
      //         //     font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
      //         //     placement: 'line',
      //         //     fill: new Fill({
      //         //       color: 'white'
      //         //     })
      //         //   })
      //         // })
      //       });
      //       this.map.addLayer(this.shipWakeLayer);
      //     })
      //   });
      // } else {
      //   this.map.removeLayer(this.shipWakeLayer);
      // }
    },
    aisData: function() {
      getAisData().then((data) => {
        let aisAton = data.ais_aton[0];
        let ais_basestation = data.ais_basestation[0];
        let ais_class_a = data.ais_class_a[0];
        let ais_class_b = data.ais_class_b[0];
        let vpass_class_b = data.vpass_class_a[0];
        let stroke = new Stroke({color: 'black', width: 2});
        let fill = new Fill({color: 'red'});
        aisAton.forEach((aisAtonData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(aisAtonData.longitude), Number(aisAtonData.latitude)])
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.aisAtonLayer = new VectorLayer({
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 4,
                radius: 10,
                angle: 0,
              }),
            })
          });
          this.map.addLayer(this.aisAtonLayer);
        })

        fill = new Fill({color: 'blue'});
        ais_basestation.forEach((aisBaseData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(aisBaseData.longitude), Number(aisBaseData.latitude)])
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.aisBasestationLayer = new VectorLayer({
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 4,
                radius: 10,
                angle: Math.PI / 4,
              }),
            })
          });
          this.map.addLayer(this.aisBasestationLayer);
        })

        fill = new Fill({color: 'yellow'});
        ais_class_a.forEach((aisClassAData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(aisClassAData.longitude), Number(aisClassAData.latitude)])
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.aisClassLayer = new VectorLayer({
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 3,
                radius: 8,
                rotation: aisClassAData.heading,
                angle: 5,
              }),
            })
          });
          this.map.addLayer(this.aisClassLayer);
        })
        ais_class_b.forEach((aisClassBData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(aisClassBData.longitude), Number(aisClassBData.latitude)])
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.aisClassLayer = new VectorLayer({
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 3,
                radius: 8,
                rotation: aisClassBData.heading,
                angle: 5,
              }),
            })
          });
          this.map.addLayer(this.aisClassLayer);
        })
        vpass_class_b.forEach((vpassClassBData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(vpassClassBData.longitude), Number(vpassClassBData.latitude)])
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.aisClassLayer = new VectorLayer({
            source: new VectorSource({
              features: [pointFeature]
            }),
            style:  new Style({
              image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 3,
                radius: 8,
                rotation: vpassClassBData.heading,
                angle: 5,
              }),
            })
          });
          this.map.addLayer(this.aisClassLayer);
        })

      });
    }
  }
}
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
