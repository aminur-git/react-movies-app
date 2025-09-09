import { Client, Databases, ID, Query } from "appwrite"

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(projectId)
const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
    console.log(databaseId, projectId, collectionId)

    // normalize search term to avoid duplicates caused by case/whitespace
    const normalizedSearchTerm = String(searchTerm || '').trim().toLowerCase()

    // 1. Use appwrite sdk to check if the search term exists in the database
    try {
        const result = await database.listDocuments(databaseId, collectionId, [
            Query.equal('searchTerm', normalizedSearchTerm),
        ])

        // 2. If it does, update the count
        if (result.documents.length > 0) {
            const doc = result.documents[0]

            await database.updateDocument(databaseId, collectionId, doc.$id, {
                count: (doc.count || 0) + 1,
            })
        }

        // 3. If it doesn't, create a new document with the search term and count

        else {
            await database.createDocument(databaseId, collectionId, ID.unique(), {
                searchTerm: normalizedSearchTerm,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                movie_id: movie.id,
            })
        }
    }
    catch (error) {
        console.log(error)
    }

}