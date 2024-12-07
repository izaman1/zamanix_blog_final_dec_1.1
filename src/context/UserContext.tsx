import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
}

interface Event {
  id: string;
  date: string;
  occasion: string;
  name?: string;
  notes?: string;
  recurrence: 'once' | 'weekly' | 'monthly' | 'yearly';
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  coins: number;
  lastLoginDate: string;
  loginStreak: number;
  addresses: Address[];
  orders: Order[];
  events: Event[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateUserDetails: (details: Partial<User>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const ADMIN_USER = {
  email: 'admin@zamanix.com',
  password: 'zamanix_admin'
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        const adminUser = {
          _id: 'admin',
          name: 'Admin',
          email: ADMIN_USER.email,
          phone: '',
          coins: 0,
          lastLoginDate: new Date().toISOString(),
          loginStreak: 1,
          addresses: [],
          orders: [],
          events: []
        };
        setUser(adminUser);
        return true;
      }

      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        return true;
      } else {
        toast.error(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (data: { name: string; email: string; password: string; phone: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.data);
        return true;
      } else {
        toast.error(result.message || 'Signup failed');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
      return false;
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress = {
        ...address,
        id: Date.now().toString()
      };
      
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          addresses: [...prev.addresses, newAddress]
        };
      });
      
      toast.success('Address added successfully');
    }
  };

  const updateUserDetails = async (details: Partial<User>) => {
    if (user) {
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details)
        });

        const data = await response.json();

        if (response.ok) {
          setUser(prev => prev ? { ...prev, ...data.data } : null);
          toast.success('Profile updated successfully');
        } else {
          toast.error(data.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Update error:', error);
        toast.error('Failed to update profile');
      }
    }
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    if (user) {
      const newEvent = {
        ...event,
        id: Date.now().toString()
      };
      
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          events: [...prev.events, newEvent]
        };
      });
      
      toast.success('Event added to your calendar');
    }
  };

  const updateEvent = (id: string, eventUpdates: Partial<Event>) => {
    if (user) {
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          events: prev.events.map(event => 
            event.id === id ? { ...event, ...eventUpdates } : event
          )
        };
      });
      
      toast.success('Event updated successfully');
    }
  };

  const deleteEvent = (id: string) => {
    if (user) {
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          events: prev.events.filter(event => event.id !== id)
        };
      });
      
      toast.success('Event deleted successfully');
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      signup,
      addAddress,
      updateUserDetails,
      addEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}