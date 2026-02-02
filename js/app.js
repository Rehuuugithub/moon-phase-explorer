/* ================================================
   COSMIC ECHOES - Main JavaScript Application
   Pure Vanilla JavaScript - No dependencies
   ================================================ */

// ------------------------------------------------
// Moon Phase Data
// ------------------------------------------------
const MOON_PHASES = [
    {
        name: "New Moon",
        emoji: "🌑",
        image: "https://tse2.mm.bing.net/th?id=OIP.eCSzQqyDdJMd7BSG2aaCKwHaHa&pid=Api&P=0&h=220"
    },
    {
        name: "Waxing Crescent",
        emoji: "🌒",
        image: "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQzNi0xLWdzZmNfMjAxNzEyMDhfYXJjaGl2ZV9lMDAwODY1LmpwZw.jpg"
    },
    {
        name: "First Quarter",
        emoji: "🌓",
        image: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg"
    },
    {
        name: "Waxing Gibbous",
        emoji: "🌔",
        image: "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg"
    },
    {
        name: "Full Moon",
        emoji: "🌕",
        image: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg"
    },
    {
        name: "Waning Gibbous",
        emoji: "🌖",
        image: "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg"
    },
    {
        name: "Last Quarter",
        emoji: "🌗",
        image: "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg"
    },
    {
        name: "Waning Crescent",
        emoji: "🌘",
        image: "https://live.staticflickr.com/7084/6880158358_fddfdcfb8f_b.jpg"
    }
];

// Phase image map for display component
const PHASE_IMAGE_MAP = {
    "New Moon": "https://tse2.mm.bing.net/th?id=OIP.eCSzQqyDdJMd7BSG2aaCKwHaHa&pid=Api&P=0&h=220",
    "Waxing Crescent": "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQzNi0xLWdzZmNfMjAxNzEyMDhfYXJjaGl2ZV9lMDAwODY1LmpwZw.jpg",
    "First Quarter": "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
    "Waxing Gibbous": "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg",
    "Full Moon": "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
    "Waning Gibbous": "https://images-assets.nasa.gov/image/PIA00304/PIA00304~medium.jpg",
    "Last Quarter": "https://images-assets.nasa.gov/image/PIA00302/PIA00302~medium.jpg",
    "Waning Crescent": "https://live.staticflickr.com/7084/6880158358_fddfdcfb8f_b.jpg"
};

// Weather conditions
const WEATHER_CONDITIONS = ["Clear", "Partly Cloudy", "Cloudy", "Rain", "Snow"];

// ------------------------------------------------
// Moon Phase Calculation (Accurate Algorithm)
// ------------------------------------------------
function calculateMoonPhase(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Julian day calculation
    const a = Math.floor((14 - month) / 12);
    const y = year - a;
    const m = month + 12 * a - 3;

    const jd = day +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045;

    // Days since known new moon (January 6, 2000)
    const daysSinceNewMoon = jd - 2451549.5;

    // Moon cycle is approximately 29.53059 days
    return daysSinceNewMoon % 29.53059;
}

function getMoonPhaseFromDays(daysSinceNewMoon) {
    // Handle negative values (dates before the reference date)
    // Normalize to positive cycle position
    const lunarCycle = 29.53059;
    let normalizedDays = daysSinceNewMoon % lunarCycle;
    if (normalizedDays < 0) {
        normalizedDays += lunarCycle;
    }

    const phaseIndex = Math.floor((normalizedDays / lunarCycle) * 8) % 8;
    const illumination = Math.abs(Math.cos((normalizedDays / lunarCycle) * Math.PI * 2));

    const phaseNames = [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Last Quarter",
        "Waning Crescent"
    ];

    // Ensure phaseIndex is valid
    const safePhaseIndex = Math.abs(phaseIndex) % 8;

    return {
        phase: phaseNames[safePhaseIndex],
        illumination: illumination,
        age: Math.abs(normalizedDays),
        phaseAngle: (normalizedDays / lunarCycle) * 360
    };
}

// ------------------------------------------------
// Moon Animation (Landing Page)
// ------------------------------------------------
let moonAnimationInterval = null;
let currentPhaseIndex = 0;

function initMoonAnimation() {
    const moonImage = document.getElementById('hero-moon-image');
    if (!moonImage) return;

    // Set initial image
    moonImage.src = MOON_PHASES[currentPhaseIndex].image;

    // Cycle through phases every 3 seconds
    moonAnimationInterval = setInterval(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % MOON_PHASES.length;

        // Fade effect
        moonImage.style.opacity = '0.5';

        setTimeout(() => {
            moonImage.src = MOON_PHASES[currentPhaseIndex].image;
            moonImage.style.opacity = '1';
        }, 300);
    }, 3000);
}

// ------------------------------------------------
// Moon Phases Grid (Landing Page)
// ------------------------------------------------
function renderMoonPhasesGrid() {
    const grid = document.getElementById('moon-phases-grid');
    if (!grid) return;

    grid.innerHTML = MOON_PHASES.map((phase, index) => `
        <div class="moon-phase-card flex flex-col items-center cursor-pointer">
            <div class="moon-phase-image w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 flex items-center justify-center mb-3 relative overflow-hidden">
                <img src="${phase.image}" 
                     alt="${phase.name}" 
                     class="w-full h-full object-cover rounded-full"
                     crossorigin="anonymous"
                     loading="lazy">
            </div>
            <p class="moon-phase-name text-sm text-center text-gray-300">${phase.name}</p>
        </div>
    `).join('');
}

// ------------------------------------------------
// Results Page Functionality
// ------------------------------------------------
function initResultsPage() {
    const birthdateInput = document.getElementById('birthdate-input');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (!birthdateInput || !submitBtn) return;

    // Set max date to today
    birthdateInput.max = new Date().toISOString().split('T')[0];

    // Submit button handler
    submitBtn.addEventListener('click', handleSubmit);

    // Enter key handler
    birthdateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });

    // Reset button handler
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
}

async function handleSubmit() {
    const birthdateInput = document.getElementById('birthdate-input');
    const errorMessage = document.getElementById('error-message');
    const resultsSection = document.getElementById('results-section');
    const loadingSection = document.getElementById('loading-section');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const submitBtn = document.getElementById('submit-btn');

    const date = birthdateInput.value;

    // Validation
    if (!date) {
        showError("Please enter your date of birth");
        return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate > today) {
        showError("Date cannot be in the future");
        return;
    }

    // Clear previous error
    hideError();

    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;
    resultsSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    try {
        // Calculate moon data locally (always works, no API needed)
        const daysSinceNewMoon = calculateMoonPhase(selectedDate);
        const moonData = getMoonPhaseFromDays(daysSinceNewMoon);

        // Try to fetch from API, but don't fail if it doesn't work
        try {
            const apiMoonData = await fetchMoonDataFromAPI(selectedDate);
            if (apiMoonData) {
                Object.assign(moonData, apiMoonData);
            }
        } catch (apiError) {
            console.log("API unavailable, using calculated moon data");
        }

        // Get weather data (simulated)
        const weatherData = getWeatherData();

        // Get moon image (use fallback if API fails)
        const moonImageUrl = getMoonImageForPhase(moonData.phase);

        // Display results
        displayResults(moonData, weatherData, moonImageUrl, date);

        // Show results section
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        showError("Failed to calculate moon phase. Please try again.");
        loadingSection.classList.add('hidden');
    } finally {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

async function fetchMoonDataFromAPI(selectedDate) {
    // Try FarmSense Moon Phase API
    const response = await fetch(
        `https://api.farmsense.net/v1/moonphases/?d=${selectedDate.getTime()}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
        const targetTime = selectedDate.getTime();
        const closestPhase = data.reduce((prev, curr) => {
            return Math.abs(curr.Timestamp - targetTime) < Math.abs(prev.Timestamp - targetTime)
                ? curr
                : prev;
        });

        return {
            phase: closestPhase.Phase || "Full Moon",
            illumination: closestPhase.Illumination || 1,
            age: Math.abs((targetTime - closestPhase.Timestamp) / (1000 * 60 * 60 * 24)),
            phaseAngle: (closestPhase.Illumination || 1) * 360
        };
    }
    return null;
}

function getMoonImageForPhase(phase) {
    return PHASE_IMAGE_MAP[phase] || PHASE_IMAGE_MAP["Full Moon"];
}

async function fetchMoonImage(phase, date) {
    try {
        // Try NASA Image Library
        const searchQuery = `moon phase ${phase.toLowerCase()}`;
        const response = await fetch(
            `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image&page=1&page_size=10`
        );
        const data = await response.json();

        if (data.collection?.items?.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(5, data.collection.items.length));
            const selectedItem = data.collection.items[randomIndex];

            if (selectedItem.links?.[0]?.href) {
                return selectedItem.links[0].href;
            }
        }
        throw new Error("No NASA image found");
    } catch (error) {
        console.log("NASA API failed, using fallback image...");
        // Use fallback from phase map
        return PHASE_IMAGE_MAP[phase] || PHASE_IMAGE_MAP["Full Moon"];
    }
}

function getWeatherData() {
    // Simulated weather data
    const randomCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];

    return {
        temperature: Math.floor(Math.random() * 30) + 5,
        conditions: randomCondition,
        cloudCover: Math.floor(Math.random() * 100)
    };
}

function displayResults(moonData, weatherData, moonImageUrl, date) {
    // Update moon image
    const moonImage = document.getElementById('moon-result-image');
    moonImage.src = moonImageUrl;
    moonImage.alt = `${moonData.phase} on ${date}`;

    // Update moon details
    document.getElementById('phase-name').textContent = moonData.phase;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('phase-description').textContent =
        `On ${formattedDate}, the moon was in its ${moonData.phase.toLowerCase()} phase.`;

    document.getElementById('moon-age').textContent = moonData.age.toFixed(1);
    document.getElementById('moon-illumination').textContent = (moonData.illumination * 100).toFixed(0);

    // Update weather details
    document.getElementById('weather-temp').textContent = weatherData.temperature;
    document.getElementById('weather-conditions').textContent = weatherData.conditions;
    document.getElementById('weather-clouds').textContent = weatherData.cloudCover;

    // Update download button
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.href = moonImageUrl;
    downloadBtn.download = `moon-${date}.jpg`;
}

function handleReset() {
    const resultsSection = document.getElementById('results-section');
    const birthdateInput = document.getElementById('birthdate-input');

    resultsSection.classList.add('hidden');
    birthdateInput.value = '';
    birthdateInput.focus();
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden');
}

// ------------------------------------------------
// Cleanup on page unload
// ------------------------------------------------
window.addEventListener('beforeunload', () => {
    if (moonAnimationInterval) {
        clearInterval(moonAnimationInterval);
    }
});
