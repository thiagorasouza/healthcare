export const env = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID! || process.env.PROJECT_ID!,
  imageBucketId: process.env.NEXT_PUBLIC_IMAGES_BUCKET_ID! || process.env.PROJECT_ID!,
  databaseId: process.env.DATABASE_ID!,
  doctorsCollectionId: process.env.DOCTORS_COLLECTION_ID!,
  patternsCollectionId: process.env.PATTERNS_COLLECTION_ID!,
};
