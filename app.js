let currentIndex = 0;
let autoSlide;

let touchStartX = 0;
let touchEndX = 0;


// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    renderCandidateInfo(); // Display candidate information below the carousel
    renderQuiz(); 

  // Ensure this is only called when the "Stats" page is visible
  const defaultPage = window.location.hash.substring(1) || 'home';
  if (defaultPage === 'stats') {
    renderSchoolBreakdown(); // Render the school-wise breakdown
  }
    showPage(defaultPage);

});

document.getElementById('resetVotesButton').addEventListener('click', () => {
    // Reset the quiz history (votes)
    localStorage.clear();

    // Optionally, display a confirmation message to the user
    alert("All votes have been reset.");

    // You can also call other functions if you want to update the UI after resetting
    renderSchoolBreakdown();  // If you want to update the stats UI after reset
});


let candidates = [
    {
        id: 1,
        name: "Tiger of the North",
        party: "Lakas-CMD",
        image: "images/c1.png",
        policies: ["20 Pesos/KG Rice", "Flood Control", "Key point 3"],
        website: "Sama-Sama Tayong Babangon Muli"
    },

    {
        id: 2,
        name: "The Punisher of South",
        party: "PDP-Laban",
        image: "images/c2.png",
        policies: ["War On Drugs", "ICC Abolition", "Key point C"],
        website: "OMG I Hate Drugs!"
    },

    {
        id: 3,
        name: "Kuya Noy",
        party: "Liberal Party",
        image: "images/c3.png",
        policies: ["Maayos Na Kalsada", "Daang Matuwid", "Key point three"],
        website: "Kayo Ang Boss Ko"
    },

    {
        id: 4,
        name: "Glory Lavender",
        party: "Independent",
        image: "images/c4.png",
        policies: ["Economic Reform", "Fabcon For All", "Key point III"],
        website: "Glory For President Not Once, But Twice!"
    }

///////////ADD more candidate above this line increasing id number

];


function convertToURL(websiteString) {
  return 'https://' + websiteString
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')  // Remove punctuation
    .replace(/\s+/g, '');      // Remove spaces
}


const quizQuestions = [
  {
    text: "Which school are you from?",
    options: ["Harvard University", "University of Oxford", "Massachusetts Institute of Technology", "Others"],
    isMeta: true, // This question is only for classification
  },
////////////////

 ///Candidates: 1 Tiger, 2 Punisher, 3 Noy, 4 Glory
///Put points as needed ex; give Noy 4 pts, others 0 > 0, 0, 4 ,0

{
    text: "Education: What is your stance on free college and general education for all peoples?",
    options: [
      { label: "Strongly support", weights: [3, 5, 4, 2] },
      { label: "Support", weights: [1, 3, 4, 0] },
      { label: "Neutral", weights: [3, 5, 1, 3] },
      { label: "Oppose", weights: [2, 3, 2, 5] },
      { label: "Strongly Oppose", weights: [1, 5, 3, 2] },
    ],
  },

  {
    text: "Student Aid & Scholarships: Should the government expandscholarships and student loan programs?",
    options: [
      { label: "Yes, for all students", weights: [1, 2, 4, 4] },
      { label: "Yes, but only for low-income students", weights: [1, 3, 4, 1] },
      { label: "Keep the current system", weights: [5, 1, 4, 3] },
      { label: "No, it’s unnecessary", weights: [5, 3, 5, 2] },
      { label: "Not sure", weights: [3, 5, 5, 2] },
    ],
  },

  {
    text: "Climate & Environment: What kind of action should thegovernment take on climate change?",
    options: [
      { label: "Strong action (e.g., renewable energy, strict environmental laws)", weights: [3, 1, 5, 2] },
      { label: "Yes, but vary by region", weights: [1, 2, 4, 2] },
      { label: "Keep it the same", weights: [2, 3, 4, 3] },
      { label: "Let the private sector decide", weights: [1, 2, 3, 5] },
      { label: "Not sure", weights: [0, 5, 1, 2] },
    ],
  },

  {
    text: "Healthcare: What kind of healthcare system do you want for the Philippines?",
    options: [
      { label: "Free, universal healthcare", weights: [4, 1, 1, 2] },
      { label: "Public + private options", weights: [0, 5, 1, 2] },
      { label: "Improve current system", weights: [4, 1, 3, 3] },
      { label: "Fully privatized system", weights: [2, 4, 1, 3] },
      { label: "Not sure", weights: [2, 1, 4, 2] },
    ],
  },

  {
    text: "Labor & Minimum Wage: Should the minimum wage in the Philippines be increased?",
    options: [
      { label: "Yes, raise to ₱750 or more", weights: [2, 1, 0, 2] },
      { label: "Yes, but vary by region", weights: [3, 1, 2, 2] },
      { label: "Keep it the same", weights: [1, 1, 2, 3] },
      { label: "Let the private sector decide", weights: [4, 1, 0, 2] },
      { label: "Not sure", weights: [5, 1, 0, 2] },
    ],
  },

  {
    text: "Gun Control & Crime: What is your view on gun laws andaccess to firearms?",
    options: [
      { label: "Stricter gun laws", weights: [1, 0, 2, 2] },
      { label: "Background checks only", weights: [3, 1, 5, 2] },
      { label: "Keep current system", weights: [2, 5, 4, 4] },
      { label: "Loosen restrictions", weights: [2, 2, 5, 2] },
      { label: "Not sure", weights: [4, 2, 3, 2] },
    ],
  },

  {
    text: "Policing & Justice Reform: What reforms should be made to the police and justice system?",
    options: [
      { label: "Reduce police budget, invest in social services", weights: [0, 5, 4, 2] },
      { label: "More training and transparency", weights: [0, 1, 3, 2] },
      { label: "Keep it as is", weights: [1, 0, 4, 3] },
      { label: "Increase police funding", weights: [3, 1, 0, 1] },
      { label: "Not sure", weights: [2, 3, 5, 3] },
    ],
  },

  {
    text: "OFWs & Immigration: What policies should be in place for OFWs and immigration?",
    options: [
      { label: "Stronger protection for OFWs", weights: [2, 1, 4, 1] },
      { label: "Stricter immigration control", weights: [5, 2, 4, 2] },
      { label: "Easier deployment for Filipinos", weights: [3, 3, 3, 0] },
      { label: "Keep current system", weights: [3, 4, 2, 2] },
      { label: "Not sure", weights: [1, 5, 1, 0] },
    ],
  },

  {
    text: "Gender & LGBTQ+ Rights: Should the government pass laws protecting LGBTQ+ and gender equality?",
    options: [
      { label: "Yes, full legal protection (e.g., SOGIE Bill)", weights: [0, 1, 5, 2] },
      { label: "Some protections, leave the rest to LGUs", weights: [2, 1, 2, 2] },
      { label: "No new laws needed", weights: [1, 3, 4, 3] },
      { label: "Oppose such laws", weights: [3, 1, 3, 2] },
      { label: "Not sure", weights: [4, 1, 5, 2] },
    ],
  },

  {
    text: "Voting & Election Reform: What’s your view on the voting process in the Philippines",
    options: [
      { label: "Make it more accessible (online registration, education)", weights: [1, 3, 1, 2] },
      { label: "Keep it the same", weights: [2, 0, 4, 2] },
      { label: "Stricter rules (ID, limit absentee voting)", weights: [3, 2, 4, 5] },
      { label: "Make voting harder", weights: [3, 1, 4, 2] },
      { label: "Not sure", weights: [0, 1, 2, 3] },
    ],
  },


//////////// Add more questions above this line...
];


function renderQuiz() {
  const form = document.getElementById('quizForm');
  form.innerHTML = ""; // Clear existing content

  quizQuestions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionId = `q${index}`;
    questionDiv.innerHTML = `<p><strong>${question.text}</strong></p>`;

    question.options.forEach((opt, optIndex) => {
      const optionId = `${questionId}_option${optIndex}`;
      const label = question.isMeta ? opt : opt.label;

      questionDiv.innerHTML += `
        <label>
          <input type="radio" name="${questionId}" value="${optIndex}" />
          ${label}
        </label><br />
      `;
    });

    form.appendChild(questionDiv);
  });

  // Add Submit button
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.type = "button";
  submitBtn.onclick = submitQuiz;

  form.appendChild(submitBtn);
}

function submitQuiz() {
  const scores = Array(candidates.length).fill(0);
  let selectedSchool = null;

  // Collect all answers and calculate scores
  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i];
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (!selected) {
      alert("Please answer all questions.");
      return;
    }

    const selectedIndex = parseInt(selected.value);

    if (q.isMeta) {
      selectedSchool = q.options[selectedIndex];
    } else {
      const weights = q.options[selectedIndex].weights;
      weights.forEach((weight, index) => {
        scores[index] += weight;
      });
    }
  }

  const topScore = Math.max(...scores);
  const topCandidateIndex = scores.indexOf(topScore);
  const matchedCandidate = candidates[topCandidateIndex];

  // Show the modal with the candidate's information
  showModal(matchedCandidate, selectedSchool);

  // Save to localStorage for stats
  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");
  history.push({ school: selectedSchool, candidateId: matchedCandidate.id });
  localStorage.setItem("quizHistory", JSON.stringify(history));
}

function showModal(candidate, school) {
  const modal = document.getElementById("resultModal");

 // Show the modal with a smooth fade-in effect
  modal.classList.add("show");

  // Set the candidate's details in the modal
  document.getElementById("candidateImage").src = candidate.image;
  document.getElementById("candidateName").innerText = candidate.name;
  document.getElementById("candidateParty").innerText = `Party: ${candidate.party}`;
  document.getElementById("candidateMessage").innerText = `Your matched candidate supports: ${candidate.policies.join(', ')}`;
  document.getElementById("candidateWebsiteLink").href = convertToURL(candidate.website);

  // Show the modal
  modal.style.display = "block";

function closeModalAndGoHome() {
  // Hide the modal
  const modal = document.getElementById("resultModal");
  modal.classList.remove("show");

  // Reset quiz form inputs
  const form = document.getElementById("quizForm");
  form.reset(); // This clears all radio selections

  // Optional: Clear any dynamic HTML added in renderQuiz if needed
  // form.innerHTML = "";

  // Redirect to home
  showPage('home');
  history.pushState(null, '', '#home');
}

  // Close the modal when the user clicks the "X" button
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", closeModalAndGoHome, { once: true });


  // Close the modal if the user clicks anywhere outside of the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
 closeModalAndGoHome();
      window.removeEventListener("click", outsideClickHandler);
      modal.style.display = "none";
    }
  });
}


// Function to display quiz results grouped by school
function renderSchoolBreakdown() {
  const statsContent = document.getElementById('stats-content');
  statsContent.innerHTML = ""; // Clear existing content

  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");
  
  if (history.length === 0) {
    statsContent.innerHTML = "<p>No quiz results found.</p>";
    return;
  }

  // Group results by school
  const schoolResults = history.reduce((acc, entry) => {
    if (!acc[entry.school]) {
      acc[entry.school] = [];
    }
    acc[entry.school].push(entry.candidateId);
    return acc;
  }, {});

  // Display the results for each school
  for (let school in schoolResults) {
    const results = schoolResults[school];
    const totalVotes = results.length;

    // Count the number of times each candidate was selected for this school
    const candidateCount = candidates.map(candidate => ({
      candidate,
      count: results.filter(candidateId => candidateId === candidate.id).length
    }));

    // Find the candidate with the maximum count
    const topCandidate = candidateCount.reduce((max, current) => {
      return current.count > max.count ? current : max;
    }, { count: 0 });

    // Calculate the percentage of votes for each candidate
    candidateCount.forEach(({ candidate, count }) => {
      candidate.percentage = ((count / totalVotes) * 100).toFixed(2); // Calculate percentage
    });

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('school-breakdown-entry');
    
    resultDiv.innerHTML = `
      <h3>${school}'s Choice</h3>
      <p><strong>Most Preferred Candidate:</strong> ${topCandidate.candidate.name}</p>
      <p><strong>Party:</strong> ${topCandidate.candidate.party}</p>
      <p><strong>Policies:</strong> ${topCandidate.candidate.policies.join(', ')}</p>
      <p><strong>Votes:</strong>${topCandidate.count} out of ${totalVotes}  or (${Math.round((topCandidate.count / totalVotes) * 100)}% of total votes)</p>
      <img src="${topCandidate.candidate.image}" alt="${topCandidate.candidate.name}" class="candidate-image">
    `;

    // Display percentage of votes for each candidate in the school
    //resultDiv.innerHTML += `<h4>Vote Breakdown:</h4>`;
    //candidateCount.forEach(({ candidate, count, percentage }) => {
      //resultDiv.innerHTML += `
        //<p><strong>${candidate.name}:</strong> ${count} votes (${percentage}%)</p>
      //`;
    //});

    statsContent.appendChild(resultDiv);
  }
}





// Renders all slides into the carousel
function renderCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ""; // Clear any existing carousel items

    candidates.forEach((candidate, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        if (index === 0) item.classList.add('active'); // Make the first item active

        // Directly using src for images instead of data-src
        item.innerHTML = `
            <img src="${candidate.image}" alt="${candidate.name}">
            <div class="carousel-text">
                <h2>${candidate.name} – ${candidate.party}</h2>
                <ul>
                    ${candidate.policies.map(policy => `<li>${policy}</li>`).join('')}
                </ul>
<p>
  <a href="${convertToURL(candidate.website)}" target="_blank" rel="noopener noreferrer">
    ${candidate.website}
  </a>
</p>

            </div>
        `;

        carousel.appendChild(item);
    });
}

// Renders candidate information below the carousel
function renderCandidateInfo() {
    const candidateList = document.getElementById('candidate-list');
    candidateList.innerHTML = ""; // Clear any existing content

    candidates.forEach(candidate => {
        const candidateItem = document.createElement('div');
        candidateItem.classList.add('candidate-item');

        candidateItem.innerHTML = `
            <img src="${candidate.image}" alt="${candidate.name}" class="candidate-image">
            <div class="candidate-details">
                <h3>${candidate.name}</h3>
                <p><strong>Party:</strong> ${candidate.party}</p>
                <p><strong>Website:</strong> 
  <a href="${convertToURL(candidate.website)}" target="_blank" rel="noopener noreferrer">
    ${candidate.website}
  </a>
</p>


                <ul>
                    <strong>Policies:</strong>
                    ${candidate.policies.map(policy => `<li>${policy}</li>`).join('')}
                </ul>
            </div>
        `;
        
        candidateList.appendChild(candidateItem);
    });
}

// Update which slide is visible
function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => item.classList.remove('active'));
    const currentItem = items[currentIndex];
    currentItem.classList.add('active');
}

// Move forward or backward in the slide list
function moveSlide(direction) {
    const items = document.querySelectorAll('.carousel-item');
    currentIndex = (currentIndex + direction + items.length) % items.length;
    updateCarousel();
}

// Start auto-sliding
function startAutoSlide() {
    autoSlide = setInterval(() => {
        moveSlide(1);
    }, 5000); // every 5 seconds
}

// Stop auto-slide (for hover or manual pause)
function stopAutoSlide() {
    clearInterval(autoSlide);
}

// Setup everything
function initializeCarousel() {
    renderCarousel();
    startAutoSlide();

    document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
    document.querySelector('.next').addEventListener('click', () => moveSlide(1));

    // Pause auto-slide on hover
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
    
    // Swipe support for touch devices
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
}

function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
        // Swipe right
        moveSlide(-1);
    } else if (swipeDistance < -50) {
        // Swipe left
        moveSlide(1);
    }
}

// Basic SPA Navigation
const pages = document.querySelectorAll('.page');
const links = document.querySelectorAll('.nav-link');

function showPage(pageId) {
  pages.forEach(page => {
    page.style.display = page.id === pageId ? 'block' : 'none';
  });
    if (pageId === 'stats') {
        renderSchoolBreakdown();
    }

}

// Handle nav link clicks
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const pageId = link.getAttribute('href').substring(1);
    showPage(pageId);
    history.pushState(null, '', `#${pageId}`);
  });
});

// Handle back/forward browser buttons
window.addEventListener('popstate', () => {
  const pageId = window.location.hash.substring(1);
  showPage(pageId || 'home');
});
