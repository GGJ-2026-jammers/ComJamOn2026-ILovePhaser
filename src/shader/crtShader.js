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
    attribute vec4 a_position;
    uniform vec4 u_offset;

    void main() {
        gl_Position = a_position + u_offset;
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