import { Prompt } from '@/types';
import { supabase } from './supabase/client';

export const getPrompts = async (): Promise<Prompt[]> => {
    const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
    }

    return (data as any[])?.map(item => ({
        ...item,
        createdAt: new Date(item.created_at).getTime(),
        sourceUrl: item.source_url,
        sourceTitle: item.source_title
    })) || [];
};

export const savePrompt = async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'created_at'>): Promise<Prompt | null> => {
    const { data, error } = await supabase
        .from('prompts')
        .insert([{
            title: prompt.title,
            content: prompt.content,
            tags: prompt.tags,
            source_url: prompt.sourceUrl,
            source_title: prompt.sourceTitle,
            user_id: prompt.user_id
        }])
        .select()
        .single();

    if (error) {
        console.error('Error saving prompt:', error);
        throw error;
    }

    return {
        ...data,
        createdAt: new Date(data.created_at).getTime(),
        sourceUrl: data.source_url,
        sourceTitle: data.source_title
    };
};

export const updatePrompt = async (updatedPrompt: Prompt): Promise<void> => {
    const { error } = await supabase
        .from('prompts')
        .update({
            title: updatedPrompt.title,
            content: updatedPrompt.content,
            tags: updatedPrompt.tags,
            source_url: updatedPrompt.sourceUrl,
            source_title: updatedPrompt.sourceTitle,
            updated_at: new Date().toISOString()
        })
        .eq('id', updatedPrompt.id);

    if (error) {
        throw error;
    }
};

export const deletePrompt = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }
};

export const getAllTags = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('prompts')
        .select('tags');

    if (error) {
        console.error('Error fetching tags:', error);
        return [];
    }

    const tags = new Set<string>();
    data?.forEach((row: any) => {
        row.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
};
