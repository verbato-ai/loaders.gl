# GLTFScenegraph

The `GLTFScenegraph` class provides an API for accessing and modifying glTF data.

> Caveat: Modification of binary data chunks has limitations, and this class is currently not intended to be a generic utility for modifying glTF data.

## Usage

### Accessing

```js
import {GLTFLoader, GLTFScenegraph} from '@loaders.gl/gltf';
import {load} from '@loaders.gl/core';

// Load and parse a file
const gltfData = await parse(fetch(GLTF_URL), GLTFLoader);

// Create a parser
const gltf = new GLTFScenegraph(gltfData);

// Get the complete glTF JSON structure
const gltfJson = gltf.getJSON();

// Get specific top-level fields from the glTF JSON chunk
const appData = gltf.getApplicationData('customData');

// Get a top level extension from the glTF JSON chunk
const topLevelExtension = gltf.getExtension('ORGNAME_extensionName');
if (topLevelExtension) {
  ...
}

// Get images from the binary chunk (together with metadata)
const imageIndex = 0;
const image = gltf.getImage(imageIndex);

// Get default glTF scenegraph
const scenegraph = gltf.getScene();
// Get specific glTF scenegraph
const scenegraph = gltf.getScene(2);
```

### Modifying

```js
import {load, encode} from '@loaders.gl/core';
import {ImageWriter} from '@loaders.gl/images';
import {GLTFLoader, GLTFWriter, GLTFScenegraph} from '@loaders.gl/gltf';

// Load and parse a file
const gltfData = await load(GLTF_URL, GLTFLoader);

const meshIndex = gltfBuilder.addMesh(gltfData.meshes[0].primitives[0].attributes);
const nodeIndex = gltfBuilder.addNode(meshIndex);
const sceneIndex = gltfBuilder.addScene([nodeIndex]);
gltfBuilder.setDefaultScene(sceneIndex);
const imageBuffer = await encode(gltfData.images[0].image, ImageWriter);
const imageIndex = gltfBuilder.addImage(imageBuffer, 'image/jpeg');
const textureIndex = gltfBuilder.addTexture(imageIndex);
const pbrMaterialInfo = {
  pbrMetallicRoughness: {
    baseColorTexture: textureIndex
  }
};
gltfBuilder.addMaterial(pbrMaterialInfo);
gltfBuilder.createBinaryChunk();

const gltfBuffer = encodeSync(gltfBuilder.gltf, GLTFWriter);
```

## Fields

### gltf: object

Contains all data of gltf including the json part and the binary chunk. The binary chunk is generated by `createBinChunk()` method

### sourceBuffers: Array&lt;ArrayBuffer | { arrayBuffer?: ArrayBuffer; buffer?: ArrayBuffer; byteOffset: number; byteLength: number}&gt;

Accumulates buffers of resources added by `addMesh()`, `addImage()` etc. These buffers should be compiled before encoding using `createBinaryChunk()`

### byteLength: number

Total byteLength of the binary part of gltf

## Accessor Methods

### constructor(gltf: object)

Creates a new `GLTFScenegraph` instance from a pure JavaScript object.

### json()

### getApplicationData(key: string): unknown

Returns the given data field in the top-level glTF JSON object.

### getExtraData(key: string): object?

Returns a key in the top-level glTF `extras` JSON object.

### getExtension(name: string): object?

Returns the top-level extension by `name`, if present.

### getUsedExtensions(): string[]

Returns an array of extension names (covering all extensions used at any level of the glTF hierarchy).

### getRequiredExtensions(): string[]

Returns an array of extensions at any level of the glTF hierarchy that are required to properly display this file (covering all extensions used at any level of the glTF hierarchy).

### getRemovedExtensions(): string[]

When loaders.gl parses a glTF file, by default it pre-processes and removes certain extensions (e.g. various mesh and image compression formats), see documentation on glTF extensions for more information. 

The resulting glTF is intended to be identical to a glTF created without those extensions. However in some cases it is useful to know what extensions were removed during preprocessing.

### getObjectExtension(object, extensionName)

### getScene([index: Number]): object?

Returns the scene (scenegraph) with the given index, or the default scene if no index is specified.

### getScene(index: Number): object

### getNode(index: Number): object

### getSkin(index: Number): object

### getMesh(index: Number): object

### getMaterial(index: Number): object

### getAccessor(index: Number): object

### getCamera(index: Number): object

### getTexture(index: Number): object

### getSampler(index: Number): object

### getImage(index: Number): object

Returns the image with specified index

### getBufferView(index: Number): object

### getBuffer(index: Number): object

### getTypedArrayForBufferView(bufferView: Number | object): Uint8Array

Accepts buffer view index or buffer view object

### getTypedArrayForAccessor(accessor: Number | object): Uint8Array | Float32Array | ...

Accepts accessor index or accessor object.

Returns a typed array with type that matches the types

### getTypedArrayForImageData(image: Number | object): Uint8Array

accepts accessor index or accessor object

## Modifiers

### addApplicationData(key, data)

Add an extra application-defined key to the top-level data structure

### addExtraData(key, data)

`extras` - Standard GLTF field for storing application specific data

Add to GLTF top level extension object, mark as used

### addRequiredExtension(extensionName, data)

Add GLTF top level extension object, mark as used and required

### registerUsedExtension(extensionName)

Add extensionName to list of used extensions

### registerRequiredExtension(extensionName)

Add extensionName to list of required extensions

### removeExtension(extensionName)

Removes an extension name string from the top-level glTF extension fields (`extensionsUsed` and `extensionsRequired`) if present. 
Also adds the same extensionName to the `extensionsRemoved`.

### setObjectExtension(object, extensionName, data)

### setDefaultScene(sceneIndex: number);

Set the default scene which is to be displayed at load time

### addScene(arguments: {nodeIndices: number[]}): number;

Add a scene to the json part

### addNode(arguments: {meshIndex: number}): number;

Add a node to the json part

### addMesh(arguments: {attributes: object, indices: object, material: number, mode = 4})

### addPointCloud(attributes)

### addBufferView(buffer)

Add one untyped source buffer, create a matching glTF `bufferView`, and return its index

> The binary data will not be added to the gltf buffer until `createBinChunk()` is called.

### addTexture(arguments: {imageIndex: number}): number;

Add a texture to the json part

### addMaterial(pbrMaterialInfo: object): number;

Add a material to the json part

### addAccessor(bufferViewIndex, accessor)

Adds an accessor to a bufferView

> The binary data will not be added to the gltf buffer until `createBinChunk()` is called.

### addImage(imageData, mimeType)

Adds a binary image. Builds glTF "JSON metadata" and saves buffer reference
Buffer will be copied into BIN chunk during "pack"

> The binary data will not be added to the gltf buffer until `createBinChunk()` is called.

### createBinChunk()

Packs any pending binary data into the first binary glTF buffer.

Note: Overwrites the existing first buffer if present.
