function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

function computeFieldAtPoint(x, y, z, stars) {
    let sum = 0;

    for (let star of stars) {
        const dx = x - star.x;
        const dy = y - star.y;
        const dz = z - star.z;
        const r = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        // evita divisione per zero
        if (r > 0) {
            sum += 2 * star.birthdate**2 / (r * r);
        }
    }
    return sum;
}