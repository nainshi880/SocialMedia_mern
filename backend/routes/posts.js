const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const mediaUpload = require('../middleware/mediaUpload');

router.post('/', auth, mediaUpload, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', auth, mediaUpload, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.toggleLike);
router.post('/:id/comment', auth, postController.addComment);

module.exports = router;

