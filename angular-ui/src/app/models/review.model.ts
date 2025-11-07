export interface Review {
  id: string;
  rating: number;
  content: string;
  datePosted: Date;
  lastEdited?: Date; 
}