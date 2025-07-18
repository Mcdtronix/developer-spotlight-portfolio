const BASE_URL = '/api';

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}/`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAbout() {
  return fetchAPI('about');
}

export async function getContact() {
  return fetchAPI('contact');
}

export async function getHero() {
  return fetchAPI('hero');
}

export async function getNavigation() {
  return fetchAPI('navigation');
}

export async function getProjects() {
  return fetchAPI('projects');
}

export async function getSkills() {
  return fetchAPI('skills');
} 