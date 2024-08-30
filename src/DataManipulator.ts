import { ServerRespond } from './DataStreamer';

export interface Row {
  upperBound: number,
  lowerBound: number,
  ratio: number,
  price_ABC: number,
  price_DEF: number,
  timestamp: Date,
  trigger_warning: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    const ratio = priceABC/priceDEF
    const upper_Bound = 1 + 0.05;
    const lower_Bound = 1 - 0.05;
    return {
      price_ABC: priceABC,
      price_DEF: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ?
        serverResponds[0].timestamp : serverResponds[1].timestamp,
      upperBound: upper_Bound,
      lowerBound: lower_Bound,
      trigger_warning: (ratio > upper_Bound || ratio < lower_Bound) ? ratio : undefined,
    };
  }
}
