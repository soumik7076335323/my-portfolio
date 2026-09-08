/**
 * Very small in-memory rate limiter — enough to blunt casual spam on the
 * public contact form without adding a dependency. For clustered
 * production deployments, swap for a Redis-backed limiter.
 */
const buckets = new Map();

const rateLimit = ({ windowMs = 10 * 60 * 1000, max = 5, key = 'default' } = {}) =>
  function (req, res, next) {
    const now = Date.now();
    const id = `${key}:${req.ip || 'unknown'}`;
    const bucket = buckets.get(id);

    if (!bucket || now - bucket.start > windowMs) {
      buckets.set(id, { start: now, count: 1 });
      return next();
    }
    bucket.count += 1;
    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }
    next();
  };

module.exports = { rateLimit };
