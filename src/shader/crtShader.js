const fragShader = `
#define SHADER_NAME CRT_FS
precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;

    // Curvatura de la pantalla
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0); 
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;

    // Bordes negros si se sale de la curva
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    vec4 color = texture2D(uMainSampler, uv);

    // Líneas de escaneo horizontales (Scanlines)
    float scanline = sin(uv.y * 800.0) * 0.04;
    color.rgb -= scanline;

    // Sombra en los bordes (Vignette)
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
    color.rgb *= vignette;

    gl_FragColor = color;
}
`;

const vertexShader = `
precision mediump float;

// Variables que Phaser nos pasa automáticamente
uniform mat4 uProjectionMatrix;
attribute vec2 inPosition;
attribute vec2 inTexCoord;

// Variable que le pasaremos al Fragment Shader
varying vec2 outTexCoord;

void main() {
    // 1. Copiamos la posición original
    vec2 posicion = inPosition;

    // 2. ¡AQUÍ ESTÁ LA MAGIA! 
    // Le sumamos 50 píxeles a la X para mover toda la geometría a la derecha
    posicion.x += 0.0; 
    
    // (Si quisieras moverlo abajo, le sumarías a posicion.y)

    // 3. Calculamos la posición final en la pantalla
    gl_Position = uProjectionMatrix * vec4(posicion, 1.0, 1.0);

    // 4. Pasamos las coordenadas de textura sin tocar
    outTexCoord = inTexCoord;
}
`;

// Exportamos la clase para poder usarla en el resto del juego
export default class TeleAntiguaPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game: game,
            name: 'TeleAntiguaPipeline',
            fragShader: fragShader,
            //vertShader: vertexShader
        });
    }
}