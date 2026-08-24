import { supabase } from './supabase';
import { createStar } from '../utils/createStar';

export async function getLetters() {
    const { data, error } = await supabase
        .from('letters')
        .select('*');

    if (error) {
        throw error;
    }

    return data;
}

export async function createLetter(message: string) {
    const star = createStar(message);

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

    return data;
}