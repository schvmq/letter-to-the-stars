import { supabase } from './supabase';
import { createStar } from '../utils/createStar';
import type { Star } from '../types/star';

export async function getLetters(): Promise<Star[]> {
    const { data, error } = await supabase
        .from('letters')
        .select('*');

    if (error) {
        throw error;
    }

    return (data ?? []).map((item) => ({
        id: item.id,
        message: item.message,
        createdAt: item.created_at,
        x: item.x,
        y: item.y,
        size: item.size,
        brightness: item.brightness,
        shape: item.shape,
    }));
}

export async function createLetter(message: string) {
    const { data: existingStars, error: fetchError } = await supabase
        .from('letters')
        .select('x, y');

    if (fetchError) {
        throw fetchError;
    }

    const star = createStar(
        message,
        existingStars ?? []
    );

    const { data, error } = await supabase
        .from('letters')
        .insert({
            message: star.message,
            x: star.x,
            y: star.y,
            size: star.size,
            brightness: star.brightness,
            shape: star.shape,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return {
        id: data.id,
        message: data.message,
        createdAt: data.created_at,
        x: data.x,
        y: data.y,
        size: data.size,
        brightness: data.brightness,
        shape: data.shape,
    };
}