import React from 'react'
import Helmet from 'react-helmet'

export const css = `
  body, #root {
    overflow: hidden;
  }

  body ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  body ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: rgba(212, 221, 232, .4);
  }
  
  body ::-webkit-scrollbar-corner {
    background-color: rgba(0,0,0,0);
  }
`

export const GlobalScrollbarStyle = () => (
  <Helmet>
    <style>{css}</style>
  </Helmet>
)

export default GlobalScrollbarStyle
