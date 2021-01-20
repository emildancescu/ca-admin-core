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
        <TileLayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2l0eWxpbmsiLCJhIjoiY2p1bWFlOTMzMHNiMTQzcHcwOWd3ajdkdyJ9.3S-mnIR0lvcsWq4elpk-TA" />

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
