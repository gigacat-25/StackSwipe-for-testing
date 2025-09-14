
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/data';

/**
 * Fetches all user profiles from the 'users' collection in Firestore.
 * @returns A promise that resolves to an array of UserProfile objects.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => doc.data() as UserProfile);
    return userList;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Depending on the use case, you might want to throw the error
    // or return an empty array.
    return [];
  }
}
