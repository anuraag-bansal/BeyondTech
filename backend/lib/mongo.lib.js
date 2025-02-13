require('dotenv').config({path: "./.env"});
const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * Connects to MongoDB using the MONGO_URL environment variable.
 *
 * @throws {Error} If MONGO_URL is not provided in the environment variables.
 */
async function connectToMongo(url) {
    try {
        if (_.isEmpty(url)) {
            throw new Error("MONGO_URL is required")
        }
        await mongoose.connect(url)
        console.log('Connected to MongoDB.');
    } catch (err) {
        console.log('Error connecting to MongoDB:', err.message);
    }
}

/**
 * Updates a document in the database based on the provided filter query and update query.
 *
 * @param {Object} model - The Mongoose model to use.
 * @param {Object} filterQuery - The filter query to find the document.
 * @param {Object} updateQuery - The update query to apply to the document.
 * @param {Object} [options={}] - Optional settings for the update operation.
 * @param {number} [timeout=10000] - Maximum time in milliseconds for the operation.
 * @returns {Promise<Object>} The updated document.
 * @throws {Error} If model, filterQuery, or updateQuery is not provided.
 */
async function findOneAndUpdate(model, filterQuery, updateQuery, options = {}, timeout = 10000,) {
    try {
        if (model === null || filterQuery === null || updateQuery === null) {
            throw new Error("model, filterQuery, and updateQuery are required")
        }
        return await model.findOneAndUpdate(filterQuery, updateQuery, {
            ...options, maxTimeMS: timeout,
        })
    } catch (error) {

        throw error
    }
}

/**
 * Finds a single document in the database based on the filter query.
 *
 * @param {Object} model - The Mongoose model to use.
 * @param {Object} filterQuery - The filter query to find the document.
 * @param {Object} [options={}] - Optional settings for the find operation.
 * @param {number} [timeout=10000] - Maximum time in milliseconds for the operation.
 * @returns {Promise<Object>} The found document.
 * @throws {Error} If model or filterQuery is not provided.
 */
async function findOne(model, filterQuery, options = {}, timeout = 10000) {
    try {
        if (!model || !filterQuery) {
            throw new Error("model and filterQuery are required");
        }

        return await model.findOne(filterQuery)
    } catch (error) {
        throw error;
    }
}


/**
 * Finds a single document in the database based on the query, select, and sort options.
 *
 * @param {Object} model - The Mongoose model to use.
 * @param {Object} query - The query to find the document.
 * @param {Object} select - The fields to select in the document.
 * @param {Object} sort - The sorting criteria.
 * @returns {Promise<Object>} The found document.
 * @throws {Error} If model, query, select, or sort is not provided.
 */
async function findOneByQueryWithSelectWithSort(model, query, select, sort) {
    try {
        if (model === null || query === null || select === null || sort === null) {
            throw new Error("model, query, select, and sort are required")
        }
        const docs = await model.findOne(query).select(select).sort(sort)


        return docs
    } catch (error) {
        throw error
    }
}

/**
 * Finds documents in the database based on the query with skip and limit options.
 *
 * @param {Object} model - The Mongoose model to use.
 * @param {Object} query - The query to find the documents.
 * @param {number} skip - The number of documents to skip.
 * @param {number} limit - The maximum number of documents to retrieve.
 * @param {number} [timeout=10000] - Maximum time in milliseconds for the operation.
 * @returns {Promise<Array>} The found documents.
 * @throws {Error} If model, query, limit, or skip is not provided.
 */
async function findByQueryWithSkipLimit(model, query, skip, limit, timeout = 10000,) {
    try {
        if (model === null || query === null || limit === null || skip === null) {
            throw new Error("model, query, limit, and skip are required")
        }
        const docs = await model
            .find(query)
            .maxTimeMS(timeout)
            .skip(skip)
            .limit(limit)

        return docs
    } catch (err) {

        throw err
    }
}

/**
 * Finds documents in the database based on the query.
 *
 * @param {Object} model - The Mongoose model to use.
 * @param {Object} query - The query to find the documents.
 * @param {number} [timeout=10000] - Maximum time in milliseconds for the operation.
 * @returns {Promise<Array>} The found documents.
 * @throws {Error} If model or query is not provided.
 */
async function findByQuery(model, query, timeout = 10000) {
    try {
        if (model === null || query === null) {
            throw new Error("model and query are required")
        }
        return await model.find(query).maxTimeMS(timeout)
    } catch (error) {

        throw error
    }
}

/**
 * Finds a document by its ID.
 * @param {Object} model
 * @param {string} id
 * @returns {Promise<*>}
 * @throws {Error} If model or id is not provided.
 */
async function findById(model, id) {
    try {
        if (model === null || id === null) {
            throw new Error("model and id are required")
        }
        return await model.findById(id)
    } catch (error) {
        throw error
    }
}

/**
 * Inserts a document into the database.
 * @param {Object} model
 * @param {Object} document
 * @returns {Promise<*>}
 */
async function insertOne(model, document) {
    try {
        if (model === null || document === null) {
            throw new Error("model and document are required")
        }
        return await model.create(document)
    } catch (error) {
        throw error
    }
}

module.exports = {
    connectToMongo,
    findOneAndUpdate,
    findOne,
    findByQueryWithSkipLimit,
    findByQuery,
    findOneByQueryWithSelectWithSort: findOneByQueryWithSelectWithSort,
    insertOne,
    findById
}
