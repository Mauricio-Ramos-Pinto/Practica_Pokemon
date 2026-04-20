async function buscarPokemon() {
    const input = document.getElementById('pokemonInput').value.toLowerCase().trim();
    const container = document.getElementById('pokedex-container');
    
    if (!input) return;

    container.innerHTML = '<p>Cargando datos completos...</p>';

    try {
        // 1. Datos del Pokémon
        const resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!resPoke.ok) throw new Error("Pokémon no encontrado");
        const data = await resPoke.json();

        // 2. Datos de la Especie (para descripción en español)
        const resSpec = await fetch(data.species.url);
        const dataSpec = await resSpec.json();

        const descripcion = dataSpec.flavor_text_entries.find(entry => entry.language.name === 'es')?.flavor_text || "Sin descripción.";
        const especie = dataSpec.genera.find(gen => gen.language.name === 'es')?.genus || "Desconocida";

        // 3. Renderizar todo el contenido
        container.innerHTML = `
            <div class="pokedex-card">
                <div class="left-side">
                    <img src="${data.sprites.other['official-artwork'].front_default}" class="main-img">
                </div>
                
                <div class="right-side">
                    <small>#${data.id}</small>
                    <h2>${data.name}</h2>
                    
                    <div class="info-table">
                        <p><strong>Especie:</strong> ${especie}</p>
                        <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                        <p><strong>Altura:</strong> ${data.height / 10} m | <strong>Peso:</strong> ${data.weight / 10} kg</p>
                        <hr>
                        <p style="font-style: italic;">"${descripcion.replace(/\n/g, ' ')}"</p>
                    </div>

                    <div class="stats-table">
                        <strong>Estadísticas Base:</strong>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 10px;">
                            ${data.stats.map(s => `<div>${s.stat.name}: ${s.base_stat}</div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

    } catch (e) {
        container.innerHTML = `<p style="color:red">Error: ${e.message}</p>`;
        console.error(e);
    }
}