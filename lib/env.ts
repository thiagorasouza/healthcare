export const env = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID! || process.env.PROJECT_ID!,
  imagesBucketId: process.env.NEXT_PUBLIC_IMAGES_BUCKET_ID! || process.env.IMAGES_BUCKET_ID!,
  docsBucketId: process.env.NEXT_PUBLIC_DOCS_BUCKET_ID! || process.env.DOCS_BUCKET_ID!,
  databaseId: process.env.DATABASE_ID!,
  doctorsCollectionId: process.env.DOCTORS_COLLECTION_ID!,
  patternsCollectionId: process.env.PATTERNS_COLLECTION_ID!,
  patientsCollectionId: process.env.PATIENTS_COLLECTION_ID!,
};
