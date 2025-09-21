// src/data/projects.js
import content from './content.json';

export const projects = content.projects;

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}

export default projects;
