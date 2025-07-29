
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Product, Promotion } from './types';

const firebaseConfig = {
  projectId: "mercado-argentino-online",
  appId: "1:986534409565:web:2267108c210a31c98364b4",
  storageBucket: "mercado-argentino-online.firebasestorage.app",
  apiKey: "AIzaSyBHbCbynS3EIcHcU6Ib_iVEcNSh-K4rJDQ",
  authDomain: "mercado-argentino-online.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "986534409565",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

const productsCollection = collection(db, 'products');
const promotionsCollection = collection(db, 'promotions');

// Helper to convert Firestore doc to Product
const productFromFirestore = (doc: any): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrls: data.imageUrls,
        category: data.category,
        specifications: data.specifications,
        stock: data.stock,
        vendor: data.vendor,
        vendorId: data.vendorId,
    };
}

// Helper to convert Firestore doc to Promotion
const promotionFromFirestore = (doc: any): Promotion => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        imageHint: data.imageHint,
        link: data.link,
    };
}

// Product Operations
export const getProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(productFromFirestore);
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return productFromFirestore(docSnap);
    }
    return undefined;
}

export const getProductsByVendor = async (vendorName: string): Promise<Product[]> => {
    const q = query(productsCollection, where("vendor", "==", vendorName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(productFromFirestore);
}

export const getProductsByVendorId = async (vendorId: string): Promise<Product[]> => {
    const q = query(productsCollection, where("vendorId", "==", vendorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(productFromFirestore);
}

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id, ...product };
}

export const updateProduct = async (id: string, productUpdate: Partial<Product>): Promise<void> => {
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
    return snapshot.docs.map(promotionFromFirestore);
}

export const addPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
    const docRef = await addDoc(promotionsCollection, promotion);
    return { id: docRef.id, ...promotion };
}

export const updatePromotion = async (id: string, promotionUpdate: Partial<Promotion>): Promise<void> => {
    const docRef = doc(db, 'promotions', id);
    await updateDoc(docRef, promotionUpdate);
}

export const deletePromotion = async (id: string): Promise<void> => {
    const docRef = doc(db, 'promotions', id);
    await deleteDoc(docRef);
}


export { app, db, auth };
