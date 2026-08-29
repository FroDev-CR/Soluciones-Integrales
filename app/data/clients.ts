import clientData from "./clients.json";

export type ClientStory = {
  id: string;
  name: string;
  sector: string;
  service: string;
  approvedForPublication: boolean;
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
  };
};

// Only names and comments supplied and approved by the business belong here.
// An empty collection intentionally renders a clearly labeled preparation state.
export const clientStories: ClientStory[] = clientData;

export function publishedClients(stories: ClientStory[]) {
  return stories.filter((story) => story.approvedForPublication === true && story.id.trim() && story.name.trim());
}

export function clientInitials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}
