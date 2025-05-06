document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../sitemap.json");
    const sitemap = await response.json();

    const featuresContainer = document.querySelector(".features");
    featuresContainer.innerHTML = ""; // Clear existing cards

    // Filter out items without children (leaf nodes)
    const mainSections = sitemap.filter((item) => item.children);

    // Create cards for each main section
    mainSections.forEach((section) => {
      const card = createCard(section);
      featuresContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading sitemap:", error);
  }
});

function createCard(section) {
  const card = document.createElement("div");
  card.className = "feature-card";

  const icon = document.createElement("div");
  icon.className = "feature-icon";
  icon.innerHTML = `<i class="${section.icon}"></i>`;

  const title = document.createElement("h2");
  title.textContent = section.text;

  const description = document.createElement("p");
  description.textContent = getDescription(section);

  const button = document.createElement("a");
  button.className = "cta-button";
  button.textContent = "学習を始める";
  button.href = getFirstPageHref(section);

  card.appendChild(icon);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(button);

  return card;
}

function getDescription(section) {
  // Get the first child's text as description
  if (section.children && section.children.length > 0) {
    const firstChild = section.children[0];
    if (firstChild.children && firstChild.children.length > 0) {
      return firstChild.children[0].text;
    }
    return firstChild.text;
  }
  return "詳細な学習コンテンツを提供しています。";
}

function getFirstPageHref(section) {
  // Get the first available href from the section's children
  if (section.children && section.children.length > 0) {
    // First, try to find a direct child with href
    const directChild = section.children.find((child) => child.href);
    if (directChild) {
      return "../" + directChild.href;
    }

    // If no direct child has href, look in grandchildren
    for (const child of section.children) {
      if (child.children && child.children.length > 0) {
        const grandChild = child.children.find((gc) => gc.href);
        if (grandChild) {
          return "../" + grandChild.href;
        }
      }
    }
  }
  return "#";
}
