import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import { getBlogById, getBlogs } from '../services/firebaseService';

const BlogPostPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        // Fetch the specific blog post
        const blogData = await getBlogById(id);

        if (blogData) {
          setBlog(blogData);

          // Fetch all blogs to find related ones
          const allBlogs = await getBlogs();

          // Filter related blogs (same category)
          let related = allBlogs
            .filter(b => b.id !== id && (!blogData.category || b.category === blogData.category));

          // If not enough related blogs, add other recent blogs to fill up to 3
          if (related.length < 3) {
            const otherBlogs = allBlogs
              .filter(b => b.id !== id && !related.find(r => r.id === b.id))
              .slice(0, 3 - related.length);
            related = [...related, ...otherBlogs];
          }

          setRelatedBlogs(related.slice(0, 3));
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-secondary">
        <Navbar />
        <div className="pt-32 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-secondary">
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Blog Post Not Found</h1>
            <p className="mt-4 text-gray-600">The blog post you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-secondary">
      <Navbar />

      {/* Blog Post Header */}
      <div className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
              {blog.category}
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">{blog.title}</h1>
            <div className="mt-6 flex items-center justify-center">
              <div className="flex-shrink-0">
                <span className="sr-only">{blog.author}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Content */}
      <div className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-96 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <div
                className="prose prose-lg max-w-none text-gray-700 mx-auto"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Related Articles</h2>
              <p className="mt-4 text-xl text-gray-600">Continue exploring our insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <div key={relatedBlog.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                        {relatedBlog.category}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(relatedBlog.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{relatedBlog.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{relatedBlog.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">By {relatedBlog.author}</span>
                      <Link
                        to={`/blog/${relatedBlog.id}`}
                        className="text-amber-700 hover:text-amber-800 font-medium flex items-center"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BlogPostPage;