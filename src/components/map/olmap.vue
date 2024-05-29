<template>
  <div id="mapContainer" class="map" ref="rootmap"></div>
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
import { Style, Icon, Fill, Stroke, RegularShape, Text, Circle as CircleStyle } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point.js';
import Select from 'ol/interaction/Select'
import { Draw } from 'ol/interaction';
import emitter from '@/composables/eventbus'
import { TileWMS } from 'ol/source'
import { useMapStore } from '@/stores/mapStore'
import { useRouteStore } from '@/stores/routeStore'
import { getShipData, getShipWakeCurrent, getShipWakePast } from '@/api/worldMap'
import { getAisData } from '@/api/aisData'
import { storeToRefs } from 'pinia'
import { singleClick } from 'ol/events/condition'
import { LineString } from 'ol/geom'

import shipIcon from '@/assets/images/shipicons/shipIcon_green.png'
import selectShipIcon from '@/assets/images/shipicons/shipIcon_yellow.png'
import arrowIcon from '@/assets/images/shipicons/arrow.png'
import { getShipInfo } from '@/api/shipApi'
import { isStausOk } from '@/composables/util'

const drawInteration_route = Draw

const urlBefore = import.meta.env.VITE_TILE_MAP_URL + '/';
const urlAfter = '/{z}/{x}/{-y}.png';
const geoserverWmsUrl = import.meta.env.VITE_GEOSERVER_WMS_URL;

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
    routePLayer: VectorLayer,
    routeLLayer: VectorLayer,
    mapTypeId: String,
    imoNumbers: [],
    isClick: false,
  }),
  props: [
    'propsdata', 'curSelectedShip',
    'isShow', 'isRouteShow',
    'vesselTrack', 'startDate', 'endDate', 'isPastVesselTracks',
    'layerMode', 'layerBright',
  ],
  watch: {
    propsdata: function() {
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipLayer')
        .forEach(layer => map.removeLayer(layer));
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipWakeLayer')
        .forEach(layer => map.removeLayer(layer));
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipPastWakeLayer')
        .forEach(layer => map.removeLayer(layer));
      this.imoNumbers = [];

      var shipdataList =  this.propsdata;
      shipdataList.map((shipData) => {
        this.imoNumbers.push(shipData.imoNumber);
      });
      this.setShipLayer();
    },
    curSelectedShip: async function() {
      let imoNumber;
      Object.keys(this.curSelectedShip).forEach((key) => {
        if (key === 'imoNumber') imoNumber = this.curSelectedShip[key];
      });
      this.propsdata.map((shipData) => {
        if (shipData.imoNumber === imoNumber) {
          getShipData(imoNumber).then((response) => {
            if(response.data.data === null) return;
            var ship = response.data.data;
            map.getView().setCenter(fromLonLat([Number(ship[0].longitude), Number(ship[0].latitude)]));
            map.getView().setZoom(4);
          });
        }
      });

    },
    isShow: function() {
      if (this.isShow === false) {
        this.setShipLayer();
      }
    },
    isRouteShow: function() {
      if (this.isRouteShow === false) {
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
    this.$emit('init', map);

    // 오픈레이어스 좌우영역 제한
    map.on('moveend', function() {
      let view = map.getView(); // 지도의 뷰
      // 지도의 크기를 가져옴
      let mapSize = map.getSize();

      // 화면의 왼쪽 중앙 좌표를 계산
      let leftCoordinate = map.getCoordinateFromPixel([0, 0]); // 좌측 좌표
      let rightPixel = mapSize[0]; // 우측 좌표(x)
      let rightCoordinate = map.getCoordinateFromPixel([rightPixel, 0]); // 화면 좌표를 지도 좌표로 변환
      // 화면상의 중심 좌표
      var currentCenter = view.getCenter();

      // 화면상의 중심 좌표와 왼쪽 좌표의 차이 계산
      var dx = currentCenter[0] - leftCoordinate[0];

      let lonLeft = transform([leftCoordinate[0], 0], 'EPSG:3857', 'EPSG:4326')[0];
      let lonRight = transform([rightCoordinate[0], 0], 'EPSG:3857', 'EPSG:4326')[0];

      // 경도 제한
      let newCenter;
      if (lonLeft < -180 || lonRight > 540) {
        if (lonLeft < -180) {
          lonLeft = 360 + (lonLeft % 360);

          newCenter = transform([lonLeft, 0], 'EPSG:4326', 'EPSG:3857');
          newCenter = [newCenter[0] + dx, currentCenter[1]];
        } else {
          lonRight = lonRight % 360;

          newCenter = transform([lonRight, 0], 'EPSG:4326', 'EPSG:3857');
          newCenter = [newCenter[0] - dx, currentCenter[1]];
        }

        view.setCenter(newCenter); // 변경된 경도로 지도 중심 재설정
      }
    });

    this.shipSelectEvent();
    this.vesselTrackCurrent();
    this.vesselTrackPast();

    // ais 정보 시각화
    this.aisData();

    this.setRouteLayer();

    // 기상정보 웹팩 관련 라이브러리 추가
    const bundleScript = document.createElement('script');
    bundleScript.src = '/src/components/map/canvasLayer/bundle.js';
    document.body.appendChild(bundleScript);

    emitter.on('draw_route_d2', () => {
      this.drawRoute();
    })

    emitter.on('route_Interaction2', () => {
      this.routeInteraction();
    })
  },
  methods: {
    initMap: function() {
      map = new Map({
        target: "mapContainer",
        view: new View({
          center:fromLonLat([128.100,36.000]),
          zoom: 4,
          maxResolution: 21600,
        }),
        controls: defaultControls({
          attribution: false,
          zoom: false,
          rotate: false,
        }),
      });
      return map;
    },
    setMapType: function(mapBright, mapMode) {

      if (mapBright !== 'Black') {
        map.getLayers().clear();
        map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: urlBefore + mapBright + '_' + mapMode + urlAfter
            }),
            name: mapBright + '_' + mapMode,
            visible: true,
          })
        );
      } else if (mapBright === 'Black') {
        map.getLayers().clear();
        map.addLayer(
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
        map.addLayer(
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
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipLayer')
        .forEach(layer => map.removeLayer(layer));
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipWakeLayer')
        .forEach(layer => map.removeLayer(layer));
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'shipPastWakeLayer')
        .forEach(layer => map.removeLayer(layer));

      var temp;
      if (this.imoNumbers.length !== 0) {
        this.imoNumbers.forEach((imoNumber) => {
          if (temp !== undefined) temp = temp + ',' + imoNumber;
          else temp = imoNumber;
        });
        this.shipData(temp);
      }
    },
    shipSelectEvent: function() {
      var select = new Select({
          condition: singleClick
      });
      map.addInteraction(select);

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
    addWorldcountries: function(brightMode) {
      if (brightMode != 'Black') {
        map.addLayer(
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
      }
      if (brightMode === 'Day') {
        this.makeSld("worldcountries", "Polygon1_2", "bfbe8f", "bfbe8f");
      } else if (brightMode === 'Dusk') {
        this.makeSld("worldcountries", "Polygon1_2", "40402e", "40402e");
      } else if (brightMode === 'Night') {
        this.makeSld("worldcountries", "Polygon1_2", "17160e", "17160e");
      }
      map.getLayers().getArray()
        .filter(layer => layer.get('id') === 'worldcountries')
        .forEach(layer => map.setZIndex(-1));


    },
    getLayer: function(id) {
      let lyr = null;
      var layers = map.getLayers().getArray();
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
      getShipData(imoNumbers).then((response) => {
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
          map.addLayer(this.shipLayer);
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

            map.addLayer(this.shipWakeLayer);
          })
        });
      } else if (vesselTrackStatus._value === false){
        map.getLayers().getArray()
          .filter(layer => layer.get('name') === 'shipWakeLayer')
          .forEach(layer => map.removeLayer(layer));
        map.getLayers().getArray()
          .filter(layer => layer.get('name') === 'shipPastWakeLayer')
          .forEach(layer => map.removeLayer(layer));
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
                src: arrowIcon,
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
        getShipWakePast(clickedShipInfo.value.imoNumber, startDate._value, endDate._value).then((response) => {wn
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

            map.addLayer(this.shipPastWakeLayer);
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
          map.addLayer(this.aisAtonLayer);
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
          map.addLayer(this.aisBasestationLayer);
        })

        ais_class_a.forEach((aisClassAData) => {
          var rotation;
          if (aisClassAData.heading === null) rotation = aisClassAData.cog;
          else rotation = aisClassAData.heading;

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
                rotation: (-90 + rotation) * Math.PI/180
                ,
              })
            }),
          });
          map.addLayer(this.aisClassLayer);
        })
        ais_class_b.forEach((aisClassBData) => {
          var rotation;
          if (aisClassBData.heading === null) rotation = aisClassBData.cog;
          else rotation = aisClassBData.heading;

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
                rotation: (-90 + rotation) * Math.PI/180
              })
            })
          });
          map.addLayer(this.aisClassLayer);
        })
        vpass_class_b.forEach((vpassClassBData) => {
          var rotation;
          if (vpassClassBData.heading === null) rotation = vpassClassBData.cog;
          else rotation = vpassClassBData.heading;

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
                rotation: (-90 + rotation) * Math.PI/180
              })
            })
          });
          map.addLayer(this.aisClassLayer);
        })

      });
    },

    setRouteLayer: function() {
      const source = new VectorSource();
      var routePLayer = new VectorLayer({
        id: 'route_p',
        source: source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      });
      map.addLayer(routePLayer);

      var routeLLayer = new VectorLayer({
        id: 'route_l',
        source: source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      });
      map.addLayer(routeLLayer);
    },

    routeInteraction: function() {
      const lyr_p = this.getLayer("route_p");

      this.drawInteration_route = new Draw({
        id: 'draw_i',
        source: lyr_p.getSource(),
        type: 'Point'
      });
      this.drawInteration_route.on('drawend', this.onDrawEnd);
      map.addInteraction(this.drawInteration_route);
    },

    onDrawEnd(f) {
      const routeStore = useRouteStore()
      const { routeMaster, routeDetail, selectedMIndex, selectedDIndex, drawactive } = storeToRefs(routeStore);

      var xy = f.feature.getGeometry().transform( 'EPSG:3857',  'EPSG:4326').getCoordinates();
      var y = xy[0];
      var x = xy[1];

      routeDetail.value[selectedDIndex.value].lon = y.toFixed(3)
      routeDetail.value[selectedDIndex.value].lat = x.toFixed(3)

      f.feature.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
      this.drawRoute();
      map.removeInteraction(this.drawInteration_route);
    },

    drawRoute: function() {
      const routeStore = useRouteStore()
      const { routeMaster, routeDetail, selectedMIndex, selectedDIndex, drawactive } = storeToRefs(routeStore);

      let lyr_p = this.getLayer("route_p");
      let lyr_l = this.getLayer("route_l");
      lyr_p.getSource().clear();
      lyr_l.getSource().clear();

      var arr_line = new Array()
      if (routeDetail.value.length > 0) {
        routeDetail.value.forEach(function(item){
          var point = [Number(item.lon),Number(item.lat)];
          var feat_p = new ol.Feature({
            id:"rt_"+item.routeseq,
            geometry:new Point(point)
          });
          feat_p.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
          lyr_p.getSource().addFeature(feat_p);
          arr_line.push(point);
        })

        var feat_line = new ol.Feature({
        id:"rt_"+routeMaster.value.routeid,
          geometry:new LineString(arr_line)
        });
        let c_geometry = feat_line.getGeometry().transform( 'EPSG:4326',  'EPSG:3857');
        lyr_l.getSource().addFeature(feat_line);
      }
    }

  }
}
</script>

<style scoped>
.map {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>

