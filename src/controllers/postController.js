import { prisma } from "../config/db.js";
import { redisClient } from "../config/redis.js";

export const getAllPosts = async (req, res) => {
  try {
    //Pagination params(page 1, 10 items per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (req.user?.role === "USER") {
      filter.published = true; //users only see published posts
    }

    const cacheKey = `posts_${req.user.role}_page_${page}_limit_${limit}`;

    //Create a Unique Cache Key based on the page and limit
    const cachedPosts = await redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json({
        source: "cache",
        status: "success",
        data: JSON.parse(cachedPosts),
      });
    }
    //if not in cache, fetch from db
    const [posts, totalPosts] = await prisma.$transaction([
      prisma.post.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.post.count({
        where: filter,
      }),
    ]);
    const responseData = {
      data: posts,
      meta: {
        total: totalPosts,
        page,
        lastPage: Math.ceil(totalPosts / limit),
      },
    };
    //Save to Redis for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

    res.json({
      source: "db",
      status: "success",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const postController = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        authorId: req.user.id,
      },
    });

    res.status(201).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  const userId = parseInt(req.params.id);

  let filter = {
    authorId: userId,
  };

  // If not owner or admin → restrict
  const isOwner = req.user && req.user.id === userId;
  const isPrivileged = req.user && ["ADMIN", "EDITOR"].includes(req.user.role);

  if (!isOwner && !isPrivileged) {
    filter.published = true;
  }

  const posts = await prisma.post.findMany({
    where: filter,
  });

  return res.json({
    status: "success",
    data: posts,
  });
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const update = await prisma.post.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({ status: "success", data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.status(200).json({
      status: "success",
      data: deletedPost,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
