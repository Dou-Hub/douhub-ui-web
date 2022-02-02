export const SPLITTER_CSS = `
.splitter-layout {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .splitter-layout .layout-pane {
    position: relative;
    flex: 0 0 auto;
    overflow: auto;
  }
  
  .splitter-layout .layout-pane.layout-pane-primary {
    flex: 1 1 auto;
  }
  
  .splitter-layout > .layout-splitter {
    flex: 0 0 auto;
    width: 4px;
    cursor: col-resize;
    background-color: transparent;
  }
  
  .splitter-layout .layout-splitter:hover {
    background-color: transparent;
  }
  
  .splitter-layout.layout-changing {
    cursor: col-resize;
  }
  
  .splitter-layout.layout-changing > .layout-splitter {
    background-color: transparent;
  }
  
  .splitter-layout.splitter-layout-vertical {
    flex-direction: column;
  }
  
  .splitter-layout.splitter-layout-vertical.layout-changing {
    cursor: row-resize;
  }
  
  .splitter-layout.splitter-layout-vertical > .layout-splitter {
    width: 100%;
    height: 4px;
    cursor: row-resize;
  }
  `