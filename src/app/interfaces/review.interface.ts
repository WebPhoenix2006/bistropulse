export interface Review {
  id: string;
  userId: string; // who posted the review
  name: string; // display name of the user
  rating: number; // from 1 to 5
  comment: string;
  date: string; // ISO or formatted date
}
