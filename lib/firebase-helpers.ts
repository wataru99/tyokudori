import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from './firebase'

// Timestamp変換ヘルパー
export const toTimestamp = (date: Date) => Timestamp.fromDate(date)
export const fromTimestamp = (timestamp: Timestamp) => timestamp.toDate()

// 汎用的なCRUD操作
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = doc(collection(db, collectionName))
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

export async function getDocument<T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as unknown as T
  } else {
    return null
  }
}

export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints)
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as unknown as T))
}

// ページネーション対応
export async function getDocumentsPaginated<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize: number = 20,
  lastDoc?: DocumentData
): Promise<{ data: T[]; hasMore: boolean }> {
  const baseConstraints = [...constraints, limit(pageSize + 1)]
  
  if (lastDoc) {
    baseConstraints.push(startAfter(lastDoc))
  }
  
  const q = query(collection(db, collectionName), ...baseConstraints)
  const querySnapshot = await getDocs(q)
  
  const docs = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as unknown as T))
  
  const hasMore = docs.length > pageSize
  if (hasMore) {
    docs.pop() // 余分な1件を削除
  }
  
  return { data: docs, hasMore }
}

// 統計更新ヘルパー
export async function incrementField(
  collectionName: string,
  docId: string,
  field: string,
  value: number = 1
): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, {
    [field]: increment(value),
    updatedAt: serverTimestamp(),
  })
}

// バッチ操作ヘルパー
export async function batchUpdate<T extends DocumentData>(
  collectionName: string,
  updates: Array<{ id: string; data: Partial<T> }>
): Promise<void> {
  // Firestoreのバッチは最大500件まで
  const BATCH_SIZE = 500
  
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE)
    const promises = batch.map(({ id, data }) =>
      updateDocument(collectionName, id, data)
    )
    await Promise.all(promises)
  }
}

// クエリビルダーヘルパー
export class QueryBuilder {
  private constraints: QueryConstraint[] = []
  
  where(field: string, operator: any, value: any): QueryBuilder {
    this.constraints.push(where(field, operator, value))
    return this
  }
  
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    this.constraints.push(orderBy(field, direction))
    return this
  }
  
  limit(n: number): QueryBuilder {
    this.constraints.push(limit(n))
    return this
  }
  
  build(): QueryConstraint[] {
    return this.constraints
  }
}