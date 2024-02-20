import type { FirebaseFirestore } from "@firebase/firestore-types";
import { firebaseDb } from "~/server/lib/firebase";

type FieldType = "string" | "number" | "boolean";

interface FieldMetadata {
  name: string;
  type: FieldType;
  isUnique: boolean;
}

interface RelationMetadata {
  type: "OneToMany" | "ManyToOne";
  propertyKey: string;
  relatedModel: typeof BaseModel;
  foreignKey: string;
}

export function Field(type: FieldType, isUnique: boolean = false) {
  return function (target: any, propertyKey: string) {
    const fields: FieldMetadata[] = target._fields || [];
    fields.push({ name: propertyKey, type, isUnique });
    target._fields = fields;
  };
}

export function OneToMany(relatedModel: typeof BaseModel, foreignKey: string) {
  return function (target: any, propertyKey: string) {
    const relations: RelationMetadata[] = target._relations || [];
    relations.push({
      type: "OneToMany",
      propertyKey,
      relatedModel,
      foreignKey,
    });
    target._relations = relations;
  };
}

export function ManyToOne(relatedModel: typeof BaseModel, foreignKey: string) {
  return function (target: any, propertyKey: string) {
    const relations: RelationMetadata[] = target._relations || [];
    relations.push({
      type: "ManyToOne",
      propertyKey,
      relatedModel,
      foreignKey,
    });
    target._relations = relations;
  };
}

interface FindOptions {
  relations?: string[];
}

export class BaseModel {
  private firestore: FirebaseFirestore.Firestore;
  protected collectionName: string;
  private readonly fields: FieldMetadata[];
  private readonly relations: RelationMetadata[];

  constructor() {
    this.firestore = firebaseDb;
    this.collectionName = "default_collection";
    // @ts-ignore
    this.fields = this._fields || [];
    // @ts-ignore
    this.relations = this._relations || [];
  }

  protected async addDocument<T = Record<string, any>>(
    data: Record<string, any>,
    throwOnDuplicate: boolean = true,
  ): Promise<T> {
    try {
      const isUnique = await this.checkUniqueFields(data);
      if (!isUnique) {
        if (throwOnDuplicate) {
          throw Error("Fields not unique");
        } else {
          const field = this.fields.find(({ isUnique }) => isUnique);
          // @ts-ignore
          return await this.findDocumentsByField(field.name, data[field?.name]);
        }
      } else {
        const documentRef = await this.firestore
          .collection(this.collectionName)
          .add(data);
        console.log(`Document added with ID: ${documentRef.id}`);
        return (await documentRef.get()).data() as T;
      }
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  }

  protected async updateDocumentById<T = Record<string, any>>(
    documentId: string,
    data: Record<string, any>,
  ): Promise<T | null> {
    try {
      await this.checkUniqueFields(data);
      await this.firestore
        .collection(this.collectionName)
        .doc(documentId)
        .update(data);
      const result = await this.getDocumentById<T>(documentId);
      if (result) {
        return result;
      }
      return null;
      console.log(`Document with ID ${documentId} updated`);
    } catch (error) {
      console.error(`Error updating document with ID ${documentId}:`, error);
      throw error;
    }
  }

  protected async getDocumentById<T = Record<string, any>>(
    documentId: string,
    options?: FindOptions,
  ): Promise<T | null> {
    try {
      const documentSnapshot = await this.firestore
        .collection(this.collectionName)
        .doc(documentId)
        .get();

      if (documentSnapshot.exists) {
        const result = documentSnapshot.data() as T;

        // @ts-ignore
        await this.loadRelations(result, options);

        return result;
      } else {
        console.error(`Document with ID ${documentId} does not exist`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting document with ID ${documentId}:`, error);
      throw error;
    }
  }

  protected async findDocumentByField<T = Record<string, any>>(
    fieldName: string,
    value: any,
    options?: FindOptions,
  ): Promise<T | null> {
    try {
      const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .where(fieldName, "==", value)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const result: T = querySnapshot.docs[0].data() as T;

      // @ts-ignore
      await this.loadRelations(result, options);

      return result;
    } catch (error) {
      console.error(`Error finding documents by field ${fieldName}:`, error);
      throw error;
    }
  }

  protected async findDocumentsByField<T = Record<string, any>[]>(
    fieldName: string,
    value: any,
  ): Promise<T[]> {
    try {
      const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .where(fieldName, "==", value)
        .get();

      const result: T[] = [];

      querySnapshot.forEach((doc) => result.push(doc.data() as T));

      return result;
    } catch (error) {
      console.error(`Error finding documents by field ${fieldName}:`, error);
      throw error;
    }
  }

  protected async deleteDocumentById(documentId: string): Promise<void> {
    try {
      await this.firestore
        .collection(this.collectionName)
        .doc(documentId)
        .delete();
      console.log(`Document with ID ${documentId} deleted`);
    } catch (error) {
      console.error(`Error deleting document with ID ${documentId}:`, error);
      throw error;
    }
  }

  private async isFieldUnique(fieldName: string, value: any): Promise<boolean> {
    try {
      const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .where(fieldName, "==", value)
        .get();
      return querySnapshot.empty;
    } catch (error) {
      console.error(`Error checking uniqueness for field ${fieldName}:`, error);
      throw error;
    }
  }

  private async checkUniqueFields(data: Record<string, any>): Promise<boolean> {
    try {
      const notUniqueFields = [];
      for (const { name, isUnique } of this.fields) {
        if (isUnique && Object.prototype.hasOwnProperty.call(data, name)) {
          const value = data[name];
          const isFieldUnique = await this.isFieldUnique(name, value);

          if (!isFieldUnique) {
            notUniqueFields.push(name);
            console.error(`Value for field ${name} is not unique`);
          }
        }
      }

      return !notUniqueFields.length;
    } catch (error) {
      console.error(`Error checking unique fields:`, error);
      throw error;
    }
  }

  private async loadRelations(
    document: Record<string, any>,
    options?: FindOptions,
  ): Promise<void> {
    const { relations } = options || {};

    if (relations && Array.isArray(relations) && relations.length > 0) {
      for (const relation of this.relations) {
        if (relations.includes(relation.propertyKey)) {
          if (relation.type === "OneToMany") {
            const relatedDocuments =
              // @ts-ignore
              await relation.relatedModel.findDocumentsByField(
                relation.foreignKey,
                document.id,
              );
            document[relation.propertyKey] = relatedDocuments;
          } else if (relation.type === "ManyToOne") {
            const foreignKeyValue = document[relation.foreignKey];
            if (foreignKeyValue) {
              const relatedDocument =
                // @ts-ignore
                await relation.relatedModel.getDocumentById(foreignKeyValue);
              document[relation.propertyKey] = relatedDocument;
            }
          }
        }
      }
    }
  }
}
