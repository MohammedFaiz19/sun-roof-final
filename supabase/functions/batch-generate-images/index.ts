import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Required environment variables not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch all menu items that need images
    const { data: menuItems, error: fetchError } = await supabase
      .from('menu_items')
      .select('*')
      .or('generated_image_url.is.null,image_generation_status.eq.failed')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (fetchError) {
      console.error('Error fetching menu items:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${menuItems?.length || 0} items to generate images for`);

    const results = {
      total: menuItems?.length || 0,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each item
    for (const item of menuItems || []) {
      try {
        console.log(`Generating image for: ${item.name}`);

        // Update status to generating
        await supabase
          .from('menu_items')
          .update({ image_generation_status: 'generating' })
          .eq('id', item.id);

        // Create detailed prompt for AI image generation
        const prompt = `Create a vibrant 2D flat illustration of ${item.name} ${item.description ? `(${item.description})` : ''} on a colorful plate. Style: modern flat design, bold colors, playful aesthetic, citrus/teal/coral/yellow palette. Include a small ${item.veg_nonveg === 'veg' ? 'green dot' : item.veg_nonveg === 'egg' ? 'brown dot' : 'red dot'} badge in corner. High contrast, food photography inspired, minimalist composition, 1200x800px, overhead view, clean shadows.`;

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image',
            messages: [{
              role: 'user',
              content: prompt
            }],
            modalities: ['image', 'text']
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI Gateway error for ${item.name}:`, response.status, errorText);
          
          await supabase
            .from('menu_items')
            .update({ 
              image_generation_status: 'failed',
            })
            .eq('id', item.id);

          results.failed++;
          results.errors.push(`${item.name}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          console.error(`No image URL in response for ${item.name}`);
          await supabase
            .from('menu_items')
            .update({ image_generation_status: 'failed' })
            .eq('id', item.id);
          
          results.failed++;
          results.errors.push(`${item.name}: No image generated`);
          continue;
        }

        // Update with generated image
        await supabase
          .from('menu_items')
          .update({
            generated_image_url: imageUrl,
            image_generation_status: 'completed',
          })
          .eq('id', item.id);

        console.log(`Successfully generated image for: ${item.name}`);
        results.successful++;

        // Add small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${item.name}:`, error);
        await supabase
          .from('menu_items')
          .update({ image_generation_status: 'failed' })
          .eq('id', item.id);
        
        results.failed++;
        results.errors.push(`${item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log('Batch generation completed:', results);

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in batch-generate-images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate images';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
