// loaders.gl, MIT license
// Forked from https://github.com/mapbox/geojson-vt under compatible ISC license

import test from 'tape-promise/tape';
// @ts-ignore-error
import {simplify} from '@loaders.gl/mvt/lib/geojson-tiler/simplify';

/* eslint comma-spacing:0, no-shadow: 0*/

const points = [
  [0.22455, 0.25015],
  [0.22691, 0.24419],
  [0.23331, 0.24145],
  [0.23498, 0.23606],
  [0.24421, 0.23276],
  [0.26259, 0.21531],
  [0.26776, 0.21381],
  [0.27357, 0.20184],
  [0.27312, 0.19216],
  [0.27762, 0.18903],
  [0.28036, 0.18141],
  [0.28651, 0.17774],
  [0.29241, 0.15937],
  [0.29691, 0.15564],
  [0.31495, 0.15137],
  [0.31975, 0.14516],
  [0.33033, 0.13757],
  [0.34148, 0.13996],
  [0.36998, 0.13789],
  [0.38739, 0.14251],
  [0.39128, 0.13939],
  [0.40952, 0.14114],
  [0.41482, 0.13975],
  [0.42772, 0.1273],
  [0.4396, 0.11974],
  [0.47493, 0.10787],
  [0.48651, 0.10675],
  [0.4892, 0.10945],
  [0.49379, 0.10863],
  [0.50474, 0.11966],
  [0.51296, 0.12235],
  [0.51863, 0.12089],
  [0.52409, 0.12688],
  [0.52957, 0.12786],
  [0.53421, 0.14093],
  [0.53927, 0.14724],
  [0.56769, 0.14891],
  [0.57525, 0.15726],
  [0.58062, 0.15815],
  [0.60153, 0.15685],
  [0.61774, 0.15986],
  [0.622, 0.16704],
  [0.62955, 0.1946],
  [0.6389, 0.19561],
  [0.64126, 0.20081],
  [0.65177, 0.20456],
  [0.67155, 0.22255],
  [0.68368, 0.21745],
  [0.69525, 0.21915],
  [0.70064, 0.21798],
  [0.70312, 0.21436],
  [0.71226, 0.21587],
  [0.72149, 0.21281],
  [0.72781, 0.21336],
  [0.72998, 0.20873],
  [0.73532, 0.2082],
  [0.73994, 0.20477],
  [0.76998, 0.20842],
  [0.7796, 0.21687],
  [0.7842, 0.21816],
  [0.80024, 0.21462],
  [0.81053, 0.21973],
  [0.81719, 0.22682],
  [0.82077, 0.23617],
  [0.82723, 0.23616],
  [0.82989, 0.23989],
  [0.851, 0.24894],
  [0.85988, 0.25549],
  [0.86521, 0.26853],
  [0.85795, 0.2803],
  [0.86548, 0.29145],
  [0.86681, 0.29866],
  [0.86468, 0.30271],
  [0.86779, 0.30617],
  [0.85987, 0.31137],
  [0.86008, 0.31435],
  [0.85829, 0.31494],
  [0.8581, 0.3276],
  [0.85454, 0.3354],
  [0.86092, 0.343],
  [0.85643, 0.35015],
  [0.85142, 0.35296],
  [0.84984, 0.35959],
  [0.85456, 0.36553],
  [0.84974, 0.37038],
  [0.84409, 0.37189],
  [0.84475, 0.38044],
  [0.84152, 0.38367],
  [0.83957, 0.3904],
  [0.84559, 0.39905],
  [0.8484, 0.40755],
  [0.84371, 0.4113],
  [0.84409, 0.41988],
  [0.83951, 0.43276],
  [0.84133, 0.44104],
  [0.84762, 0.44922],
  [0.84716, 0.45844],
  [0.85138, 0.46279],
  [0.85397, 0.47115],
  [0.86636, 0.48077]
];

const simplified = [
  [0.22455, 0.25015],
  [0.26776, 0.21381],
  [0.29691, 0.15564],
  [0.33033, 0.13757],
  [0.40952, 0.14114],
  [0.4396, 0.11974],
  [0.48651, 0.10675],
  [0.52957, 0.12786],
  [0.53927, 0.14724],
  [0.56769, 0.14891],
  [0.61774, 0.15986],
  [0.62955, 0.1946],
  [0.67155, 0.22255],
  [0.72781, 0.21336],
  [0.73994, 0.20477],
  [0.76998, 0.20842],
  [0.7842, 0.21816],
  [0.80024, 0.21462],
  [0.82077, 0.23617],
  [0.85988, 0.25549],
  [0.86521, 0.26853],
  [0.85795, 0.2803],
  [0.86779, 0.30617],
  [0.85829, 0.31494],
  [0.85454, 0.3354],
  [0.86092, 0.343],
  [0.84984, 0.35959],
  [0.85456, 0.36553],
  [0.84409, 0.37189],
  [0.83957, 0.3904],
  [0.8484, 0.40755],
  [0.83951, 0.43276],
  [0.85397, 0.47115],
  [0.86636, 0.48077]
];

test('GeoJSONVT#simplify#simplifies points correctly with the given tolerance', (t) => {
  const coords: number[] = [];
  for (let i = 0; i < points.length; i++) {
    coords.push(points[i][0], points[i][1], 0);
  }

  coords[2] = 1;
  coords[coords.length - 1] = 1;
  simplify(coords, 0, coords.length - 3, 0.001 * 0.001);

  const result: number[][] = [];
  for (let i = 0; i < coords.length; i += 3) {
    if (coords[i + 2] > 0.005 * 0.005) {
      result.push([coords[i], coords[i + 1]]);
    }
  }
  t.same(result, simplified);
  t.end();
});

test('GeoJSONVT#simplify#does not throw max call stack error on bad long input', (t) => {
  const coords: number[][] = [];
  for (let i = 0; i < 1400; i++) {
    coords.push([0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]);
  }

  t.doesNotThrow(() => {
    simplify(coords, 2e-15);
  });

  t.end();
});
