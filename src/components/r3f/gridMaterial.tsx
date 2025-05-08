import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec3 vCamPos;

void main() {

  vUv = uv;
  vPosition = position;

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 cameraPosition = (inverse(viewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vViewDirection = normalize(cameraPosition - worldPosition.xyz);
  vCamPos = cameraPosition;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec3 vCamPos;

uniform float time;
uniform float uvScale;
uniform float secondaryOpacity;
uniform vec3 dotColor;

#define PI 3.1415926535897932384626433832795

vec2 scaledUV() {
  return (vUv - 0.5) * uvScale;
}

float fracLoop(float s) {
  return fract(time * s);
}

float sinLoop(float s){
  return sin(time * s) * 0.5 + 0.5;
}

vec2 gridUV(float s){
  vec2 scaledGrid = scaledUV() * s;
  return fract(scaledGrid) - 0.5;
}

float rectBorder(float x,float y,float w){
  float rectMask_Border_x = step(abs(abs(scaledUV()).x - x), w);
  float rectMask_Border_y = step(abs(abs(scaledUV()).y - y), w);
  float rectMask_Border = max( 
    min(rectMask_Border_x, step(abs(scaledUV()).y, y+w)), 
    min(rectMask_Border_y, step(abs(scaledUV()).x, x+w))
    );
  return rectMask_Border;
}


void main() {


  float sphereDistance = distance(scaledUV(), vec2(0.0));
  float distanceFadeMask = smoothstep(20.0, 2.0, sphereDistance);
  float scanLoop = smoothstep(3., 1., abs(sphereDistance + 4. - fracLoop(0.2) * 20.));
  float scanMask = mix(0.6, 1.1, scanLoop);
  float scanSize = mix(.0, 0.03, scanLoop);

  float dotSDF_S = smoothstep(0.06+scanSize, 0.04+scanSize, length(gridUV(4.))) * 0.8;
  float dotSDF_L = smoothstep(0.032+scanSize*0.5, 0.03+scanSize*0.5, length(gridUV(4./5.)));
  float plusLine = smoothstep(0.009+scanSize*0.1, 0.007+scanSize*0.1, min(abs(gridUV(4./5.)).x, abs(gridUV(4./5.)).y));
  float dotSDF = max(dotSDF_S * secondaryOpacity, min(dotSDF_L,plusLine));

  float gridLine_S = smoothstep(0.02, 0.01, min(abs(gridUV(4.)).x, abs(gridUV(4.)).y)) * 0.2;
  float gridLine_L = smoothstep(0.005, 0.004, min(abs(gridUV(4./5.)).x, abs(gridUV(4./5.)).y)) * 0.3;
  float gridLine = max(gridLine_S, gridLine_L);

  float ringMask_Circle = smoothstep(0.02, 0.01, abs(sphereDistance - 1.0 + sinLoop(1.) * 0.1));
  float ringMask_Seg = step(fract(atan(scaledUV().x, scaledUV().y) / PI * 4. + sinLoop(.9)),0.8);
  float ringMask = ringMask_Circle * ringMask_Seg;


  float rectMask_Border = rectBorder(0.4, 0.65, 0.008)*0.8;
  float rectMask_Corner = rectBorder(0.4, 0.65, 0.02) * step( 0.3, abs(scaledUV()).x) * step( 0.55, abs(scaledUV()).y);
  float rectMask = max(rectMask_Border, rectMask_Corner);

  vec3 color = dotColor;

  float opacity = distanceFadeMask * max(max(dotSDF, gridLine), max(ringMask, rectMask)) * scanMask;
  gl_FragColor = vec4(color, opacity);
}
`;

const CustomGridMaterial = shaderMaterial(
  {
    time: 0,
    uvScale: 40,
    dotColor: new Color("#a4c0f7"),
    secondaryOpacity: 1,
  },
  vertexShader,
  fragmentShader
);

extend({ CustomGridMaterial });

export { CustomGridMaterial };
