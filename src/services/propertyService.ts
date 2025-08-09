import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Property {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
  estimatedValue: string;
  stayAsTenant: string;
  status: 'novo' | 'em_analise' | 'proposta_enviada' | 'vendido' | 'cancelado';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
}

const COLLECTION_NAME = 'properties';

export const propertyService = {
  // Adicionar nova propriedade
  async addProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...propertyData,
        status: 'novo',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar propriedade:', error);
      throw error;
    }
  },

  // Buscar todas as propriedades
  async getAllProperties(): Promise<Property[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Property));
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      throw error;
    }
  },

  // Atualizar status da propriedade
  async updatePropertyStatus(id: string, status: Property['status'], notes?: string): Promise<void> {
    try {
      const propertyRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(propertyRef, {
        status,
        notes: notes || '',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      throw error;
    }
  },

  // Deletar propriedade
  async deleteProperty(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      throw error;
    }
  }
};