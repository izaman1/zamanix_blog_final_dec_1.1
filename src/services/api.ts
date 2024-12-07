import { fetchApi } from '../config';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: {
    url: string;
    publicId?: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large' | 'full';
  };
  author: string;
  category: string;
  tags: string[];
  slug: string;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface BlogsResponse {
  status: string;
  data: {
    blogs: Blog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      hasMore: boolean;
    };
  };
}

export interface SingleBlogResponse {
  status: string;
  data: Blog;
}

export interface Event {
  _id: string;
  userId: string;
  date: string;
  occasion: string;
  name?: string;
  notes?: string;
  recurrence: 'once' | 'weekly' | 'monthly' | 'yearly';
  calendarSync: boolean;
  createdAt: string;
}

export interface EventsResponse {
  status: string;
  data: Event[];
}

export interface SingleEventResponse {
  status: string;
  data: Event;
}

// Blog API Functions
export async function fetchBlogs() {
  return fetchApi<BlogsResponse>('/api/blogs');
}

export async function fetchBlogBySlug(slug: string) {
  return fetchApi<SingleBlogResponse>(`/api/blogs/${slug}`);
}

export async function createBlog(formData: FormData) {
  return fetchApi<SingleBlogResponse>('/api/blogs', {
    method: 'POST',
    body: formData
  });
}

export async function updateBlog(id: string, formData: FormData) {
  return fetchApi<SingleBlogResponse>(`/api/blogs/${id}`, {
    method: 'PUT',
    body: formData
  });
}

export async function deleteBlog(id: string) {
  return fetchApi<{ status: string; message: string }>(`/api/blogs/${id}`, {
    method: 'DELETE'
  });
}

// Event API Functions
export async function createEvent(eventData: Omit<Event, '_id' | 'userId' | 'createdAt'>) {
  return fetchApi<SingleEventResponse>('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
}

export async function getUserEvents() {
  return fetchApi<EventsResponse>('/api/events');
}

export async function updateEvent(id: string, eventData: Partial<Event>) {
  return fetchApi<SingleEventResponse>(`/api/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
}

export async function deleteEvent(id: string) {
  return fetchApi<{ status: string; message: string }>(`/api/events/${id}`, {
    method: 'DELETE'
  });
}