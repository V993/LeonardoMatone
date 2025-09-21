// src/data/index.js
import content from './content.json';

export const {
  navigation,
  theme,
  welcome,
  biography,
  experience,
  experienceCopy,
  education,
  educationCopy,
  about,
  contact,
  projects,
  projectsCopy,
  blogPosts,
  projectShowcase,
} = content;

export const getProjectById = (id) => projects.find((project) => project.id === id);

export default content;
