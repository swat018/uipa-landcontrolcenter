<template>
  <div id="map" class="map" ref="rootmap"></div>
</template>

<script>
import { Map, View } from "ol";
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from 'ol/control'
import { fromLonLat, transform } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import { Style, Icon, Fill, Stroke, RegularShape, Text } from 'ol/style'
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
import { LineString } from 'ol/geom'


// const urlBefore = 'http://navioncorp.asuscomm.com:8080/TileMap/'
// const urlAfter = '/{z}/{x}/{-y}.png?v='+ Math.random();
const urlBefore = import.meta.env.VITE_TILE_MAP_URL + '/';
const urlAfter = '/{z}/{x}/{-y}.png';
import shipIcon from '@/assets/images/shipicons/shipIcon_green.png'
import selectShipIcon from '@/assets/images/shipicons/shipIcon_yellow.png'


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
    mapTypeId: String,
    map: null,
    imoNumbers: [],
    isClick: false,
  }),
  props: [ 'propsdata', 'isShow', 'vesselTrack', 'startDate', 'endDate', 'isPastVesselTracks', 'layerMode', 'layerBright' ],
  watch: {
    propsdata: function() {
      this.imoNumbers = this.propsdata;
      this.setShipLayer();
    },
    isShow: function() {
      if (this.isShow === false) {
        this.setShipLayer();
      }
    },
    vesselTrack: function() {
      this.vesselTrackCurrent();
    },
    isPastVesselTracks: function() {
      this.vesselTrackPast();
    },
    layerMode: function() {
      this.setMapType(this.layerBright, this.layerMode);
    },
    layerBright: function() {
      this.setMapType(this.layerBright, this.layerMode);
    }
  },
  mounted: async function() {
    this.initMap();
    this.setMapType(this.layerBright, this.layerMode);
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
        view: new View({
          // center: transform([128.100, 36.000], 'EPSG:4326', 'EPSG:3857')
          center:fromLonLat([128.100,36.000]),
          zoom: 4,
          //zoom: 7,
          maxResolution: 21600,
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
      this.map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipWakeLayer')
        .forEach(layer => this.map.removeLayer(layer));
      this.map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipPastWakeLayer')
        .forEach(layer => this.map.removeLayer(layer));

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
      var select = new Select({
          condition: singleClick
      }
      );
      this.map.addInteraction(select);

      select.on('select', function(e) {
        if(e.selected[0].values_.layer === 'shipLayer') {
          e.selected[0].setStyle(new Style({
            image: new Icon({
              src: selectShipIcon,
              scale: 0.2,
              anchor: [0.5, 0.5],
              rotateWithView: true,
              rotation: e.selected[0].values_.course
            })
          }));
          emitter.emit('clickShipName', e.selected[0].values_.name);
        } else {
          this.setShipLayer();
        }
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
            layer: 'shipLayer',
            course: shipData.course
          });
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

          this.shipLayer = new VectorLayer({
            name: 'shipLayer',
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new Icon({
                src: shipIcon,
                scale: 0.2,
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: (-90 + shipData.course) * Math.PI/180
              })
            }),
          });
          this.map.addLayer(this.shipLayer);
        })
      });
    },
    vesselTrackCurrent: function() {
      const mapStore = useMapStore();
      const { clickedShipInfo, vesselTrackStatus } = storeToRefs(mapStore);

      if (vesselTrackStatus._value === true) {
        getShipWakeCurrent(clickedShipInfo.value.imoNumber).then((response) => {
          var shipWakeList = response.data.data;
          if(response.data.data === null) return;

          var currentPointFeatures =[];

          shipWakeList.forEach((shipData) => {
            if(isNaN(Number(shipData.longitude)) || isNaN(Number(shipData.latitude))) return;
            var pointFeature = new Feature({
              geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
              name: shipData.imoNumber,
              text: shipData.time
            });
            currentPointFeatures.push(pointFeature);
          })

          currentPointFeatures.map((pointFeature, index) => {
            if(index === 0) return;
            if (currentPointFeatures[index] === null) return;
            var lineFeature = new Feature({
              geometry: new LineString([currentPointFeatures[index-1].getGeometry().getCoordinates(), currentPointFeatures[index].getGeometry().getCoordinates()]),
              id: shipWakeList[index].time
            });
            lineFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
            var point = new Feature({
              geometry: new Point([Number(currentPointFeatures[index].longitude), Number(currentPointFeatures[index].latitude)]),
              name: shipWakeList[index].imoNumber,
              label: shipWakeList[index].time
            });
            point.getGeometry().transform('EPSG:4326', 'EPSG:3857');

            this.shipWakeLayer = new VectorLayer({
              name: 'shipWakeLayer',
              source: new VectorSource({
                features: [lineFeature]
              }),
              style: this.styleCurrent
            });

            this.map.addLayer(this.shipWakeLayer);
          })
        });
      } else if (vesselTrackStatus._value === false){
        this.map.getLayers().getArray()
          .filter(layer => layer.get('name') === 'shipWakeLayer')
          .forEach(layer => this.map.removeLayer(layer));
        this.map.getLayers().getArray()
          .filter(layer => layer.get('name') === 'shipPastWakeLayer')
          .forEach(layer => this.map.removeLayer(layer));
      }
    },
    styleCurrent: function (feature, resolution) {
      const geometry = feature.getGeometry();
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: '#ddae34',
            width: 4,
          }),
        }),
      ];

      if (resolution < 40) {
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          styles.push(
            new Style({
              geometry: new Point(end),
              text: new Text({
                text: feature.values_.id,
                offsetX: 80,
                offsetY: 20,
                fill: new Fill({color: 'black'}),
                stroke: new Stroke({color: 'white', width: 2}),
                font: 'bold 10px sans-serif',
                }),
              image: new Icon({
                src: import.meta.env.DEV ? 'src/assets/images/shipicons/arrow.png' : '/assets/images/shipicons/arrow.png',
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: -rotation,
              }),
              zIndex: 100,
            }),
          );
        });
      }


      return styles;
    },
    vesselTrackPast: function() {
      const mapStore = useMapStore();
      const { clickedShipInfo, vesselTrackStatus, startDate, endDate,  isPastVesselTracks } = storeToRefs(mapStore);

      console.log(startDate._value, endDate._value)
      console.log(vesselTrackStatus._value, isPastVesselTracks._value)

      if(vesselTrackStatus._value === true) {
        getShipWakePast(clickedShipInfo.value.imoNumber, startDate._value, endDate._value).then((response) => {
          var shipWaskPastList = response.data.data;
          if(response.data.data === null) return;

          var pointFeatures =[];
          shipWaskPastList.forEach((shipData) => {
            if(isNaN(Number(shipData.longitude)) || isNaN(Number(shipData.latitude))) return;
            var pointFeature = new Feature({
              geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
              name: shipData.imoNumber,
              text: shipData.time
            });
            pointFeatures.push(pointFeature);
          })

          pointFeatures.map((pointFeature, index) => {
            if(index === 0) return;
            if (pointFeatures[index] === null) return;
            var lineFeature = new Feature({
              geometry: new LineString([pointFeatures[index-1].getGeometry().getCoordinates(), pointFeatures[index].getGeometry().getCoordinates()]),
              id: shipWaskPastList[index].time
            });
            lineFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
            var point = new Feature({
              geometry: new Point([Number(pointFeatures[index].longitude), Number(pointFeatures[index].latitude)]),
              name: shipWaskPastList[index].imoNumber,
              label: shipWaskPastList[index].time
            });
            point.getGeometry().transform('EPSG:4326', 'EPSG:3857');

            this.shipPastWakeLayer = new VectorLayer({
              name: 'shipPastWakeLayer',
              source: new VectorSource({
                features: [lineFeature]
              }),
              style: this.stylePast
            });

            this.map.addLayer(this.shipPastWakeLayer);
          })
        })
      }
      isPastVesselTracks._value = false;
    },
    stylePast: function (feature, resolution) {
      const geometry = feature.getGeometry();
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: '#32d218',
            width: 4,
          }),
        }),
      ];

      if (resolution < 40) {
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          styles.push(
            new Style({
              geometry: new Point(end),
              text: new Text({
                text: feature.values_.id,
                offsetX: 80,
                offsetY: 20,
                fill: new Fill({color: 'black'}),
                stroke: new Stroke({color: 'white', width: 2}),
                font: 'bold 10px sans-serif',
              }),
              image: new Icon({
                src: import.meta.env.DEV ? 'src/assets/images/shipicons/arrow.png' : '/assets/images/shipicons/arrow.png',
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: -rotation,
              }),
              zIndex: 100,
            }),
          );
        });
      }


      return styles;
    },
    aisData: function() {
      getAisData().then((data) => {
        let aisAton = data.ais_aton[0];
        let ais_basestation = data.ais_basestation[0];
        let ais_class_a = data.ais_class_a[0];
        let ais_class_b = data.ais_class_b[0];
        let vpass_class_b = data.vpass_class_a[0];

        let fill = new Fill({color: 'green'});
        let stroke = new Stroke({color: 'black', width: 2});
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
              image: new Icon({
                src: import.meta.env.DEV ? 'src/assets/images/shipicons/AIS.png' : '/assets/images/shipicons/AIS.png',
                scale: 0.2,
                anchor: [0.5, 0.5],
                opacity: 0.7,
                rotateWithView: true,
                rotation: (-90 + aisClassAData.heading) * Math.PI/180
                ,
              })
            }),
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
              image: new Icon({
                src: import.meta.env.DEV ? 'src/assets/images/shipicons/AIS.png' : '/assets/images/shipicons/AIS.png',
                scale: 0.2,
                anchor: [0.5, 0.5],
                opacity: 0.7,
                rotateWithView: true,
                rotation: (-90 + aisClassBData.heading) * Math.PI/180
              })
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
            style: new Style({
              image: new Icon({
                src: import.meta.env.DEV ? 'src/assets/images/shipicons/AIS.png' : '/assets/images/shipicons/AIS.png',
                scale: 0.2,
                anchor: [0.5, 0.5],
                opacity: 0.7,
                rotateWithView: true,
                rotation: (-90 + vpassClassBData.heading) * Math.PI/180
              })
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
</style>
