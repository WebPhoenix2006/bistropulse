export interface RewardPoint {
  totalPoints: number; // e.g., 2770
  earnHistory: EarnedPointEntry[]; // List of how points were earned
  redemptionOptions: RedemptionOption[]; // List of ways to use points
}

export interface EarnedPointEntry {
  restaurantName: string; // e.g., "Burger King"
  amountSpent: number; // e.g., 80
  pointsEarned: number; // e.g., 120
  earnedAt?: string; // optional ISO date if needed
}

export interface RedemptionOption {
  id: number;
  description: string; // e.g., "Get ₦50 on your mobile wallet"
  requiredPoints: number; // e.g., 1000
  iconUrl?: string; // optional: image for display
}
