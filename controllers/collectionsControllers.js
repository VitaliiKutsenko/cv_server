const collectionsServices = require('../services/collectionsServices');

const collectionsController = {
    get: {
        async allCollections(req, res, next) {
            try {
                const userId = await req.userId;
                const cvCollections =
                    await collectionsServices.get.collectionsFromDb(userId);
                return res.json(cvCollections);
            } catch (error) {
                next(error);
            }
        },
    },
    post: {
        async addCollection(req, res, next) {
            try {
                const userId = await req.userId;
                const data = req.body;
                const cvCollections =
                    await collectionsServices.post.addCollectionsToDb(
                        userId,
                        data
                    );
                return res.json(cvCollections);
            } catch (error) {
                next(error);
            }
        },
    },
    put: {},
    delete: {
        async collectionById(req, res, next) {
            try {
                const userId = await req.userId;
                const removeId = await req.params.id;
                const remove =
                    await collectionsServices.delete.deleteCollectionById(
                        userId,
                        removeId
                    );
                return res.status(200).json(remove);
            } catch (error) {
                next(error);
            }
        },
    },
};

module.exports = collectionsController;
