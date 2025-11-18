const Post = require('../models/Post');

const buildFileUrl = (req, filename) => {
  const host = req.get('host');
  return `${req.protocol}://${host}/uploads/${filename}`;
};

const resolveMedia = (req) => {
  if (req.file) {
    return {
      url: buildFileUrl(req, req.file.filename),
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
    };
  }
  if (req.body.mediaUrl) {
    const url = req.body.mediaUrl;
    const videoExt = /\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i;
    return {
      url,
      type: videoExt.test(url) ? 'video' : 'image'
    };
  }
  if (req.body.image) {
    return { url: req.body.image, type: 'image' };
  }
  return undefined;
};

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body || {};
        if (!content) {
          return res.status(400).json({ message: 'Content is required' });
        }
        const media = resolveMedia(req);
        const post = new Post({
          author: req.user._id,
          content,
          media,
          image: media?.type === 'image' ? media.url : undefined
        });
        await post.save();
        await post.populate('author', 'username');
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getPosts = async (req, res) => {
try {
const posts = await Post.find().populate('author', 'username').populate('comments.user', 'username').sort({ createdAt: -1 });
res.json(posts);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getPost = async (req, res) => {
try {
const post = await Post.findById(req.params.id).populate('author', 'username').populate('comments.user', 'username');
if (!post) return res.status(404).json({ message: 'Post not found' });
res.json(post);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.updatePost = async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
const { content } = req.body || {};
post.content = content ?? post.content;
if (req.file || req.body?.mediaUrl !== undefined || req.body?.removeMedia) {
  const media = resolveMedia(req);
  if (req.body?.removeMedia === 'true') {
    post.media = undefined;
    post.image = undefined;
  } else {
    post.media = media;
    post.image = media?.type === 'image' ? media.url : undefined;
  }
} else if (req.body?.image !== undefined) {
  post.image = req.body.image;
}
await post.save();
res.json(post);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.deletePost = async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
await post.deleteOne();
res.json({ message: 'Deleted' });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.toggleLike = async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
const uid = req.user._id;
const index = post.likes.findIndex(l => l.toString() === uid.toString());
if (index === -1) post.likes.push(uid);
else post.likes.splice(index, 1);
await post.save();
res.json({ likesCount: post.likes.length, liked: index === -1 });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.addComment = async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
const comment = { user: req.user._id, text: req.body.text };
post.comments.push(comment);
await post.save();
await post.populate('comments.user', 'username');
res.status(201).json(post.comments[post.comments.length - 1]);
} catch (err) {
res.status(500).json({ message: err.message });
}
};