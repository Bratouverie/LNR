import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, Newspaper } from 'lucide-react';

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await base44.functions.invoke('saveBlogPost', {
        token: getToken(), action: 'list', limit: 100,
      });
      setPosts(res.data?.posts || []);
    } catch (err) {
      console.error('Blog load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить статью безвозвратно?')) return;
    try {
      await base44.functions.invoke('saveBlogPost', {
        token: getToken(), action: 'delete', id,
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Ошибка удаления: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Newspaper className="w-6 h-6" /> Блог
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Создание, редактирование и удаление статей</p>
        </div>
        <Button onClick={() => navigate('/crm/blog/new')} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4" /> Новая статья
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Заголовок</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Категория</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Дата</th>
              <th className="text-left px-4 py-3 font-semibold">Статус</th>
              <th className="text-right px-4 py-3 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">{post.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{post.category || '—'}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {post.status === 'published' ? 'Опубл.' : 'Черновик'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/crm/blog/edit/${post.id}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  Статей пока нет. Нажмите «Новая статья» для создания.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}