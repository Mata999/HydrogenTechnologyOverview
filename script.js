async function loadJSON(url) {
    const response = await fetch(url);
    return response.json();
}

function createTechBox(tech, depth = 0) {
    const box = document.createElement('div');
    box.className = `tech-box ml-${depth * 4} mb-2`;
    box.innerHTML = `
        <div class="flex items-center">
            <span class="font-semibold cursor-pointer">${tech.name}</span>
            ${tech.description ? '<span class="ml-2 cursor-pointer">ℹ️</span>' : ''}
        </div>
        <div class="info-box bg-gray-100 p-2 mt-1 rounded shadow-md max-w-md hidden">
            <p class="text-sm">${tech.description || ''}</p>
            ${tech.physics ? `<p class="text-sm mt-2"><strong>Physics:</strong> ${tech.physics}</p>` : ''}
            ${tech.chemistry ? `<p class="text-sm mt-2"><strong>Chemistry:</strong> ${tech.chemistry}</p>` : ''}
            ${tech.engineering ? `<p class="text-sm mt-2"><strong>Engineering:</strong> ${tech.engineering}</p>` : ''}
            ${tech.advantages ? `
                <div class="mt-2">
                    <strong class="text-green-600">Advantages:</strong>
                    <ul class="list-disc list-inside text-sm">
                        ${tech.advantages.map(adv => `<li>${adv}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${tech.disadvantages ? `
                <div class="mt-2">
                    <strong class="text-red-600">Disadvantages:</strong>
                    <ul class="list-disc list-inside text-sm">
                        ${tech.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${tech.suitabilityForP2P ? `
                <div class="mt-2">
                    <strong class="text-blue-600">Suitability for P2P:</strong>
                    <p class="text-sm">${tech.suitabilityForP2P}</p>
                </div>
            ` : ''}
            ${tech.efficiency ? `
                <div class="mt-2">
                    <strong>Efficiency:</strong>
                    <p class="text-sm">${tech.efficiency}</p>
                </div>
            ` : ''}
            ${tech.costAnalysis ? `
                <div class="mt-2">
                    <strong>Cost Analysis:</strong>
                    <p class="text-sm">${tech.costAnalysis}</p>
                </div>
            ` : ''}
            ${tech.futureProspects ? `
                <div class="mt-2">
                    <strong>Future Prospects:</strong>
                    <p class="text-sm">${tech.futureProspects}</p>
                </div>
            ` : ''}
        </div>
    `;

    if (tech.subtechnologies) {
        const subtechsContainer = document.createElement('div');
        subtechsContainer.className = 'ml-4 hidden';
        tech.subtechnologies.forEach(subtech => {
            subtechsContainer.appendChild(createTechBox(subtech, depth + 1));
        });
        box.appendChild(subtechsContainer);
    }

    box.querySelector('.tech-box > div').addEventListener('click', () => {
        const infoBox = box.querySelector('.info-box');
        infoBox.classList.toggle('hidden');
        
        if (tech.subtechnologies) {
            const subtechsContainer = box.querySelector('.ml-4');
            subtechsContainer.classList.toggle('hidden');
        }
    });

    return box;
}

async function initializeApp() {
    const app = document.getElementById('app');
    try {
        const creationData = await loadJSON('creation.json');
        const storageData = await loadJSON('storage.json');
        const conversionData = await loadJSON('conversion.json');
        
        const data = [creationData, storageData, conversionData];

        data.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'border p-4 rounded mb-4';
            categoryDiv.innerHTML = `
                <h2 class="text-xl font-semibold mb-2">${category.name}</h2>
                <p class="text-sm mb-4">${category.description}</p>
            `;
            category.technologies.forEach(tech => {
                categoryDiv.appendChild(createTechBox(tech));
            });
            app.appendChild(categoryDiv);
        });
    } catch (error) {
        console.error('Error loading JSON data:', error);
        app.innerHTML = '<p class="text-red-500">Error loading data. Please check the console for details.</p>';
    }
}

initializeApp();