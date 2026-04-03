console.log("JS RUNNING - French Riviera Guide");

document.addEventListener("DOMContentLoaded", function () {

  
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.querySelector(".search-container button");

    if (searchInput) {
        searchInput.addEventListener("focus", () => {
            searchInput.style.borderColor = "#006994";
            searchInput.style.boxShadow = "0 0 10px rgba(0, 105, 148, 0.2)";
        });

        searchInput.addEventListener("blur", () => {
            searchInput.style.borderColor = "#ccc";
            searchInput.style.boxShadow = "none";
        });

        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") searchSite();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", searchSite);
    }

    function searchSite() {
        const input = document.getElementById("searchInput");
        if (!input) return;
        const query = input.value.toLowerCase().trim();

        if (query === "") {
            alert("Please enter a search term.");
            return;
        }

        if (query.includes("nice") || query.includes("cannes") || query.includes("monaco") || query.includes("destinations")) {
            window.location.href = "destinations.html";
        } 
        else if (query.includes("food") || query.includes("culture") || query.includes("wine") || query.includes("eat")) {
            window.location.href = "foodandculture.html";
        } 
        else if (query.includes("weather") || query.includes("forecast") || query.includes("temp")) {
            window.location.href = "weather.html";
        } 
        else if (query.includes("plan") || query.includes("holiday") || query.includes("itinerary")) {
            window.location.href = "planner.html";
        } 
        else if (query.includes("contact") || query.includes("help") || query.includes("faq")) {
            window.location.href = "contact.html";
        }
        else if (query.includes("map")) {
            if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                const mapSection = document.getElementById("map");
                if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = "index.html#map";
            }
        } 
        else {
            alert("No results found for '" + query + "'. Try searching 'Food', 'Weather', or 'Cannes'.");
        }
    }

    
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) item.classList.remove('active');
            });

            faqItem.classList.toggle('active');
            document.querySelectorAll('.faq-question span').forEach(s => s.innerText = '+');
            const symbol = button.querySelector('span');
            if (symbol) {
                symbol.innerText = faqItem.classList.contains('active') ? '−' : '+';
            }
        });
    });

   
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const resultBox = document.getElementById('contactResult');
            resultBox.style.display = "block";
            resultBox.innerHTML = `<p style="color: #006994; font-weight: bold; padding: 15px; background: #e0f3ff; border-radius: 5px; margin-top: 20px;">
                Merci, ${name}! Your message has been sent to the Riviera team.</p>`;
            contactForm.reset();
        });
    }

 
    if (document.getElementById('weather-date')) {
        setupWeatherCalendar();
        updateAllWeather();
        setInterval(updateRivieraTime, 60000); 
        updateRivieraTime();
        document.getElementById('weather-date').addEventListener('change', updateAllWeather);
    }

  
    if (document.getElementById("map")) {
        initMap();
    }
});


let slideIndex = 1;
function plusSlides(n) { showSlides(slideIndex += n); }
function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block";  
}

setTimeout(() => {
    if (document.getElementsByClassName("mySlides").length > 0) {
        showSlides(slideIndex);
    }
}, 100);

// --- WEATHER HELPERS ---
function setupWeatherCalendar() {
    const dateInput = document.getElementById('weather-date');
    if (!dateInput) return;
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14); 
    const formatDate = (d) => d.toISOString().split('T')[0];
    dateInput.value = formatDate(today);
    dateInput.min = formatDate(today);
    dateInput.max = formatDate(maxDate);
}

async function updateAllWeather() {
    const dateInput = document.getElementById('weather-date');
    if (!dateInput) return;
    const selectedDateStr = dateInput.value;
    const cities = [
        { id: "nice", lat: 43.71, lon: 7.26 },
        { id: "cannes", lat: 43.55, lon: 7.01 },
        { id: "monaco", lat: 43.73, lon: 7.42 }
    ];

    for (let city of cities) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,wind_speed_10m_max,precipitation_sum&start_date=${selectedDateStr}&end_date=${selectedDateStr}&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.daily) {
                document.getElementById(`temp-${city.id}`).innerText = data.daily.temperature_2m_max[0] + "°C";
                document.getElementById(`wind-${city.id}`).innerText = data.daily.wind_speed_10m_max[0] + " km/h";
                document.getElementById(`rain-${city.id}`).innerText = data.daily.precipitation_sum[0] + " mm";
            }
        } catch (error) {
            console.error("Weather Error:", error);
        }
    }
}

function updateRivieraTime() {
    const clockElement = document.getElementById('local-clock');
    if (!clockElement) return;
    const options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false };
    const rivieraTime = new Intl.DateTimeFormat('en-GB', options).format(new Date());
    clockElement.innerText = `Local Time in Nice: ${rivieraTime} (CET)`;
}


function generatePlan() {
    const days = document.getElementById("days").value;
    const activity = document.getElementById("activities").value;
    const food = document.getElementById("food").value;
    const shopping = document.getElementById("shopping").value;
    const output = document.getElementById("planOutput");
    const header = document.getElementById("resultHeader");

    if (!days || days < 1) {
        alert("Please enter a valid number of days.");
        return;
    }

    let message = `For your ${days}-day stay, we suggest starting in ${activity.charAt(0).toUpperCase() + activity.slice(1)}. `;
    if (food === "traditional") message += "Don't miss the local Socca! ";
    if (shopping === "luxurycasual") message += "Explore the boutiques on the Croisette.";

    header.innerHTML = "✨ Your Riviera Itinerary ✨";
    output.innerHTML = message;
    output.style.display = "block";
    output.style.padding = "20px";
    output.style.background = "#f0f7f9";
    output.style.borderLeft = "5px solid #006994";
}


async function initMap() {
    
    if (typeof google === 'undefined') return;

    const { Map } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");

    const rivieraCenter = { lat: 43.7102, lng: 7.2620 };
    
    const map = new Map(document.getElementById("map"), {
        zoom: 10,
        center: rivieraCenter,
        mapId: "DEMO_MAP_ID" 
    });

    const locations = [
        { title: "Nice", pos: { lat: 43.7102, lng: 7.2620 } },
        { title: "Monaco", pos: { lat: 43.7384, lng: 7.4246 } },
        { title: "Cannes", pos: { lat: 43.5528, lng: 7.0174 } }
    ];

    locations.forEach(location => {
        new Marker({
            position: location.pos,
            map: map,
            title: location.title,
        });
    });
}
