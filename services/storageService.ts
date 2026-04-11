import { collection, addDoc, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { SavedStudyGuide, Feedback } from '../types';

const GUIDES_COLLECTION = 'savedGuides';
const FEEDBACK_COLLECTION = 'feedback';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getSavedGuides = async (userId: string): Promise<SavedStudyGuide[]> => {
  try {
    const q = query(
      collection(db, GUIDES_COLLECTION),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as SavedStudyGuide));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, GUIDES_COLLECTION);
    return [];
  }
};

export const saveGuide = async (guide: Omit<SavedStudyGuide, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, GUIDES_COLLECTION), {
      ...guide,
      savedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, GUIDES_COLLECTION);
    throw error;
  }
};

export const deleteGuide = async (guideId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, GUIDES_COLLECTION, guideId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GUIDES_COLLECTION}/${guideId}`);
    throw error;
  }
};

export const saveFeedback = async (feedback: any): Promise<void> => {
  try {
    await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedback,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, FEEDBACK_COLLECTION);
  }
};
