
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Product, Promotion, Customer } from './types';


const firebaseConfig = {
  projectId: "ndera-store",
  appId: "1:986534409565:web:2267108c210a31c98364b4",
  storageBucket: "ndera-store.firebasestorage.app",
  apiKey: "AIzaSyBHbCbynS3EIcHcU6Ib_iVEcNSh-K4rJDQ",
  authDomain: "ndera-store.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "986534409565",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

const productsCollection = collection(db, 'products');
const promotionsCollection = collection(db, 'promotions');
const customersCollection = collection(db, 'customers');
const settingsCollection = collection(db, 'settings');

// Helper to convert Firestore doc to a given type
const docToType = <T>(doc: any): T => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    };
}

// Product Operations
export const getProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => docToType<Product>(doc));
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docToType<Product>(docSnap);
    }
    return undefined;
}

export const getProductsByVendor = async (vendorName: string): Promise<Product[]> => {
    const q = query(productsCollection, where("vendor", "==", vendorName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => docToType<Product>(doc));
}

export const getProductsByVendorId = async (vendorId: string): Promise<Product[]> => {
    const q = query(productsCollection, where("vendorId", "==", vendorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => docToType<Product>(doc));
}

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
    const docRef = await addDoc(productsCollection, product);
    return docRef.id;
}

export const updateProduct = async (id: string, productUpdate: Partial<Omit<Product, 'id'>>): Promise<void> => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productUpdate);
}

export const deleteProduct = async (id: string): Promise<void> => {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
}

// Promotion Operations
export const getPromotions = async (): Promise<Promotion[]> => {
    const snapshot = await getDocs(promotionsCollection);
    return snapshot.docs.map(doc => docToType<Promotion>(doc));
}

export const addPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<string> => {
    const docRef = await addDoc(promotionsCollection, promotion);
    return docRef.id;
}

export const updatePromotion = async (id: string, promotionUpdate: Partial<Omit<Promotion, 'id'>>): Promise<void> => {
    const docRef = doc(db, 'promotions', id);
    await updateDoc(docRef, promotionUpdate);
}

export const deletePromotion = async (id: string): Promise<void> => {
    const docRef = doc(db, 'promotions', id);
    await deleteDoc(docRef);
}

// Customer Operations
export const getCustomers = async (): Promise<Customer[]> => {
    const snapshot = await getDocs(customersCollection);
    return snapshot.docs.map(doc => docToType<Customer>(doc));
}

export const addCustomer = async (customer: Omit<Customer, 'id'>): Promise<string> => {
    // Check if customer already exists by email
    const q = query(customersCollection, where("email", "==", customer.email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        // Customer exists, let's update their purchase history
        const existingCustomerDoc = snapshot.docs[0];
        const existingCustomerData = docToType<Customer>(existingCustomerDoc);
        const updatedHistory = [...existingCustomerData.purchaseHistory, ...customer.purchaseHistory];
        await updateDoc(existingCustomerDoc.ref, { purchaseHistory: updatedHistory });
        return existingCustomerDoc.id;
    }
    // New customer, add them
    const docRef = await addDoc(customersCollection, customer);
    return docRef.id;
}

export const updateCustomer = async (id: string, customerUpdate: Partial<Omit<Customer, 'id'>>): Promise<void> => {
    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, customerUpdate);
}

export const deleteCustomer = async (id: string): Promise<void> => {
    const docRef = doc(db, 'customers', id);
    await deleteDoc(docRef);
}


// Settings Operations
export const getSetting = async (settingId: string): Promise<string | null> => {
    const docRef = doc(db, 'settings', settingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().value;
    }
    return null;
}

export const updateSetting = async (settingId: string, value: string): Promise<void> => {
    const docRef = doc(db, 'settings', settingId);
    // Use setDoc with merge: true to create the document if it doesn't exist, or update it if it does.
    await setDoc(docRef, { value }, { merge: true });
}


export { app, auth };
