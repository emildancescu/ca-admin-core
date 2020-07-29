import React from 'react'
import { Button } from 'antd'
import { Map, Marker, TileLayer, Popup, Polyline } from 'react-leaflet'
import AntPath from 'react-leaflet-ant-path'
// import L from 'leaflet'

export default class LeafletMap extends React.Component {
  render() {
    const { position, center, polyline, useAntPath, children, ...rest } = this.props
    let gmapUrl
    let wazeUrl

    // https://{s}.tile.osm.org/{z}/{x}/{y}.png

    if (position) {
      gmapUrl = `https://www.google.com/maps?q=${position.lat},${position.lng}`
      wazeUrl = `https://waze.com/ul?ll=${position.lat},${position.lng}&navigate=yes`
    }

    const antOptions = {
      hardwareAccelerated: true,
      color: '#666',
      pulseColor: '#000',
      delay: 1000,
      smoothFactor: 2,
      dashArray: [10, 10],
      weight: 3,
    }

    return (
      <Map center={position || center} zoom={14} {...rest}>
        <TileLayer url="https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw" />

        {position && (
          <Marker position={position}>
            <Popup>
              <Button href={gmapUrl}>GMaps</Button>
              <Button href={wazeUrl} className="ml-1">
                Waze
              </Button>
            </Popup>
          </Marker>
        )}

        {polyline && !useAntPath && <Polyline color="blue" positions={polyline} smoothFactor={2} />}

        {polyline && polyline.length > 1 && useAntPath && (
          <AntPath positions={polyline} options={antOptions} />
        )}

        {children}
      </Map>
    )
  }
}
