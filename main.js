// Unified Main JS for FootVision
document.addEventListener('DOMContentLoaded', () => {
  // Live Matches page
  if (document.getElementById('matches')) {
    loadMatches();
  }

  // Highlights page
  if (document.getElementById('highlights')) {
    loadHighlights();
  }

  // News page
  if (document.getElementById('news-list')) {
    loadNews();
  }
});

// -----------------------
// Live Matches Functions
// -----------------------
async function loadMatches() {
  const matchesDiv = document.getElementById("matches");
  matchesDiv.innerHTML = '<p>Loading live matches...</p>';
  try {
    const res = await fetch('/.netlify/functions/liveMatches');
    const data = await res.json();
    matchesDiv.innerHTML = '';

    if (!data.response.length) {
      matchesDiv.innerHTML = '<p>No live matches right now</p>';
      return;
    }

    data.response.forEach(match => {
      const card = createMatchCard(match, true); // true = live match
      matchesDiv.appendChild(card);
      simulateMatch(match.fixture.id);
      const ball = card.querySelector('.ball');
      ballGlowEffect(ball, card);
    });

  } catch (err) {
    console.error(err);
    matchesDiv.innerHTML = '<p>⚠️ Failed to load matches.</p>';
  }
}

// -----------------------
// Highlights Functions
// -----------------------
async function loadHighlights() {
  const container = document.getElementById('highlights');
  container.innerHTML = '<p>Loading highlights...</p>';
  try {
    const res = await fetch('/.netlify/functions/liveMatches');
    const data = await res.json();
    const finished = data.response.filter(m => m.fixture.status.short === 'FT');
    container.innerHTML = '';

    if (!finished.length) {
      container.innerHTML = '<p>No highlights available yet.</p>';
      return;
    }

    finished.forEach(match => {
      const card = createMatchCard(match, false, 'Full Time'); // false = not live
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>⚠️ Failed to load highlights.</p>';
  }
}

// -----------------------
// News Functions (placeholder)
// -----------------------
function loadNews() {
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = `
    <li>Breaking: Latest football news coming soon...</li>
    <li>Top transfers updates will be here...</li>
    <li>Injury reports and analysis updates...</li>
  `;
}

// -----------------------
// Utility: Create Match Card
// -----------------------
function createMatchCard(match, live = false, minuteText = null) {
  const card = document.createElement('div');
  card.className = 'match-card';
  card.id = `match-${match.fixture.id}`;

  card.innerHTML = `
    <div class="teams">
      <div class="team">
        <img src="${match.teams.home.logo}" alt="${match.teams.home.name}">
        <strong>${match.teams.home.name}</strong>
      </div>
      <div class="score">${match.goals.home} - ${match.goals.away}</div>
      <div class="team">
        <strong>${match.teams.away.name}</strong>
        <img src="${match.teams.away.logo}" alt="${match.teams.away.name}">
      </div>
    </div>
    <div class="minute">${minuteText || (match.fixture.status.elapsed || 0) + "'"}</div>
    ${live ? `<div class="mini-field"><div class="ball"></div></div>
    <div class="possession"><span class="home-bar"></span><span class="away-bar"></span></div>` : ''}
    <div class="links">
      <a href="watch.html">Watch</a> | 
      <a href="free.html">Free View</a>
    </div>
  `;
  return card;
}

// -----------------------
// Ball Simulation
// -----------------------
function simulateMatch(matchId) {
  const card = document.getElementById(`match-${matchId}`);
  const ball = card.querySelector('.ball');
  const homeBar = card.querySelector('.home-bar');
  const awayBar = card.querySelector('.away-bar');

  setInterval(() => {
    const x = Math.random() * 188;
    const y = Math.random() * 68;
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';

    const homePoss = Math.floor(Math.random() * 60) + 20;
    const awayPoss = 100 - homePoss;
    homeBar.style.width = homePoss + '%';
    awayBar.style.width = awayPoss + '%';
  }, 2000);
}

// -----------------------
// Ball Glow Effect
// -----------------------
function ballGlowEffect(ball, card) {
  const homeImg = card.querySelector('.team img:first-child');
  const awayImg = card.querySelector('.team img:last-child');

  setInterval(() => {
    const ballRect = ball.getBoundingClientRect();
    const homeRect = homeImg.getBoundingClientRect();
    const awayRect = awayImg.getBoundingClientRect();

    homeImg.classList.toggle('glow', Math.abs(ballRect.left - homeRect.left) < 50);
    awayImg.classList.toggle('glow', Math.abs(ballRect.left - awayRect.left) < 50);
  }, 200);
}
