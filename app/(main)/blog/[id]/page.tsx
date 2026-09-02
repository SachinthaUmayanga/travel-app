"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
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
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          router.push('/blog'); // Redirect if not found
        }
      } catch (error) {
        console.error('Error fetching blog post', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id, router]);

  if (loading) {
    return <div className="min-h-screen pt-[15vh] flex justify-center items-center"><p className="text-gray-500">Loading...</p></div>;
  }

  if (!post) return null;

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 pb-16 overflow-hidden">
      <div className="w-[95%] md:w-[80%] xl:w-[60%] mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100" data-aos="fade-up">
        <div className="h-64 md:h-96 w-full relative">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div data-aos="fade-right" data-aos-delay="200">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Travel Guide</span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">{post.title}</h1>
              <p className="text-gray-300 font-medium text-sm md:text-base">
                By {post.author} &bull; {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-8 md:p-12">
          <Link href="/blog">
            <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors">
              &larr; Back to all posts
            </span>
          </Link>
          <div 
            className="prose max-w-none text-gray-800 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-aos="fade-up"
            data-aos-delay="400"
          />
        </div>
      </div>
    </div>
  );
}
