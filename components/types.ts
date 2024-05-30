export interface Episode {
  id: number;              
  name: string;           
  air_date: string;       
  episode: string;       
  characters: string[]; 
  url: string;             
  created: string;       
}

export interface Info {
  count: number;           
  pages: number;          
  next: string | null;    
  prev: string | null; 
}

export interface EpisodeResponse {
  info: Info;             
  results: Episode[];  
}

export interface Location {
  name: string;
  url: string;
}

export interface Character {
  id: number;              
  name: string;           
  status: 'Alive' | 'Dead' | 'unknown';  
  species: string;        
  type: string;           
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'; 
  origin: Location;   
  location: Location;   
  image: string;    
  episode: string[];  
  url: string;     
  created: string; 
}