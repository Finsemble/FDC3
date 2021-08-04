// To parse this data:
//
//   import { Convert, Context, Chart, Contact, ContactList, Country, Currency, DateRange, Indicator, Instrument, InstrumentList, Organization, Portfolio, Position, Trade, Valuation } from "./file";
//
//   const context = Convert.toContext(json);
//   const chart = Convert.toChart(json);
//   const contact = Convert.toContact(json);
//   const contactList = Convert.toContactList(json);
//   const country = Convert.toCountry(json);
//   const currency = Convert.toCurrency(json);
//   const dateRange = Convert.toDateRange(json);
//   const indicator = Convert.toIndicator(json);
//   const instrument = Convert.toInstrument(json);
//   const instrumentList = Convert.toInstrumentList(json);
//   const organization = Convert.toOrganization(json);
//   const portfolio = Convert.toPortfolio(json);
//   const position = Convert.toPosition(json);
//   const trade = Convert.toTrade(json);
//   const valuation = Convert.toValuation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Context {
  id?: { [key: string]: string };
  name?: string;
  type: string;
}

export interface Chart {
  indicators?: Indicator[];
  instruments: Instrument[];
  range?: DateRange;
  style?: string;
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Contact {
  id: ContactID;
  type: string;
  name?: string;
}

export interface ContactID {
  email?: string;
  FDS_ID?: string;
}

export interface ContactList {
  contacts: Contact[];
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Country {
  id: CountryID;
  type: string;
  name?: string;
}

export interface CountryID {
  ISOALPHA2?: string;
  ISOALPHA3?: string;
}

export interface Currency {
  code: string;
  name?: string;
  type: string;
  id?: { [key: string]: string };
}

export interface DateRange {
  endtime?: Date;
  starttime?: Date;
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Indicator {
  name: string;
  parameters?: IndicatorParameters;
  type: string;
  id?: { [key: string]: string };
}

export interface IndicatorParameters {
  custom?: IndicatorCustom;
  field?: string;
  instrument?: Instrument;
  matype?: string;
  period?: number;
}

export interface IndicatorCustom {
  fields?: { [key: string]: any };
  vendor?: string;
}

export interface Instrument {
  id: InstrumentID;
  type: string;
  name?: string;
}

export interface InstrumentID {
  BBG?: string;
  CUSIP?: string;
  FDS_ID?: string;
  FIGI?: string;
  ISIN?: string;
  PERMID?: string;
  RIC?: string;
  SEDOL?: string;
  ticker?: string;
}
export interface InstrumentList {
  instruments: Instrument[];
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Organization {
  id: OrganizationID;
  type: string;
  name?: string;
}

export interface OrganizationID {
  FDS_ID?: string;
  LEI?: string;
  PERMID?: string;
}

export interface Portfolio {
  positions: Position[];
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Position {
  basis?: Valuation;
  current?: Valuation;
  gain?: number;
  holding: number;
  instrument: Instrument;
  name?: string;
  restricted?: number;
  trades?: Trade[];
  type: string;
  id?: { [key: string]: string };
}

export interface Trade {
  account?: string;
  close?: Valuation;
  location?: string;
  name?: string;
  open: Valuation;
  settledaterange?: DateRange;
  tradedaterange: DateRange;
  type: string;
  units: number;
  id?: { [key: string]: string };
}

export interface Valuation {
  currency?: Currency;
  price?: number;
  type: string;
  value: number;
  id?: { [key: string]: string };
  name?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toContext(json: string): Context {
    return cast(JSON.parse(json), r('Context'));
  }

  public static contextToJson(value: Context): string {
    return JSON.stringify(uncast(value, r('Context')), null, 2);
  }

  public static toChart(json: string): Chart {
    return cast(JSON.parse(json), r('Chart'));
  }

  public static chartToJson(value: Chart): string {
    return JSON.stringify(uncast(value, r('Chart')), null, 2);
  }

  public static toContact(json: string): Contact {
    return cast(JSON.parse(json), r('Contact'));
  }

  public static contactToJson(value: Contact): string {
    return JSON.stringify(uncast(value, r('Contact')), null, 2);
  }

  public static toContactList(json: string): ContactList {
    return cast(JSON.parse(json), r('ContactList'));
  }

  public static contactListToJson(value: ContactList): string {
    return JSON.stringify(uncast(value, r('ContactList')), null, 2);
  }

  public static toCountry(json: string): Country {
    return cast(JSON.parse(json), r('Country'));
  }

  public static countryToJson(value: Country): string {
    return JSON.stringify(uncast(value, r('Country')), null, 2);
  }

  public static toCurrency(json: string): Currency {
    return cast(JSON.parse(json), r('Currency'));
  }

  public static currencyToJson(value: Currency): string {
    return JSON.stringify(uncast(value, r('Currency')), null, 2);
  }

  public static toDateRange(json: string): DateRange {
    return cast(JSON.parse(json), r('DateRange'));
  }

  public static dateRangeToJson(value: DateRange): string {
    return JSON.stringify(uncast(value, r('DateRange')), null, 2);
  }

  public static toIndicator(json: string): Indicator {
    return cast(JSON.parse(json), r('Indicator'));
  }

  public static indicatorToJson(value: Indicator): string {
    return JSON.stringify(uncast(value, r('Indicator')), null, 2);
  }

  public static toInstrument(json: string): Instrument {
    return cast(JSON.parse(json), r('Instrument'));
  }

  public static instrumentToJson(value: Instrument): string {
    return JSON.stringify(uncast(value, r('Instrument')), null, 2);
  }

  public static toInstrumentList(json: string): InstrumentList {
    return cast(JSON.parse(json), r('InstrumentList'));
  }

  public static instrumentListToJson(value: InstrumentList): string {
    return JSON.stringify(uncast(value, r('InstrumentList')), null, 2);
  }

  public static toOrganization(json: string): Organization {
    return cast(JSON.parse(json), r('Organization'));
  }

  public static organizationToJson(value: Organization): string {
    return JSON.stringify(uncast(value, r('Organization')), null, 2);
  }

  public static toPortfolio(json: string): Portfolio {
    return cast(JSON.parse(json), r('Portfolio'));
  }

  public static portfolioToJson(value: Portfolio): string {
    return JSON.stringify(uncast(value, r('Portfolio')), null, 2);
  }

  public static toPosition(json: string): Position {
    return cast(JSON.parse(json), r('Position'));
  }

  public static positionToJson(value: Position): string {
    return JSON.stringify(uncast(value, r('Position')), null, 2);
  }

  public static toTrade(json: string): Trade {
    return cast(JSON.parse(json), r('Trade'));
  }

  public static tradeToJson(value: Trade): string {
    return JSON.stringify(uncast(value, r('Trade')), null, 2);
  }

  public static toValuation(json: string): Valuation {
    return cast(JSON.parse(json), r('Valuation'));
  }

  public static valuationToJson(value: Valuation): string {
    return JSON.stringify(uncast(value, r('Valuation')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Context: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  Chart: o(
    [
      { json: 'indicators', js: 'indicators', typ: u(undefined, a(r('Indicator'))) },
      { json: 'instruments', js: 'instruments', typ: a(r('Instrument')) },
      { json: 'range', js: 'range', typ: u(undefined, r('DateRange')) },
      { json: 'style', js: 'style', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Contact: o(
    [
      { json: 'id', js: 'id', typ: r('ContactID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContactID: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    ''
  ),
  ContactList: o(
    [
      { json: 'contacts', js: 'contacts', typ: a(r('Contact')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Country: o(
    [
      { json: 'id', js: 'id', typ: r('CountryID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  CountryID: o(
    [
      { json: 'ISOALPHA2', js: 'ISOALPHA2', typ: u(undefined, '') },
      { json: 'ISOALPHA3', js: 'ISOALPHA3', typ: u(undefined, '') },
    ],
    ''
  ),
  Currency: o(
    [
      { json: 'code', js: 'code', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
    ],
    'any'
  ),
  DateRange: o(
    [
      { json: 'endtime', js: 'endtime', typ: u(undefined, Date) },
      { json: 'starttime', js: 'starttime', typ: u(undefined, Date) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Indicator: o(
    [
      { json: 'name', js: 'name', typ: '' },
      { json: 'parameters', js: 'parameters', typ: u(undefined, r('IndicatorParameters')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
    ],
    'any'
  ),
  IndicatorParameters: o(
    [
      { json: 'custom', js: 'custom', typ: u(undefined, r('IndicatorCustom')) },
      { json: 'field', js: 'field', typ: u(undefined, '') },
      { json: 'instrument', js: 'instrument', typ: u(undefined, r('Instrument')) },
      { json: 'matype', js: 'matype', typ: u(undefined, '') },
      { json: 'period', js: 'period', typ: u(undefined, 3.14) },
    ],
    'any'
  ),
  IndicatorCustom: o(
    [
      { json: 'fields', js: 'fields', typ: u(undefined, m('any')) },
      { json: 'vendor', js: 'vendor', typ: u(undefined, '') },
    ],
    'any'
  ),
  Instrument: o(
    [
      { json: 'id', js: 'id', typ: r('InstrumentID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  InstrumentID: o(
    [
      { json: 'BBG', js: 'BBG', typ: u(undefined, '') },
      { json: 'CUSIP', js: 'CUSIP', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
      { json: 'FIGI', js: 'FIGI', typ: u(undefined, '') },
      { json: 'ISIN', js: 'ISIN', typ: u(undefined, '') },
      { json: 'PERMID', js: 'PERMID', typ: u(undefined, '') },
      { json: 'RIC', js: 'RIC', typ: u(undefined, '') },
      { json: 'SEDOL', js: 'SEDOL', typ: u(undefined, '') },
      { json: 'ticker', js: 'ticker', typ: u(undefined, '') },
    ],
    ''
  ),
  InstrumentList: o(
    [
      { json: 'instruments', js: 'instruments', typ: a(r('Instrument')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Organization: o(
    [
      { json: 'id', js: 'id', typ: r('OrganizationID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  OrganizationID: o(
    [
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
      { json: 'LEI', js: 'LEI', typ: u(undefined, '') },
      { json: 'PERMID', js: 'PERMID', typ: u(undefined, '') },
    ],
    ''
  ),
  Portfolio: o(
    [
      { json: 'positions', js: 'positions', typ: a(r('Position')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Position: o(
    [
      { json: 'basis', js: 'basis', typ: u(undefined, r('Valuation')) },
      { json: 'current', js: 'current', typ: u(undefined, r('Valuation')) },
      { json: 'gain', js: 'gain', typ: u(undefined, 3.14) },
      { json: 'holding', js: 'holding', typ: 3.14 },
      { json: 'instrument', js: 'instrument', typ: r('Instrument') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'restricted', js: 'restricted', typ: u(undefined, 3.14) },
      { json: 'trades', js: 'trades', typ: u(undefined, a(r('Trade'))) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
    ],
    'any'
  ),
  Trade: o(
    [
      { json: 'account', js: 'account', typ: u(undefined, '') },
      { json: 'close', js: 'close', typ: u(undefined, r('Valuation')) },
      { json: 'location', js: 'location', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'open', js: 'open', typ: r('Valuation') },
      { json: 'settledaterange', js: 'settledaterange', typ: u(undefined, r('DateRange')) },
      { json: 'tradedaterange', js: 'tradedaterange', typ: r('DateRange') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'units', js: 'units', typ: 3.14 },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
    ],
    'any'
  ),
  Valuation: o(
    [
      { json: 'currency', js: 'currency', typ: u(undefined, r('Currency')) },
      { json: 'price', js: 'price', typ: u(undefined, 3.14) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'value', js: 'value', typ: 3.14 },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
};
