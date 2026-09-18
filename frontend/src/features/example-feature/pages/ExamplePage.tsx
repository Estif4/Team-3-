import React, { useState } from 'react';
import { useExamples, useCreateExample } from '../hooks/useExamples.js';
import { ExampleCard } from '../components/ExampleCard.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Modal } from '../../../components/ui/Modal.js';
import { useAuthStore } from '../../../app/store.js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exampleSchema, ExampleFormValues } from '../schemas/example.schema.js';
import { Plus, FolderKanban, Loader2 } from 'lucide-react';

export const ExamplePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useExamples({ search });
  const { mutate: createItem, isPending: isCreating } = useCreateExample();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      isPublished: true,
    },
  });

  const onSubmit = (formData: ExampleFormValues) => {
    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    createItem(
      {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        isPublished: formData.isPublished,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        },
      }
    );
  };

  const items = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-500" />
            Example Feature Modules
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standard boilerplate CRUD module demonstrating fullstack communication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 sm:w-64"
          />

          {isAuthenticated && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Create Item
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2 text-blue-500" />
          <span>Loading items...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/30 border border-red-900 rounded-xl text-red-400 text-sm">
          Failed to load items.
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-4">No example items created yet.</p>
          {isAuthenticated ? (
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              Create the First Item
            </Button>
          ) : (
            <p className="text-xs text-slate-500">Sign in to add new records</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ExampleCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Record">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="Item title"
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label="Category"
            placeholder="e.g. Technology, Design, Operations"
            error={errors.category?.message}
            {...register('category')}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide a detailed description..."
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-red-400">{errors.description.message}</span>
            )}
          </div>

          <Input
            label="Tags (Comma separated)"
            placeholder="react, express, mongodb"
            error={errors.tags?.message}
            {...register('tags')}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Save Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
