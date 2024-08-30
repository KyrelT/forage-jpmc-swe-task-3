import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps> { 
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      upperBound: 'string',
      lowerBound: 'string',
      trigger_warning: 'float',
      price_ABC: 'float',
      price_DEF: 'float',
      ratio: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]'); // Would be blank if there is nothing here
      elem.setAttribute('columns', '["upperBound","lowerBound","ratio","trigger_warning"]');
      elem.setAttribute('aggregates', JSON.stringify({
        upperBound: 'avg',
        lowerBound: 'avg',
        price_ABC: 'avg',
        price_DEF: 'avg',
        ratio: 'avg',
        trigger_warning: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate(prevProps: IProps){
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ]as unknown as TableData);
    }
  }
  
}

export default Graph;
