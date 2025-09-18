'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopCategories } from '@/lib/sanity/client';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  count: number;
}

export default function CategoriesNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const topCategories = await getTopCategories();
        setCategories(topCategories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="px-5 py-2 text-xl font-medium text-gray-600 dark:text-gray-400">
        Categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="px-5 py-2 text-xl font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400">
      <Link href="/archive" className="hover:text-blue-500">
        Categories
      </Link>
    </div>
  );
}
