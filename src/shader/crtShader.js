const fragShader = `
#define SHADER_NAME CRT_FS
precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
uniform float move; // Tu variable de tiempo/progreso

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = outTexCoord;

    // Curvatura de la pantalla
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0); 
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;

    // Wiggle
    float wiggle = 0.0002;
    uv.x += sin(uv.y * 15.0 + move * 10.0) * wiggle;

    // Bordes negros si se sale de la curva
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Aberración cormatica
    float desface = 0.0005; // Aumenta esto a 0.005 para marear al jugador
    float r = texture2D(uMainSampler, vec2(uv.x + desface, uv.y)).r;
    float g = texture2D(uMainSampler, uv).g;
    float b = texture2D(uMainSampler, vec2(uv.x - desface, uv.y)).b;
    vec4 color = vec4(r, g, b, 1.0);

    float ruido = rand(uv + move) * 0.08; // 0.08 es la opacidad del ruido
    color.rgb -= ruido;

    // 1. Líneas de escaneo horizontales finas (fijas o con un movimiento muy leve)
    float scanline = sin(uv.y * 400.0) * 0.04; 
    color.rgb -= scanline;

    // - El "8.0" controla cuántas bandas caben en la pantalla (menos = más gruesa).
    // - El "3.0" controla la velocidad a la que baja la banda.
    float onda = sin(uv.y * 8.0 + move * 0.8); 
    float banda = smoothstep(0.95, 1.0, onda) * 0.15;
    color.rgb += banda;

    // 3. Sombra en los bordes (Vignette)
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.4), 0.0, 1.0);
    color.rgb *= vignette;

    gl_FragColor = color;
}
`;

const vertexShader = `
precision mediump float;

// En PostFX, Phaser solo nos pasa estos dos
attribute vec2 inPosition;
attribute vec2 inTexCoord;

varying vec2 outTexCoord;

void main() {
    vec2 posicion = inPosition;

    // Como el espacio va de -1.0 (izquierda) a 1.0 (derecha), 
    // sumar 0.2 mueve la pantalla un 10% a la derecha.
    posicion.x += 0.2; 
    
    // Asignamos la posición final (x, y, z=0.0, w=1.0)
    gl_Position = vec4(posicion, 0.0, 1.0);

    // Pasamos las coordenadas de textura intactas
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

        this.progress = 0;
    }

    setProgress(val) {
        this.progress = val;
    }

    onPreRender() {
        this.set1f('move', this.progress);
    }
}