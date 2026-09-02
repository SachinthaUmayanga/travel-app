"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAOS = async () => {
      await import('aos');
      AOS.init({
        duration: 1000,
        easing: 'ease',
        once: true,
        anchorPlacement: 'top-bottom'
      });
    };
    initAOS();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blog posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-[15vh] flex justify-center items-center"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 pb-16 overflow-hidden">
      <div className="w-[90%] xl:w-[80%] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 border-b pb-4" data-aos="fade-right">Our Blog</h1>
        <p className="text-gray-500 mb-10 mt-4 text-lg" data-aos="fade-right" data-aos-delay="100">Read the latest travel stories, tips, and guides from our experts.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <div 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
                data-aos="fade-up"
                data-aos-delay={`${(index % 3) * 100}`}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-blue-600 text-sm font-semibold mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{post.title}</h2>
                  <div className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow" dangerouslySetInnerHTML={{ __html: post.content }} />
                  <div className="flex items-center mt-auto">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{post.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
             <p className="text-gray-500 text-lg">No blog posts available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
