import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, Save, Sparkles, ArrowLeft, Upload, Eye, Pencil, Image as ImageIcon, Wand2, BarChart3 } from 'lucide-react';

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [styleLoading, setStyleLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState('split');

  const [form, setForm] = useState({
    title: '', slug: '', description: '', content: '', category: '',
    image: '', date: new Date().toISOString().slice(0, 10), readTime: '',
    keywords: [], chartData: null, seoTitle: '', seoDescription: '',
    status: 'draft',
  });
  const [keywordsText, setKeywordsText] = useState('');
  const [chartText, setChartText] = useState('');

  useEffect(() => {
    if (isEdit) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const res = await base44.functions.invoke('saveBlogPost', {
        token: getToken(), action: 'get', id,
      });
      const post = res.data?.post || res.data;
      setForm({
        title: post.title || '', slug: post.slug || '', description: post.description || '',
        content: post.content || '', category: post.category || '', image: post.image || '',
        date: post.date || new Date().toISOString().slice(0, 10), readTime: post.readTime || '',
        keywords: post.keywords || [], chartData: post.chartData || null,
        seoTitle: post.seoTitle || '', seoDescription: post.seoDescription || '',
        status: post.status || 'draft',
      });
      setKeywordsText((post.keywords || []).join(', '));
      setChartText(post.chartData ? JSON.stringify(post.chartData, null, 2) : '');
    } catch (err) {
      alert('Ошибка загрузки: ' + (err.response?.data?.error || err.message));
      navigate('/crm/blog');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => {
    const val = e?.target?.value ?? e;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, image: res.file_url }));
    } catch (err) {
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const optimizeSeo = async () => {
    if (!form.content || form.content.length < 50) {
      alert('Сначала добавьте контент статьи');
      return;
    }
    setSeoLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Ты профессиональный SEO-оптимизатор для русскоязычного сайта о работе (программа восстановления ЛНР/ДНР). Проанализируй статью и верни оптимизированные мета-данные.

ЗАГОЛОВОК: ${form.title}
КАТЕГОРИЯ: ${form.category}
КОНТЕНТ:
${form.content}

Верни JSON с полями:
- title: оптимизированный заголовок (до 70 символов, цепляющий, с ключевыми словами)
- description: мета-описание (до 160 символов, для поисковой выдачи)
- slug: URL на латинице через дефисы (например "zarplata-vakhta-dnr-2026")
- keywords: массив из 5-8 SEO-ключевых слов
- seoTitle: расширенный SEO-заголовок (до 80 символов)
- seoDescription: расширенное SEO-описание (до 170 символов)
- readTime: время чтения (например "7 мин")`,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            slug: { type: 'string' },
            keywords: { type: 'array', items: { type: 'string' } },
            seoTitle: { type: 'string' },
            seoDescription: { type: 'string' },
            readTime: { type: 'string' },
          },
        },
      });
      setForm((f) => ({
        ...f,
        title: res.title || f.title,
        description: res.description || f.description,
        slug: res.slug || f.slug,
        keywords: res.keywords || f.keywords,
        seoTitle: res.seoTitle || f.seoTitle,
        seoDescription: res.seoDescription || f.seoDescription,
        readTime: res.readTime || f.readTime,
      }));
      setKeywordsText((res.keywords || []).join(', '));
    } catch (err) {
      alert('Ошибка ИИ: ' + (err.response?.data?.error || err.message));
    } finally {
      setSeoLoading(false);
    }
  };

  const generateCover = async () => {
    if (!form.title) {
      alert('Сначала укажите заголовок статьи');
      return;
    }
    setCoverLoading(true);
    try {
      const res = await base44.integrations.Core.GenerateImage({
        prompt: `Создай профессиональную обложку для статьи блога. Тема: "${form.title}". Категория: ${form.category || 'общая'}. Стиль: современный, реалистичный, с элементами строительства/восстановления/работы. Цветовая гамма: тёплые оттенки (оранжевый, коричневый) с тёмно-синими акцентами. Без текста на изображении. Соотношение сторон 16:9.`,
      });
      if (res.url) {
        setForm((f) => ({ ...f, image: res.url }));
      }
    } catch (err) {
      alert('Ошибка генерации обложки: ' + (err.response?.data?.error || err.message));
    } finally {
      setCoverLoading(false);
    }
  };

  const improveStyle = async () => {
    if (!form.content || form.content.length < 50) {
      alert('Сначала добавьте контент статьи');
      return;
    }
    setStyleLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Ты профессиональный редактор блога о государственной программе восстановления ЛНР и ДНР. Перепиши контент статьи в фирменном стиле нашего блога.

ПРАВИЛА СТИЛЯ:
- Структура: вступление → основная часть с подзаголовками (##) → выводы
- Тон: информативный, позитивный, но честный (без преувеличений)
- Используй маркированные списки для преимуществ и условий
- Добавь таблицы (Markdown) для сравнения зарплат, специальностей, условий
- Вставляй блоки с цитатами (>) для важных замечаний
- Числа и факты: конкретные суммы в рублях, сроки в месяцах
- Включи призыв к действию в конце
- Сохраняй всю фактическую информацию из оригинала

ТЕКУЩИЙ КОНТЕНТ:
${form.content}

ЗАГОЛОВОК: ${form.title}

Верни улучшенный Markdown-контент статьи.`,
      });
      if (res && typeof res === 'string' && res.length > 100) {
        setForm((f) => ({ ...f, content: res }));
      }
    } catch (err) {
      alert('Ошибка ИИ: ' + (err.response?.data?.error || err.message));
    } finally {
      setStyleLoading(false);
    }
  };

  const generateInfographic = async () => {
    if (!form.content || form.content.length < 50) {
      alert('Сначала добавьте контент статьи');
      return;
    }
    setChartLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Проанализируй статью и создай данные для инфографики (графика).

КОНТЕНТ:
${form.content}

Верни JSON для столбчатой диаграммы со зарплатами или сравнением показателей:
{
  "type": "bar",
  "title": "Заголовок графика",
  "data": [
    {"label": "Специальность или показатель", "value": число}
  ]
}

Используй реальные данные из статьи. 4-8 позиций.`,
        response_json_schema: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            title: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: { type: 'string' },
                  value: { type: 'number' },
                },
              },
            },
          },
        },
      });
      if (res && res.data) {
        setForm((f) => ({ ...f, chartData: res }));
        setChartText(JSON.stringify(res, null, 2));
      }
    } catch (err) {
      alert('Ошибка генерации инфографики: ' + (err.response?.data?.error || err.message));
    } finally {
      setChartLoading(false);
    }
  };

  const handleSave = async (status) => {
    if (!form.title || !form.slug || !form.content) {
      alert('Заполните: заголовок, slug и контент');
      return;
    }
    setSaving(true);
    try {
      const keywords = keywordsText.split(',').map((k) => k.trim()).filter(Boolean);
      let chartData = null;
      if (chartText.trim()) {
        try {
          chartData = JSON.parse(chartText);
        } catch {
          alert('ChartData: неверный JSON');
          setSaving(false);
          return;
        }
      }
      const payload = { ...form, keywords, chartData, status: status || form.status };
      const res = await base44.functions.invoke('saveBlogPost', {
        token: getToken(), action: 'save', id: isEdit ? id : undefined, data: payload,
      });
      if (res.data?.error) throw new Error(res.data.error);
      navigate('/crm/blog');
    } catch (err) {
      alert('Ошибка сохранения: ' + (err.response?.data?.error || err.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const aiBtn = 'w-full bg-accent hover:bg-accent/90 text-white';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/crm/blog')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? 'Редактировать статью' : 'Новая статья'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving || seoLoading}>
            <Save className="w-4 h-4" /> Черновик
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={saving || seoLoading}
            className="bg-accent hover:bg-accent/90"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Опубликовать
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main: editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-4 space-y-3">
            <div>
              <Label className="text-sm font-medium">Заголовок *</Label>
              <Input value={form.title} onChange={update('title')} placeholder="Заголовок статьи" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">URL (slug) *</Label>
              <Input
                value={form.slug}
                onChange={update('slug')}
                placeholder="zarplata-vakhta-dnr-2026"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Описание (meta description)</Label>
              <Textarea
                value={form.description}
                onChange={update('description')}
                rows={2}
                placeholder="Краткое описание для поисковой выдачи"
                className="mt-1"
              />
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <Label className="text-sm font-medium">Контент (Markdown) *</Label>
              <div className="flex gap-1">
                <Button size="sm" variant={view === 'edit' ? 'default' : 'ghost'} onClick={() => setView('edit')}>
                  <Pencil className="w-3 h-3" /> Текст
                </Button>
                <Button size="sm" variant={view === 'split' ? 'default' : 'ghost'} onClick={() => setView('split')}>
                  Сплит
                </Button>
                <Button size="sm" variant={view === 'preview' ? 'default' : 'ghost'} onClick={() => setView('preview')}>
                  <Eye className="w-3 h-3" /> Превью
                </Button>
              </div>
            </div>
            <div className={view === 'split' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
              {(view === 'edit' || view === 'split') && (
                <Textarea
                  value={form.content}
                  onChange={update('content')}
                  rows={25}
                  className="font-mono text-sm resize-y"
                  placeholder={'## Заголовок\n\nТекст статьи...'}
                />
              )}
              {(view === 'preview' || view === 'split') && (
                <div className="prose-custom overflow-y-auto max-h-[600px] border border-border rounded-md p-4 bg-slate-50/50">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || '*Превью появится здесь*'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: meta + SEO + AI */}
        <div className="space-y-4">
          {/* AI Tools */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl border border-accent/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-semibold text-sm">ИИ-инструменты</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Автоматизация: SEO, стиль, обложка, инфографика.
            </p>
            <Button onClick={optimizeSeo} disabled={seoLoading || coverLoading || styleLoading || chartLoading} className={aiBtn} size="sm">
              {seoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              SEO-оптимизация
            </Button>
            <Button onClick={improveStyle} disabled={seoLoading || coverLoading || styleLoading || chartLoading} className={aiBtn} size="sm">
              {styleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Стиль и форматирование
            </Button>
            <Button onClick={generateCover} disabled={seoLoading || coverLoading || styleLoading || chartLoading} className={aiBtn} size="sm">
              {coverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              Сгенерировать обложку
            </Button>
            <Button onClick={generateInfographic} disabled={seoLoading || coverLoading || styleLoading || chartLoading} className={aiBtn} size="sm">
              {chartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
              Создать инфографику
            </Button>
          </div>

          {/* Image */}
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            <Label className="text-sm font-medium">Главное изображение</Label>
            {form.image && (
              <img src={form.image} alt="" className="w-full h-32 object-cover rounded-md mb-2" />
            )}
            <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md py-3 cursor-pointer hover:bg-secondary/50">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span className="text-sm">{form.image ? 'Заменить' : 'Загрузить'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-xl border border-border p-4 space-y-3">
            <div>
              <Label className="text-sm font-medium">Категория</Label>
              <Input value={form.category} onChange={update('category')} placeholder="Вакансии" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">Дата</Label>
              <Input type="date" value={form.date} onChange={update('date')} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">Время чтения</Label>
              <Input value={form.readTime} onChange={update('readTime')} placeholder="7 мин" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">Ключевые слова (через запятую)</Label>
              <Textarea
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                rows={3}
                placeholder="вакансии ДНР, работа ЛНР"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          {/* Advanced SEO */}
          <div className="bg-white rounded-xl border border-border p-4 space-y-3">
            <span className="text-sm font-medium block">Расширенные SEO-поля</span>
            <div>
              <Label className="text-xs text-muted-foreground">SEO-заголовок</Label>
              <Input value={form.seoTitle} onChange={update('seoTitle')} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">SEO-описание</Label>
              <Textarea
                value={form.seoDescription}
                onChange={update('seoDescription')}
                rows={2}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          {/* Chart data */}
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            <Label className="text-sm font-medium">Данные графика (JSON)</Label>
            <p className="text-xs text-muted-foreground">Опционально. Сгенерируйте через ИИ или оставьте пустым.</p>
            <Textarea
              value={chartText}
              onChange={(e) => setChartText(e.target.value)}
              rows={6}
              className="font-mono text-xs"
              placeholder='{"type":"bar","title":"...","data":[]}'
            />
          </div>
        </div>
      </div>
    </div>
  );
}