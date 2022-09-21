# ca-admin-core

npm install --save git+ssh://git@github.com:emildancescu/ca-admin-core.git

# Changelog

## 1.0.39

### ESlint
- disabled rule camelcase

### Lib
- exported "requestReduxActionType" so it can be used if necessary to track network/actions

### Core module
- added "networkSagaConfig" object to "config"
- it has 1 property "timeout" which is a global API response timeout for the network layer and has a default of 60 seconds
- it can be overwritten individually by configuring each "network/request" action creator

### Network redux-saga
- removed literal definition of  type action "network/request" and exported it as a constant
- added "CANCEL" and "CANCELLED" to network action creators "networkActions" and "extraNetworkActions"
- "CANCEL" can be triggered by the user and network layer will trigger "CANCELLED" after aborting the network request (fetch)
- added "networkSagaConfig" to the payload of request action creator. It is similar to the core config property above.
- saga will look for the API response timeout globally and will overwrite it with individual saga configuration if present
- added a new element in the race effect condition to enable cancelling the network request
- added AbortController to enable fetch cancellation
- added "requestPayload" to all saga "yield put()" which contains the initial request payload. This is usefull for chaining different redux actions (Ex.: users list action -> success -> list airplanes action )
- rootSaga generator functions now passes whole "config" object to request listener

### NET Utils
- pass AbortController signal to returned fetch()
- returned fetch() now has a catch() chained (AbortController -> DOMException)
- "function toQueryString()" improvements:
- - now supports all "encodeURIComponent()" values including "undefined" and "null"
- - fixed empty string generated query parameters from empty objects and arrays