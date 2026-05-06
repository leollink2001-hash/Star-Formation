// Classe base (opzionale, utile per estendere)
class SpaceObject {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Proiezione semplice (ignoriamo z nel disegno)
    project() {
        return {
            x: canvas.width / 2 + this.x,
            y: canvas.height / 2 + this.y
        };
    }
}

// Classe Stella
class Star extends SpaceObject {
    constructor(x, y, z, radius, mass, birthdate) {
        super(x, y, z);
        this.radius = radius;
        this.mass = mass;
        this.birthdate = birthdate;
    }

    draw(ctx, actual_wave) {
        const pos = this.project();

        let color;

        switch (actual_wave) {

            case "Visible":
                // Calcoliamo il fattore di interpolazione (t) da 0.0 a 1.0
                // Se birthdate è 1, t = 0 (Rosa)
                // Se birthdate è 9, t = 1 (Azzurro)
                let t = (this.birthdate - 1) / 8;

                // Interpolazione lineare: Start + (End - Start) * t
                let r = Math.round(255 + (150 - 255) * t);
                let g = 500; // Il verde rimane costante come da tua richiesta
                let b = Math.round(150 + (255 - 100) * t);

                color = "rgb(" + r + ", " + g + ", " + b + ")";
                break;

            case "Near Infrared":
                color = "rgba(255, 0, 0, " + (1 - this.birthdate / 6) + ")"
                break;

            case "Far Infrared":
                color = "rgba(255,0,0,0.12)"
                break;

            case "Ultraviolet":
                color = "rgba(127, 0, 200, " + (this.birthdate / 10) + ")"
                break;

            case "Hα":
                color = "rgba(0,0,0,0)"
                break;

            case "Radio":
                color = "rgba(0,0,0,0)"
                break;

            case "CO":
                color = "rgba(0,0,0,0)"
                break;

            case "HI":
                color = "rgba(0,0,0,0)"
                break;

            case "X-ray":
                color = "rgba(50, 200, 255, " + (this.birthdate / 5) * (this.birthdate > 7) + ")"
                for (let i = 0; i < 10; i++) {
                    // Calcola una posizione casuale nell'intorno di X e Y
                    // (Math.random() - 0.5) restituisce un valore tra -0.5 e 0.5
                    // moltiplicato per lo spread sposta il quadrato vicino al centro
                    ctx.fillStyle = color;
                    const randX = 200 + (Math.random() - 0.5) * 120;
                    const randY = 100 + (Math.random() - 0.5) * 120;

                    ctx.fillRect(randX, randY, 20, 20);
                }
                break;

            // fallback
            default:
                color = "yellow";
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

// Classe Polvere
class Dust extends SpaceObject {
    constructor(x, y, z, size) {
        super(x, y, z);
        this.size = size;
    }
}

class DustLump extends SpaceObject {
    constructor(x, y, z, numParticles, spread, field) {
        super(x, y, z);
        this.field = field;

        this.particles = [];

        for (let i = 0; i < numParticles; i++) {
            // posizione relativa al centro del lump
            // Sommare 3 random e sottrarre 1.5 sposta il centro a 0 
            // e crea una distribuzione molto simile alla gaussiana.
            const dx = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
            const dy = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
            const dz = (Math.random() + Math.random() + Math.random() - 1.5) * spread;

            //const size = Math.random() * 4 + 2;

            this.particles.push(
                new Dust(dx, dy, dz)
            );
        }
    }

    draw(ctx, actual_wave) {

        // Ordina le particelle interne per z relativo
        this.particles.sort((a, b) => a.z - b.z);

        // valori di default (Visible)
        let color = `rgba(0, 0, 2, ${DUST_ALPHA})`;
        let size = R_DUST;

        switch (actual_wave) {

            case "Visible":
                color = `rgba(0, 0, 2, ${DUST_ALPHA})`;
                size = R_DUST;
                break;

            case "Near Infrared":
                color = `rgba(0, 0, 0, ${DUST_ALPHA / 4})`;
                size = R_DUST / 2;
                break;

            case "Far Infrared":
                color = `rgba(255, 0, 0, ${this.field})`;
                size = R_DUST * 0.5; // più piccoli
                break;

            case "Ultraviolet":
                color = `rgba(0, 0, 2, 1)`;
                size = R_DUST * 2;
                break;

            case "Hα":
                color = `rgba(0, 0, 2, 1)`;
                size = R_DUST * 2;
                break;

            case "Radio":
                color = `rgba(0, 0, 0, 0)`;
                size = R_DUST * 2;
                break;

            case "CO":
                color = `rgba(0, 0, 0, 0)`;
                size = R_DUST * 2;
                break;

            case "HI":
                color = `rgba(0, 0, 0, 0)`;
                size = R_DUST * 2;
                break;

            case "X-ray":
                color = `rgba(0, 0, 2, ${DUST_ALPHA / 2})`;
                size = R_DUST;
                break;

            // fallback
            default:
                color = `rgba(0, 0, 2, ${DUST_ALPHA})`;
                size = R_DUST;
        }

        for (let p of this.particles) {

            const globalX = this.x + p.x;
            const globalY = this.y + p.y;
            const globalZ = this.z + p.z;

            const screenX = canvas.width / 2 + globalX;
            const screenY = canvas.height / 2 + globalY;

            ctx.fillStyle = color;
            ctx.fillRect(screenX, screenY, size, size);
        }
    }
}



// Classe GasAtom
class GasAtom extends SpaceObject {
    constructor(x, y, z, size) {
        super(x, y, z);
        this.size = size;
    }
}
// Classe GasMol
class GasMol extends SpaceObject {
    constructor(x, y, z, size) {
        super(x, y, z);
        this.size = size;
    }
}

const atom_perc = 0.3;

class Gas extends SpaceObject {
    constructor(x, y, z, numParticles, spread) {
        super(x, y, z);

        this.particles = [];

        for (let i = 0; i < numParticles; i++) {
            // posizione relativa al centro del lump
            // Sommare 3 random e sottrarre 1.5 sposta il centro a 0 
            // e crea una distribuzione molto simile alla gaussiana.
            const dx = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
            const dy = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
            const dz = (Math.random() + Math.random() + Math.random() - 1.5) * spread;

            //const size = Math.random() * 4 + 2;

            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Logica spaziale: Esterno = Atomi, Interno = Molecole
            if (distance > 1 * spread) {
                this.particles.push(new GasAtom(dx, dy, dz));
            } else {
                this.particles.push(new GasMol(dx, dy, dz));
            }
        }
    }

    draw(ctx, actual_wave) {
        // Ordina le particelle per profondità
        this.particles.sort((a, b) => a.z - b.z);

        // Definiamo due configurazioni di stile
        let styleAtom = { color: `rgba(0, 0, 0, 0)`, size: 2 };
        let styleMol = { color: `rgba(0, 0, 0, 0)`, size: 2 };

        switch (actual_wave) {
            case "Hα":
                // Esempio: Atomi verde brillante, Molecole verde scuro
                //styleAtom = { color: `rgb(0, 255, 4)`, size: 2 };
                styleMol = { color: `rgb(0, 255, 2)`, size: 3 };
                break;

            case "Radio":
                // Esempio: Atomi verde brillante, Molecole verde scuro
                //styleAtom = { color: `rgb(0, 255, 4)`, size: 2 };
                styleMol = { color: `rgb(0, 255, 2, 0.01)`, size: 100 };
                break;

            case "CO":
                // Esempio: Atomi invisibili (o quasi), Molecole evidenti per il CO
                //styleAtom = { color: `rgba(255, 255, 255, 0.1)`, size: 2 };
                styleMol = { color: `rgba(234, 94, 0, 0.7)`, size: 6 };
                break;

            case "HI":
                // Esempio: Atomi invisibili (o quasi), Molecole evidenti per il CO
                styleAtom = { color: `rgba(0, 255, 242, 1)`, size: 4 };
                //styleMol  = { color: `rgb(0, 255, 4, 0.8)`, size: 6 };
                break;

            default:
                styleAtom = { color: `rgba(0, 0, 0, 0)`, size: 1 };
                styleMol = { color: `rgba(0, 0, 0, 0)`, size: 1 };
        }

        for (let p of this.particles) {
            const globalX = this.x + p.x;
            const globalY = this.y + p.y;

            const screenX = canvas.width / 2 + globalX;
            const screenY = canvas.height / 2 + globalY;

            // --- SELEZIONE DELLO STILE IN BASE AL TIPO ---
            let currentStyle;
            if (p instanceof GasAtom) {
                currentStyle = styleAtom;
            } else {
                currentStyle = styleMol;
            }

            ctx.fillStyle = currentStyle.color;
            ctx.fillRect(screenX, screenY, currentStyle.size, currentStyle.size);
        }
    }
}



// Generazione random nel cubo
function randomX() {
    return (Math.random() - 0.5) * SPACE_WIDTH;
}
function randomY() {
    return (Math.random() - 0.5) * SPACE_HEIGHT;
}
function randomZ() {
    return (Math.random() - 0.5) * SPACE_DEPTH;
}


// Loop di rendering
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 22)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ordina per z (dal più lontano al più vicino)
    objects.sort((a, b) => a.z - b.z);

    // Disegna
    for (let obj of objects) {
        obj.draw(ctx, actual_wave);
    }

    //requestAnimationFrame(draw);
}